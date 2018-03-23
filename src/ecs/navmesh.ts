/**
 * 基于导航网格的寻路模块
 */

import { AABB } from '../math/aabb';
import { astar, Node } from '../math/astar';
import { Vector3 } from '../math/vector3';
import * as Hash from '../util/hash';

/**
 * 多边形信息
 */
export class Polygon {

	public navMesh: NavMesh;
	public index: number;// 自身索引
	public cost: number;// 代价

	public indexs: number[];          // 点在vertex数组的索引
	public adjacency: number[];   // 邻接信息

	public center: Vector3;    // 中心点，就是多边形所有顶点的坐标的平均值

	public box: AABB;

	constructor(navMesh: NavMesh, indexs: number[], adj: number[], cost: number, index: number) {
		this.indexs = indexs;
		this.adjacency = adj;
		this.navMesh = navMesh;
		this.cost = cost;
		this.index = index;
		this.computeCenter();
		this.computeBox();
	}

	// 多边形是否包含点
	public containsPoint(point: Vector3) {
		let vec1 = new Vector3().subVectors(this.navMesh.vertexs[this.indexs[this.indexs.length - 1]], point);
		let vec2 = new Vector3().subVectors(this.navMesh.vertexs[this.indexs[0]], point);
		let ret1 = new Vector3().crossVectors(vec1, vec2);
		let vec3 = new Vector3();
		let ret2 = new Vector3();
		let temp;
		for (let i = 1; i < this.indexs.length; i++) {
			vec3.subVectors(this.navMesh.vertexs[this.indexs[i]], point);
			ret2.crossVectors(vec2, vec3);
			if (ret2.dot(ret1) < 0) {
				return false;// 如果新的叉乘向量与老的叉乘向量不等，则点不在多边形内
			}
			vec1 = vec2;
			vec2 = vec3;
			vec3 = vec1;
			temp = ret2;
			ret2 = ret1;
			ret1 = temp;
		}

		return true;
	}

	// 计算中心点
	private computeCenter() {
		this.center = new Vector3();
		let x = 0;
		let y = 0;
		let z = 0;
		let vec: Vector3;
		// TODO 循环顶点，计算和
		for (const v of this.indexs) {
			vec = this.navMesh.vertexs[v];
			x += vec.x;
			y += vec.y;
			z += vec.z;
		}
		this.center.x = x / this.indexs.length;
		this.center.y = y / this.indexs.length;
		this.center.z = z / this.indexs.length;
	}

	// 计算包围盒
	private computeBox() {
		let maxX;
		let minX;
		let maxZ;
		let minZ;
		let vec = this.navMesh.vertexs[this.indexs[0]];
		maxX = minX = vec.x;
		maxZ = minZ = vec.z;
		for (let i = 1; i < this.indexs.length; i++) {
			vec = this.navMesh.vertexs[this.indexs[i]];
			if (maxX < vec.x) {
				maxX = vec.x;
			} else if (minX > vec.x) {
				minX = vec.x;
			}
			if (maxZ < vec.z) {
				maxZ = vec.z;
			} else if (minZ > vec.z) {
				minZ = vec.z;
			}
		}
		this.box = new AABB(new Vector3(minX, 0, minZ), new Vector3(maxX, 0, maxZ));
	}

}

export class LSegment implements Node {
	public p1: Vector3;
	public p2: Vector3;
	public center: Vector3;
	public adjs: [number, number];// 相邻多边形
	public endPoint: SEPoint;
	public navMesh: NavMesh;// 相邻多边形
	public cost: number;
	constructor(navMesh: NavMesh, p1: Vector3, p2: Vector3, poly1: number, poly2: number) {
		this.p1 = p1;
		this.p2 = p2;
		this.navMesh = navMesh;
		this.adjs = [poly1, poly2];
		this.center = new Vector3((this.p1.x + this.p2.x) / 2, (this.p1.y + this.p2.y) / 2, (this.p1.z + this.p2.z) / 2);
	}

