/**
 * 
 */
import { NavMesh, Polygon } from '../../ecs/navmesh';
import { butil, commonjs } from '../../lang/mod';
import { Json } from '../../lang/type';
import { Vector3 } from '../../math/vector3';
import { loadDir } from '../../widget/util';
import { Widget } from '../../widget/widget';

let navMesh: NavMesh;
let minX = Number.POSITIVE_INFINITY;
let maxZ = Number.NEGATIVE_INFINITY;
const factor = 20;
export class NavTest extends Widget {
	public ctx: any;
	public start: any;
	public firstPaint(): void {
		const can = (<any>this.tree).children[0].link;
		this.ctx = can.getContext('2d');
		for (let i = 0; i < navMesh.polygons.length; i++) {
			drawPoly(navMesh.polygons[i], this.ctx);
		}
	}
	public click(e: MouseEvent): void {
		if (!this.start) {
			this.start = new Vector3(e.offsetX / factor + minX, 0, -e.offsetY / factor + maxZ);
		} else {
			const points = navMesh.findPath(this.start, new Vector3(e.offsetX / factor + minX, 0, -e.offsetY / factor + maxZ), 1);
			this.start = null;
			drawPath(points, this.ctx);
		}
	}
}

export const drawPoly = (poly: Polygon, ctx: CanvasRenderingContext2D) => {
	ctx.strokeStyle = 'red';
	ctx.fillStyle = 'rgba(255,0,0,0.1)';
	ctx.beginPath();
	ctx.moveTo((poly.navMesh.vertexs[poly.indexs[0]].x - minX) * factor, -(poly.navMesh.vertexs[poly.indexs[0]].z - maxZ) * factor);
	for (let i = 1; i < poly.indexs.length; i++) {
		ctx.lineTo((poly.navMesh.vertexs[poly.indexs[i]].x - minX) * factor, -(poly.navMesh.vertexs[poly.indexs[i]].z - maxZ) * factor);
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};

export const drawPath = (vs: Vector3[], ctx: CanvasRenderingContext2D) => {
	ctx.strokeStyle = 'green';
	ctx.beginPath();
	ctx.moveTo((vs[0].x - minX) * factor, -(vs[0].z - maxZ) * factor);
	for (let i = 1; i < vs.length; i++) {
		ctx.lineTo((vs[i].x - minX) * factor, -(vs[i].z - maxZ) * factor);
	}
	ctx.stroke();
};

loadDir(['examples/render/res/nav/'], commonjs.flags, {}, {}, fileMap => {
	navMesh = new NavMesh();
	navMesh.load(fileMap['examples/render/res/nav/scene_map01.nav']);
	for (let i = 0; i < navMesh.vertexs.length; i++) {
		if (navMesh.vertexs[i].x < minX) {
			minX = navMesh.vertexs[i].x;
		}
		if (navMesh.vertexs[i].z > maxZ) {
			maxZ = navMesh.vertexs[i].z;
		}
	}
	// tslint:disable-next-line:no-empty
}, () => { }, () => { });
