/**
 * @description 四元数
 */
import { equal } from '../util/math';
import { Euler, RotationOrder } from './euler';
import { Matrix4 } from './matrix4';
import { Vector3 } from './vector3';

/**
 * 注：不能在这里初始化，否则会引起模块的循环引用
 */
/* tslint:disable:variable-name  number-literal-format no-reserved-keywords*/
let _v: Vector3;

export class Quaternion {
	public x: number;
	public y: number;
	public z: number;
	public w: number;

	/**
	 * * @description 构造
	 */
	constructor(x?: number, y?: number, z?: number, w?: number) {
		this.x = x !== undefined ? x : 0.0;
		this.y = y !== undefined ? y : 0.0;
		this.z = z !== undefined ? z : 0.0;
		this.w = w !== undefined ? w : 1.0;
	}

	/**
	 * @description 设置
	 */
	public set(x: number, y: number, z: number, w: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;
	}

	/**
	 * @description 克隆
	 */
	public clone() {
		return new Quaternion(this.x, this.y, this.z, this.w);
	}

	/**
	 * @description 拷贝
	 */
	public copy(quaternion: Quaternion) {
		this.x = quaternion.x;
		this.y = quaternion.y;
		this.z = quaternion.z;
		this.w = quaternion.w;

		return this;
	}

	/**
	 * @description 从欧拉角设置
	 */
	public setFromEuler(euler: Euler) {

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		// 	content/SpinCalc.m

		const c1 = Math.cos(euler.x / 2);
		const c2 = Math.cos(euler.y / 2);
		const c3 = Math.cos(euler.z / 2);
		const s1 = Math.sin(euler.x / 2);
		const s2 = Math.sin(euler.y / 2);
		const s3 = Math.sin(euler.z / 2);

		const order = euler.order;

		if (order === RotationOrder.XYZ) {
			this.x = s1 * c2 * c3 + c1 * s2 * s3;
			this.y = c1 * s2 * c3 - s1 * c2 * s3;
			this.z = c1 * c2 * s3 + s1 * s2 * c3;
			this.w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (order === RotationOrder.YXZ) {
			this.x = s1 * c2 * c3 + c1 * s2 * s3;
			this.y = c1 * s2 * c3 - s1 * c2 * s3;
			this.z = c1 * c2 * s3 - s1 * s2 * c3;
			this.w = c1 * c2 * c3 + s1 * s2 * s3;
		} else if (order === RotationOrder.ZXY) {
			this.x = s1 * c2 * c3 - c1 * s2 * s3;
			this.y = c1 * s2 * c3 + s1 * c2 * s3;
			this.z = c1 * c2 * s3 + s1 * s2 * c3;
			this.w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (order === RotationOrder.ZYX) {
			this.x = s1 * c2 * c3 - c1 * s2 * s3;
			this.y = c1 * s2 * c3 + s1 * c2 * s3;
			this.z = c1 * c2 * s3 - s1 * s2 * c3;
			this.w = c1 * c2 * c3 + s1 * s2 * s3;
		} else if (order === RotationOrder.YZX) {
			this.x = s1 * c2 * c3 + c1 * s2 * s3;
			this.y = c1 * s2 * c3 + s1 * c2 * s3;
			this.z = c1 * c2 * s3 - s1 * s2 * c3;
			this.w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (order === RotationOrder.XZY) {
			this.x = s1 * c2 * c3 - c1 * s2 * s3;
			this.y = c1 * s2 * c3 - s1 * c2 * s3;
			this.z = c1 * c2 * s3 + s1 * s2 * c3;
			this.w = c1 * c2 * c3 + s1 * s2 * s3;
		}

		return this;
	}

	/**
	 * @description 从轴和角度构建
	 * @param axis 轴，必须是单位向量
	 * @param angleRad 角度，单位：弧度
	 */
	public setFromAxisAngle(axis: Vector3, angleRad: number) {
		const halfAngle = angleRad / 2;
		const s = Math.sin(halfAngle);
		this.x = axis.x * s;
		this.y = axis.y * s;
		this.z = axis.z * s;
		this.w = Math.cos(halfAngle);

		return this;
	}

	/**
	 * @description 从旋转矩阵设置四元数
	 * @param m 纯旋转矩阵，不含缩放分量
	 */
	public setFromRotationMatrix(m: Matrix4) {
		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
		const te = m.elements;

		/* tslint:disable:one-variable-per-declaration */
		const m11 = te[0], m12 = te[4], m13 = te[8];
		const m21 = te[1], m22 = te[5], m23 = te[9];
		const m31 = te[2], m32 = te[6], m33 = te[10];

		const trace = m11 + m22 + m33;
		if (trace > 0) {
			const s = 0.5 / Math.sqrt(trace + 1.0);
			this.w = 0.25 / s;
			this.x = (m32 - m23) * s;
			this.y = (m13 - m31) * s;
			this.z = (m21 - m12) * s;
		} else if (m11 > m22 && m11 > m33) {
			const s = Math.sqrt(m11 - m22 - m33 + 1.0) * 2.0;
			this.w = (m32 - m23) / s;
			this.x = s * 0.25;
			this.y = (m12 + m21) / s;
			this.z = (m13 + m31) / s;
		} else if (m22 > m33) {
			const s = Math.sqrt(m22 - m11 - m33 + 1.0) * 2.0;
			this.w = (m13 - m31) / s;
			this.x = (m12 + m21) / s;
			this.y = s * 0.25;
			this.z = (m23 + m32) / s;
		} else {
			const s = Math.sqrt(m33 - m11 - m22 + 1.0) * 2.0;
			this.w = (m21 - m12) / s;
			this.x = (m13 + m31) / s;
			this.y = (m23 + m32) / s;
			this.z = s * 0.25;
		}

		return this;
	}

	/**
	 * @description 单位向量中获取四元数
	 * @param vFrom 单位向量
	 * @param vTo   单位向量
	 */
	public setFromUnitVectors(vFrom: Vector3, vTo: Vector3) {
		// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final
		const EPS = 0.0001;

		if (_v === undefined) _v = new Vector3();
		let r = vFrom.dot(vTo) + 1;
		if (r < EPS) {
			r = 0;
			if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
				_v.set(- vFrom.y, vFrom.x, 0);
			} else {
				_v.set(0, - vFrom.z, vFrom.y);

			}
		} else {
			_v.crossVectors(vFrom, vTo);
		}

		this.x = _v.x;
		this.y = _v.y;
		this.z = _v.z;
		this.w = r;
		this.normalize();

		return this;
	}

	/**
	 * @description 逆
	 */
	public inverse() {
		this.conjugate().normalize();

		return this;
	}

	/**
	 * @description 共轭
	 */
	public conjugate() {
		this.x *= - 1;
		this.y *= - 1;
		this.z *= - 1;

		return this;
	}

	/**
	 * @description 点积
	 */
	public dot(v: Quaternion) {
		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
	}

	/**
	 * @description 长度平方
	 */
	public lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}

	/**
	 * @description 长度
	 */
	public length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}