	// 上一点到该点的代价函数
	/* tslint:disable:function-name */
	public g(last: Node) {
		if (last.cost) {
			return this.center.distanceTo((<any>last).center) * last.cost;
		} else {
			return this.center.distanceTo((<any>last).center) * getAdjPoly(this.navMesh, last as LSegment, this).cost;
		}
	}

	// 估值函数，值是从该点到终点的估计价值
	public h(finish: Node) {
		if (finish.cost) {
			return this.center.distanceTo((<any>finish).center) * finish.cost;
		} else {
			return this.center.distanceTo((<any>finish).center) * getAdjPoly(this.navMesh, finish as LSegment, this).cost;
		}
	}

	// 迭代器：返回邻居
	public *[Symbol.iterator]() {
		let adjsIndexs: number[];
		let poly: Polygon;
		if (this.endPoint) {
			yield this.endPoint;
		} else {
			for (const polyIndex of this.adjs) {
				poly = this.navMesh.polygons[polyIndex];
				adjsIndexs = poly.adjacency;
				for (const i of adjsIndexs) {
					yield getAdjLine(this.navMesh, this.navMesh.polygons[i], poly);
				}
			}
		}
	}
}

// 起点和终点
export class SEPoint implements Node {
	public center: Vector3;
	public navMesh: NavMesh;
	public cost: number;
	public adjLs: Node[];// 相邻节点
	public poly: Polygon;
	constructor(navMesh: NavMesh, center: Vector3, poly: Polygon) {
		this.center = center;
		this.navMesh = navMesh;
		this.poly = poly;
	}

	// 上一点到该点的代价函数
	public g(last: Node) {
		return this.center.distanceTo((<any>last).center) * this.cost;
	}

	// 估值函数，值是从该点到终点的估计价值
	public h(finish: Node) {
		return this.center.distanceTo((<any>finish).center) * this.cost;
	}

	// 迭代器：返回邻居
	public *[Symbol.iterator]() {
		for (const adj of this.adjLs) {
			yield adj;
		}
	}
}

/* tslint:disable:max-classes-per-file */
export class NavMesh {
	public vertexs: Vector3[];   // 顶点的位置信息
	public polygons: Polygon[];         // 多边形
	public adjMap: Map<number, LSegment>;// 相邻边
	// radio: number//目标半径

	constructor() {
		this.vertexs = [];
		this.polygons = [];
		this.adjMap = new Map<number, LSegment>();
	}

	/**
	 * 寻路
	 * @param start 起点
	 * @param end  终点
	 * @param radio 待寻路物体的半径
	 * @return 路径，Vector3的数组
	 */
	public findPath(start: Vector3, end: Vector3, radio: number = 0) {
		const newEnd = new Vector3();
		const sNode = this.findNearest(start);
		const eNode = this.findNearest(end);
		for (let i = 0; i < eNode.adjLs.length; i++) {
			(<LSegment>eNode.adjLs[i]).endPoint = eNode;
		}
		if (sNode.poly === eNode.poly) {
			sNode.adjLs.push(eNode);
		}

		// this.radio = radio;
		const paths = [];
		astar(paths, sNode, eNode);

		for (let i = 0; i < eNode.adjLs.length; i++) {
			(<LSegment>eNode.adjLs[i]).endPoint = null;
		}

		return this.funnel(paths, start, (<SEPoint>eNode).center, radio);
	}

