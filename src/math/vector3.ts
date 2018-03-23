
import { Euler } from './euler';
import { Matrix4 } from './matrix4';
import { Quaternion } from './quaternion';
import { Spherical } from './spherical';

/**
 * 注：不能在这里初始化，否则会引起模块的循环引用
 */
// tslint:disable:variable-name
let _v: Vector3;

/**
 * 注：不能在这里初始化，否则会引起模块的循环引用
 */
let _q: Quaternion;

export class Vector3 {

	/**
	 * @description x, y, z
	 */
	public x: number;
	public y: number;
	public z: number;

	/**
	 * @description 构造函数
	 * @note 这里为了性能考虑，不用默认参数
	 */
	constructor(x?: number, y?: number, z?: number) {
		this.x = x || 0.0;
		this.y = y || 0.0;
		this.z = z || 0.0;
	}

	/**
	 * @description 设置函数
	 */
	// tslint:disable-next-line:no-reserved-keywords
	public set(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	}

	/**
	 * @description 设置标量
	 */
	public setScalar(scalar: number) {
		this.x = this.y = this.z = scalar;

		return this;
	}

	/**
	 * @description 取x
	 */
	public getX() {
		return this.x;
	}

	/**
	 * @description 取y
	 */
	public getY() {
		return this.y;
	}

	/**
	 * @description 取z
	 */
	public getZ() {
		return this.z;
	}

	/**
	 * 判断v和this是否相等
	 */
	public equals(v: Vector3) {
		return (
			Math.abs(v.x - this.x) < 0.0001 &&
			Math.abs(v.y - this.y) < 0.0001 &&
			Math.abs(v.z - this.z) < 0.0001
		);
	}

	/**
	 * 从数组array的offset中取值
	 */
	public fromArray(array: number[] | Float32Array, offset?: number) {
		offset = offset || 0;
		this.x = array[offset];
		this.y = array[offset + 1];
		this.z = array[offset + 2];

		return this;
	}

	/**
	 * 赋值到array去
	 */
	public toArray(array?: number[], offset?: number) {
		if (array === undefined) array = [];
		if (offset === undefined) offset = 0;
		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;

		return array;
	}

	/**
	 * @description 拷贝
	 */
	public copy(src: Vector3) {
		this.x = src.x;
		this.y = src.y;
		this.z = src.z;

		return this;
	}

	/**
	 * @description 克隆
	 */
	public clone() {
		return new Vector3(this.x, this.y, this.z);
	}

	/**
	 * @description this += src
	 */
	public add(src: Vector3) {
		this.x += src.x;
		this.y += src.y;
		this.z += src.z;

		return this;
	}

	/**
	 * @description this += new Vector3(scalar, scalar, scalar)
	 */
	public addScalar(scalar: number) {
		this.x += scalar;
		this.y += scalar;
		this.z += scalar;

		return this;
	}

	/**
	 * @description this = src1 + src2;
	 */
	public addVectors(src1: Vector3, src2: Vector3) {
		this.x = src1.x + src2.x;
		this.y = src1.y + src2.y;
		this.z = src1.z + src2.z;

		return this;
	}

	/**
	 * @description this += scalar * src;
	 */
	public addScaledVector(src: Vector3, scalar: number) {
		this.x += scalar * src.x;
		this.y += scalar * src.y;
		this.z += scalar * src.z;

		return this;
	}

	/**
	 * @description this -= src;
	 */
	public sub(src: Vector3) {
		this.x -= src.x;
		this.y -= src.y;
		this.z -= src.z;

		return this;
	}

	/**
	 * @description this -= new Vector3(scalar, scalar, scalar)
	 */
	public subScalar(scalar: number) {
		this.x -= scalar;
		this.y -= scalar;
		this.z -= scalar;

		return this;
	}

	/**
	 * @description this = src1 - src2;
	 */
	public subVectors(src1: Vector3, src2: Vector3) {
		this.x = src1.x - src2.x;
		this.y = src1.y - src2.y;
		this.z = src1.z - src2.z;

		return this;
	}

	/**
	 * @description this *= src;
	 */
	public multiply(src: Vector3) {
		this.x *= src.x;
		this.y *= src.y;
		this.z *= src.z;

		return this;
	}