	/**
	 * @description 单位化
	 */
	public normalize() {
		let l = this.length();
		if (l === 0) {
			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;
		} else {
			l = 1 / l;
			this.x = this.x * l;
			this.y = this.y * l;
			this.z = this.z * l;
			this.w = this.w * l;
		}

		return this;
	}

	/**
	 * @description 相乘 this *= q
	 */
	public multiply(q: Quaternion) {
		return this.multiplyQuaternions(this, q);
	}

	/**
	 * @description 相乘 this = a * b
	 */
	public multiplyQuaternions(a: Quaternion, b: Quaternion) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
		const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;
	}

	/**
	 * @description 球面插值
	 */
	public slerp(qb: Quaternion, t: number) {

		if (t === 0) return this;
		if (t === 1) return this.copy(qb);

		const x = this.x, y = this.y, z = this.z, w = this.w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		let cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;
		if (cosHalfTheta < 0) {
			this.w = - qb.w;
			this.x = - qb.x;
			this.y = - qb.y;
			this.z = - qb.z;
			cosHalfTheta = - cosHalfTheta;
		} else {
			this.copy(qb);
		}
		if (cosHalfTheta >= 1.0) {
			this.w = w;
			this.x = x;
			this.y = y;
			this.z = z;

			return this;
		}

		const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
		if (Math.abs(sinHalfTheta) < 0.001) {
			this.w = (w + this.w) * 0.5;
			this.x = (x + this.x) * 0.5;
			this.y = (y + this.y) * 0.5;
			this.z = (z + this.z) * 0.5;

			return this;
		}

		const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
		const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
			ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

		this.w = (w * ratioA + this.w * ratioB);
		this.x = (x * ratioA + this.x * ratioB);
		this.y = (y * ratioA + this.y * ratioB);
		this.z = (z * ratioA + this.z * ratioB);

		return this;
	}

	/**
	 * @description 相等
	 */
	public equal(q: Quaternion) {
		return equal(q.x, this.x) && equal(q.y, this.y) && equal(q.z, this.z) && equal(q.w, this.w);
	}

	/**
	 * @description 从数组中构造
	 */
	public fromArray(array: number[], offset: number) {
		if (offset === undefined) offset = 0;
		this.x = array[offset];
		this.y = array[offset + 1];
		this.z = array[offset + 2];
		this.w = array[offset + 3];

		return this;
	}

	/**
	 * @description 将值放到数组
	 */
	public toArray(array: number[], offset: number) {
		if (array === undefined) array = [];
		if (offset === undefined) offset = 0;
		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;
		array[offset + 3] = this.w;

		return array;
	}

	/**
	 * @description 平面插值
	 */
	/* tslint:disable:typedef */
	public slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {

		// fuzz-free, array-based Quaternion SLERP operation
		let x0 = src0[srcOffset0 + 0],
			y0 = src0[srcOffset0 + 1],
			z0 = src0[srcOffset0 + 2],
			w0 = src0[srcOffset0 + 3];

		const x1 = src1[srcOffset1 + 0],
			y1 = src1[srcOffset1 + 1],
			z1 = src1[srcOffset1 + 2],
			w1 = src1[srcOffset1 + 3];

		if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {

			let s = 1 - t;

			const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
				dir = (cos >= 0 ? 1 : - 1),
				sqrSin = 1 - cos * cos;

			// Skip the Slerp for tiny steps to avoid numeric problems:
			if (sqrSin > Number.EPSILON) {

				const sin = Math.sqrt(sqrSin),
					len = Math.atan2(sin, cos * dir);

				s = Math.sin(s * len) / sin;
				t = Math.sin(t * len) / sin;

			}

			const tDir = t * dir;

			x0 = x0 * s + x1 * tDir;

			y0 = y0 * s + y1 * tDir;

			z0 = z0 * s + z1 * tDir;

			w0 = w0 * s + w1 * tDir;

			// Normalize in case we just did a lerp:

			if (s === 1 - t) {

				const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

				x0 *= f;

				y0 *= f;

				z0 *= f;

				w0 *= f;

			}

		}

		dst[dstOffset] = x0;

		dst[dstOffset + 1] = y0;

		dst[dstOffset + 2] = z0;

		dst[dstOffset + 3] = w0;

	}

}