	/**
	 * 加载
	 * NavMesh文件格式 **.nav
	 * 16字节：magic字符串：utf-8格式"NAVIGAT_V0010000"
	 * 4字节：索引结束索引，int32
	 * 4字节：顶点结束索引，int32
	 * n字节：多边形索引，顶点数一定小于65536（规定）, 用short写（2字节）
	 * n字节：顶点,每顶点12字节
	 * n字节：多边形描述（相邻多边形的个数【int16，2字节】，代价【int16，2字节】, 相邻多边形的索引【int16】， 与相邻多边形的共点【int16】）
	 * @param data 从Unity导出的二进制对象
	 */
	public load(data: ArrayBuffer) {
		const i32 = new Int32Array(data, 16, 2);
		const iEnd = i32[0];// 顶点结束索引 4字节
		const vEnd = i32[1];// 顶点结束索引 4字节

		const vectorData = new Float32Array(data, iEnd, (vEnd - iEnd) / 4);
		let vector: Vector3;
		let startIndex;
		for (let i = 0; i < vectorData.length / 3; i++) {
			startIndex = i * 3;
			vector = new Vector3(vectorData[startIndex], 0, vectorData[startIndex + 2]);
			this.vertexs.push(vector);
		}

		const faceData = new Int16Array(data, 24, (iEnd - 24) / 2);
		let ploy: Polygon;
		let indexs: number[];
		let adjPloy;
		// let adjPoint;
		let side;
		let cost;
		let index;
		let hash;
		for (let i = 0; i < faceData.length;) {
			side = faceData[i++];
			cost = faceData[i++];
			adjPloy = [];
			indexs = [];
			index = this.polygons.length;
			for (let j = 0; j < side; j++) {
				indexs.push(faceData[i++]);
			}
			for (let j = 0; j < side; j++) {
				if (faceData[i++] === -1) {
					continue;
				}
				adjPloy.push(faceData[i - 1]);
				hash = Hash.nextHash(Math.min(faceData[i - 1], index), Math.max(faceData[i - 1], index));
				if (!this.adjMap.get(hash)) {
					this.adjMap.set(hash, new LSegment(this, this.vertexs[indexs[j]], this.vertexs[getNext(indexs, j)], faceData[i - 1], index));
				}
			}
			ploy = new Polygon(this, indexs, adjPloy, cost, index);
			this.polygons.push(ploy);
		}
	}

	/**
	 * 找最邻近的多边形（如果点在某个多边形内部，返回那个多边形）
	 * newPoint--point不一定在可行走区域，newPoint为与point最近的多边形上的点
	 */
	private findNearest(point: Vector3): SEPoint {
		let sep;
		let i = 0;
		for (const p of this.polygons) {
			i++;
			// 检查点是否在多边形的包围盒内部
			if (!p.box.containsPoint(point)) {
				continue;
			}
			// 检查点是否在多边形的内部
			if (p.containsPoint(point)) {
				sep = new SEPoint(this, point, p);
				sep.adjLs = getAdjLines(p);
				sep.cost = p.cost;

				return sep;
			}
		}

		// 点不在可行走区域时，执行以下代码	
		let min = Number.POSITIVE_INFINITY;
		let tempDistance;
		let ploy: Polygon;
		for (const p of this.polygons) {
			tempDistance = p.center.distanceTo(point);
			if (tempDistance < min) {
				min = tempDistance;
				ploy = p;
			}
		}

		let v1: Vector3;
		let v2: Vector3;
		let jionPoint: Vector3;
		let temp1: Vector3;
		let temp2: Vector3;
		let n: Vector3;
		let verticalP: Vector3;
		let tempDist;
		let shadowL;
		let minDist = Number.POSITIVE_INFINITY;
		for (let i = 0; i < ploy.indexs.length; i++) {
			v1 = this.vertexs[ploy.indexs[i]];
			v2 = this.vertexs[getNext(ploy.indexs, i)];
			// temp1，temp2为向量v2-v1,v2-point
			temp1 = new Vector3().subVectors(v1, v2);
			temp2 = new Vector3().subVectors(point, v2);
			n = temp1.normalize();
			shadowL = temp2.dot(n);
			// 如果temp2与n上的差乘小于0，temp2与n为钝角，point更靠近v2
			if (shadowL < 0) {
				/* tslint:disable:no-conditional-assignment */
				if ((tempDist = point.distanceTo(v2)) < minDist) {
					jionPoint = v2;
					minDist = tempDist;
				}
				// 如果temp2与n上的差乘大于temp1的模，point更靠近v2
			} else if (shadowL > v1.distanceTo(v2)) {
				if ((tempDist = point.distanceTo(v1)) < minDist) {
					jionPoint = v1;
					minDist = tempDist;
				}
				// 如果temp2与n上的差乘小于temp1的模，大于0，point到temp1的最短距离为point到temp1的垂线
			} else {
				verticalP = new Vector3().addVectors(new Vector3(shadowL * n.x, shadowL * n.y, shadowL * n.z), v2);
				if ((tempDist = point.distanceTo(verticalP)) < minDist) {
					jionPoint = verticalP;
					minDist = tempDist;
				}
			}
		}
		sep = new SEPoint(this, jionPoint, ploy);
		sep.cost = ploy.cost;
		sep.adjLs = getAdjLines(ploy);

		return sep;
	}