	/**
	 * @description this *= new Vector3(scaler, scaler, scaler);
	 */
	public multiplyScalar(scalar: number) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	}

	/**
	 * @description this = src1 * src2;
	 */
	public multiplyVectors(src1: Vector3, src2: Vector3) {
		this.x = src1.x * src2.x;
		this.y = src1.y * src2.y;
		this.z = src1.z * src2.z;

		return this;
	}

	/**
	 * @description this /= src;
	 */
	public divide(src: Vector3) {
		this.x /= src.x;
		this.y /= src.y;
		this.z /= src.z;

		return this;
	}

	/**
	 * @description this /= new Vector3(scalar, scalar, scalar)
	 */
	public divideScalar(scalar: number) {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;

		return this;
	}

	/**
	 * @description this = this, src对应分量的最小值
	 */
	public min(src: Vector3) {
		this.x = this.x < src.x ? this.x : src.x;
		this.y = this.y < src.y ? this.y : src.y;
		this.z = this.z < src.z ? this.z : src.z;

		return this;
	}

	/**
	 * @description this = this, src对应分量的最大值
	 */
	public max(src: Vector3) {
		this.x = this.x > src.x ? this.x : src.x;
		this.y = this.y > src.y ? this.y : src.y;
		this.z = this.z > src.z ? this.z : src.z;

		return this;
	}

	/**
	 * @description this 的对应分量截取在min到max之间
	 * @note 假设 min < max
	 */
	public clamp(min: Vector3, max: Vector3) {
		this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));
		this.z = Math.max(min.z, Math.min(max.z, this.z));

		return this;
	}

	/**
	 * @description this 的对应分量截取在min到max之间
	 * @note 假设 min < max
	 */
	public clampScalar(min: number, max: number) {
		this.x = Math.max(min, Math.min(max, this.x));
		this.y = Math.max(min, Math.min(max, this.y));
		this.z = Math.max(min, Math.min(max, this.z));

		return this;
	}

	/**
	 * @description 取相反数
	 */
	public negate() {
		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;

		return this;
	}

	/**
	 * @description 点积
	 */
	public dot(src: Vector3) {
		return this.x * src.x + this.y * src.y + this.z * src.z;
	}

	/**
	 * @description 长度的平方
	 */
	public lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	/**
	 * @description 长度
	 */
	public length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	/**
	 * @description 曼哈顿长度
	 */
	public lengthManhattan() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}

	/**
	 * @description 单位化
	 */
	public normalize() {
		return this.divideScalar(this.length());
	}

	/**
	 * @description 将向量的长度改为length
	 */
	public setLength(length: number) {
		return this.multiplyScalar(length / this.length());
	}

	/**
	 * @description 线性插值 this = v * alpha + this * (1 - alpha)
	 */
	public lerp(v: Vector3, alpha: number) {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		this.z += (v.z - this.z) * alpha;

		return this;
	}

	/**
	 * @description 线性插值 this = v2 * alpha + v1 * (1 - alpha)
	 */
	public lerpVectors(v1: Vector3, v2: Vector3, alpha: number) {
		this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		return this;
	}

	/**
	 * @description 叉乘 this = this * v
	 */
	public cross(v: Vector3) {
		const x = this.x;
		const y = this.y;
		const z = this.z;
		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;
	}

	/**
	 * @description 叉乘 this = a * b
	 */
	public crossVectors(a: Vector3, b: Vector3) {
		// 注：全部取出来放到临时变量是因为有可能this和a或者b是同一个对象
		const ax = a.x;
		const ay = a.y;
		const az = a.z;
		const bx = b.x;
		const by = b.y;
		const bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;
	}

	/**
	 * @description 计算this在v的投影向量
	 */
	public projectOnVector(v: Vector3) {
		if (_v === undefined) {
			_v = new Vector3();
		}
		_v.copy(v).normalize();
		const dot = this.dot(_v);

		return this.copy(_v).multiplyScalar(dot);
	}

	/**
	 * @description 计算this在平面的投影向量
	 */
	public projectOnPlane(planeNormal: Vector3) {
		if (_v === undefined) {
			_v = new Vector3();
		}
		_v.copy(this).projectOnVector(planeNormal);

		return this.sub(_v);
	}

	/**
	 * @description 计算this在normal的反射向量
	 */
	public reflect(normal: Vector3) {
		if (_v === undefined) {
			_v = new Vector3();
		}
		
		return this.sub(_v.copy(normal).multiplyScalar(this.dot(normal) * 2));
	}

	/**
	 * @description 计算this和v之间的夹角
	 */
	public angleTo(v: Vector3) {
		let theta = this.dot(v) / (Math.sqrt(this.lengthSq() * v.lengthSq()));

		// acos的定义域在 [-1, 1]
		theta = theta < -1 ? -1 : theta;
		theta = theta > 1 ? 1 : theta;

		return Math.acos(theta);
	}

	/**
	 * @description 计算this到v的距离的平方
	 */
	public distanceToSq(v: Vector3) {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		const dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;
	}

	/**
	 * @description 计算this到v的距离
	 */
	public distanceTo(v: Vector3) {
		return Math.sqrt(this.distanceToSq(v));
	}

	/**
	 * @description 应用欧拉角 旋转到本向量
	 */
	public applyEuler(euler: Euler) {
		if (_q === undefined) {
			_q = new Quaternion();
		}
		this.applyQuaternion(_q.setFromEuler(euler));

		return this;
	}

	/**
	 * @description 应用轴-角度 旋转到本向量
	 * @param angleRed 单位弧度
	 */
	public applyAxisAngle(axis: Vector3, angleRad: number) {
		if (_q === undefined) {
			_q = new Quaternion();
		}
		this.applyQuaternion(_q.setFromAxisAngle(axis, angleRad));

		return this;
	}

	/**
	 * @description 应用矩阵到向量
	 */
	public applyVector(m: Matrix4) {
		const x = this.x;
		const y = this.y;
		const z = this.z;
		const e = m.elements;

		this.x = e[0] * x + e[4] * y + e[8] * z;
		this.y = e[1] * x + e[5] * y + e[9] * z;
		this.z = e[2] * x + e[6] * y + e[10] * z;

		return this;
	}

	/**
	 * @description 应用矩阵到点
	 * @param m 仿射矩阵
	 */
	public applyPoint(m: Matrix4) {
		const x = this.x;
		const y = this.y;
		const z = this.z;
		const e = m.elements;

		this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
		this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
		this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

		return this;
	}

	/**
	 * @description 应用矩阵到点
	 * @param m 投影矩阵
	 */
	public applyProjection(m: Matrix4) {
		const x = this.x;
		const y = this.y;
		const z = this.z;
		const e = m.elements;
		const d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide

		this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
		this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
		this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;

		return this;
	}

	/**
	 * @description 应用四元数 旋转到本向量
	 */
	public applyQuaternion(q: Quaternion) {
		const x = this.x;
		const y = this.y;
		const z = this.z;

		const qx = q.x;
		const qy = q.y;
		const qz = q.z;
		const qw = q.w;

		// calculate quat * vector

		const ix = qw * x + qy * z - qz * y;
		const iy = qw * y + qz * x - qx * z;
		const iz = qw * z + qx * y - qy * x;
		const iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;
	}

	/**
	 * @description 球面坐标转直角坐标
	 */
	public setFromSpherical(s: Spherical) {
		const sinPhiRadius = Math.sin(s.phi) * s.radius;
		this.x = sinPhiRadius * Math.sin(s.theta);
		this.y = Math.cos(s.phi) * s.radius;
		this.z = sinPhiRadius * Math.cos(s.theta);
		
		return this;
	}

	/**
	 * @description 从矩阵中取出位置分量
	 */
	public setFromMatrixPosition(m: Matrix4) {
		return this.setFromMatrixColumn(m, 3);
	}

	/**
	 * @description 从矩阵中取出缩放分量
	 */
	public setFromMatrixScale(m: Matrix4) {
		const sx = this.setFromMatrixColumn(m, 0).length();
		const sy = this.setFromMatrixColumn(m, 1).length();
		const sz = this.setFromMatrixColumn(m, 2).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;
	}

	/**
	 * @description 取矩阵的第index列
	 */
	public setFromMatrixColumn(m: Matrix4, index: number) {
		return this.fromArray(m.elements, index * 4);
	}

}