	/**
	 * 拉直: 漏斗算法，返回Vector3[]
	 * 共边上的点根据半径往回缩减
	 *  http://liweizhaolili.lofter.com/post/1cc70144_86a939e
	 *  http://digestingduck.blogspot.hk/2010/03/simple-stupid-funnel-algorithm.html
	 */
	/* tslint:disable:cyclomatic-complexity */
	private funnel(node: Node[], start: Vector3, end: Vector3, radio: number = 0) {
		const points = [] as Vector3[];
		if (node.length === 1) {
			points.push(start);
			points.push(end);

			return points;
		}

		let oldV1: Vector3;
		let oldV2: Vector3;
		let newV1: Vector3;
		let newV2: Vector3;
		let radioV: Vector3;
		let adjLine: LSegment;// 相邻多边形共线
		let lastLine: Vector3;// lastPoint指向end的向量
		const maxIndex = node.length - 1;
		let lastPoint = start;
		let lastIndex1 = 0;
		let lastIndex2 = 0;
		points.push(start);
		for (let i = 1; i < maxIndex; i++) {
			adjLine = node[i] as LSegment;
			radioV = new Vector3().subVectors(adjLine.p2, adjLine.p1).normalize().multiplyScalar(radio);
			newV1 = new Vector3().subVectors(new Vector3().addVectors(adjLine.p1, radioV), lastPoint);
			newV2 = new Vector3().subVectors(new Vector3().subVectors(adjLine.p2, radioV), lastPoint);

			if (!oldV1 || !oldV2) {
				oldV1 = newV1;
				oldV2 = newV2;
				lastIndex1 = lastIndex2 = i;
				// 如果有一个为零向量，直接更新
			} else if (isZeroVector(oldV1) || isZeroVector(oldV2)) {
				oldV1 = newV1;
				oldV2 = newV2;
				lastIndex1 = i;
				lastIndex2 = i;
			} else {
				// newV1超出oldV1, oldV2夹角范围， 与oldV2相邻
				if (vIsOrder(oldV1, oldV2, newV1)) {
					// newV1超出oldV1, oldV2夹角范围， 与oldV2相邻， 设置oldV2为拐点
					if (vIsOrder(oldV1, oldV2, newV2)) {
						lastPoint = oldV2.add(lastPoint);
						points.push(lastPoint);
						oldV1 = oldV2 = null;
						i = lastIndex2;
						continue;
						// newV2在oldV1, oldV2夹角范围内， 更新oldV1为newV2
					} else if (vIsOrder(oldV1, newV2, oldV2)) {
						oldV1 = newV2;
						lastIndex1 = i;
					}
					// newV1超出oldV1, oldV2夹角范围， 与oldV1相邻；
				} else if (vIsOrder(newV1, oldV1, oldV2)) {
					// newV2超出oldV1, oldV2夹角范围， 与oldV1相邻， 设置oldV1为拐点
					if (vIsOrder(oldV2, oldV1, newV2)) {
						lastPoint = oldV1.add(lastPoint);
						points.push(lastPoint);
						oldV1 = oldV2 = null;
						i = lastIndex1;
						continue;
						// newV2在oldV1, oldV2夹角范围内， 与oldV1相邻；
					} else if (vIsOrder(oldV1, newV2, oldV2)) {
						oldV2 = newV2;
						lastIndex2 = i;
					}
					// newV1在oldV1, oldV2夹角范围内
				} else {
					// newV2超出oldV1, oldV2夹角范围， 与oldV2相邻， 更新oldV1为newV1;
					if (vIsOrder(oldV1, oldV2, newV2)) {
						oldV1 = newV1;
						lastIndex1 = i;
						// newV2超出oldV1, oldV2夹角范围， 与oldV1相邻， 更新oldV2为newV1;
					} else if (vIsOrder(newV2, oldV1, oldV2)) {
						oldV2 = newV1;
						lastIndex2 = i;
						// newV2在oldV1, oldV2夹角范围内， 更新oldV1为newV1， oldV2为newV2;
					} else if (vIsOrder(oldV1, newV2, oldV2)) {
						oldV1 = newV1;
						oldV2 = newV2;
						lastIndex1 = i;
						lastIndex2 = i;
					}
				}

			}

			// 已经遍历到最后一个节点，连接lastPoint与end为向量lastLine
			if (i === maxIndex - 1 && oldV1 && oldV2 && !isZeroVector(oldV1) && !isZeroVector(oldV2)) {
				lastLine = new Vector3().subVectors(end, lastPoint);
				// lastLine超出oldV1与oldV2的夹角范围，与oldV1相邻时，设置oldV1为拐点
				if (vIsOrder(lastLine, oldV1, oldV2)) {
					lastPoint = new Vector3().addVectors(lastPoint, oldV1);
					oldV1 = oldV2 = null;
					i = lastIndex1;
					points.push(lastPoint);
					// lastLine超出oldV1与oldV2的夹角范围，与oldV2相邻时，设置oldV2为拐点
				} else if (vIsOrder(lastLine, oldV2, oldV1)) {
					lastPoint = new Vector3().addVectors(lastPoint, oldV2);
					oldV1 = oldV2 = null;
					i = lastIndex2;
					points.push(lastPoint);
				}
			}
		}
		points.push(end);

		return points;
	}
}

const getNext = (arr: any[], i: number) => {
	if (i === arr.length - 1) {
		return arr[0];
	} else {
		return arr[i + 1];
	}
};

// 取到两多边形的共边
const getAdjLine = (navMesh: NavMesh, poly1: Polygon, poly2: Polygon): LSegment => {
	const max = Math.max(poly1.index, poly2.index);
	const min = Math.min(poly1.index, poly2.index);

	return navMesh.adjMap.get(Hash.nextHash(min, max));
};

// 取到两边所在的多边形
const getAdjPoly = (navMesh: NavMesh, l1: LSegment, l2: LSegment): Polygon => {
	for (let i = 0; i < l1.adjs.length; i++) {
		for (let j = 0; j < l2.adjs.length; j++) {
			if (l1.adjs[i] === l2.adjs[j]) {
				return navMesh.polygons[l1.adjs[i]];
			}
		}
	}
};

// 取到多边形中，有相邻多边形的边
const getAdjLines = (poly: Polygon): LSegment[] => {
	const lines = [];
	for (let i = 0; i < poly.adjacency.length; i++) {
		lines.push(getAdjLine(poly.navMesh, poly, poly.navMesh.polygons[poly.adjacency[i]]));
	}

	return lines;
};

// 检查三个向量是否按顺序排布
const vIsOrder = (v1: Vector3, v2: Vector3, v3: Vector3): boolean => {
	const cross1 = new Vector3().crossVectors(v2, v1);
	const cross2 = new Vector3().crossVectors(v2, v3);

	return (cross1.dot(cross2) <= 0);
};

// 是零向量
const isZeroVector = (v: Vector3): boolean => {
	return (v.x === v.y && v.y === v.z && v.z === 0);
};