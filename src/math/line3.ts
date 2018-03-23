/**
 * @description 线段
 */
import { clamp } from '../util/math';
import { Matrix4 } from './matrix4';
import { Vector3 } from './vector3';

/**
 * 注：不能在这里初始化，否则会引起模块的循环引用
 */
/* tslint:disable:variable-name no-constant-condition no-reserved-keywords*/
let _v1: Vector3;
let _v2: Vector3;

export class Line3 {
	public start: Vector3;
	public end: Vector3;

	/**
	 * @description 构造
	 */
	constructor(start?: Vector3, end?: Vector3) {
		this.start = (start !== undefined) ? start : new Vector3();
		this.end = (end !== undefined) ? end : new Vector3();
	}

	/**
	 * @description 设置
	 */
	public set(start: Vector3, end: Vector3) {
		this.start.copy(start);
		this.end.copy(end);

		return this;
	}

	/**
	 * @description 克隆
	 */
	public clone() {
		return new Line3().copy(this);
	}

	/**
	 * @description 拷贝
	 */
	public copy(line: Line3) {
		this.start.copy(line.start);
		this.end.copy(line.end);

		return this;
	}

	/**
	 * @description 取中心点
	 */
	public center(optionalTarget?: Vector3) {
		const result = optionalTarget || new Vector3();

		return result.addVectors(this.start, this.end).multiplyScalar(0.5);
	}

	/**
	 * @description 多长
	 */
	public delta(optionalTarget?: Vector3) {
		const result = optionalTarget || new Vector3();

		return result.subVectors(this.end, this.start);
	}

	/**
	 * @description 距离平方
	 */
	public distanceSq() {
		return this.start.distanceToSq(this.end);
	}

	/**
	 * @description 距离
	 */
	public distance() {
		return this.start.distanceTo(this.end);
	}

	/**
	 * @description 伸缩
	 */
	public at(t: number, optionalTarget?: Vector3) {
		const result = optionalTarget || new Vector3();

		return this.delta(result).multiplyScalar(t).add(this.start);
	}

	/**
	 * @description 最近距离
	 */
	public closestPointToPointParameter(point: Vector3, clampToLine: boolean) {
		if (_v1 === undefined) _v1 = new Vector3();
		if (_v2 === undefined) _v2 = new Vector3();

		const startP = _v1;
		const startEnd = _v2;

		startP.subVectors(point, this.start);
		startEnd.subVectors(this.end, this.start);

		const startEnd2 = startEnd.dot(startEnd);
		const startEnd_startP = startEnd.dot(startP);
		let t = startEnd_startP / startEnd2;

		if (clampToLine) {
			t = clamp(t, 0, 1);
		}

		return t;
	}

	/**
	 * @description 最近距离
	 */
	public closestPointToPoint(point: Vector3, clampToLine: boolean, optionalTarget?: Vector3) {
		const t = this.closestPointToPointParameter(point, clampToLine);
		const result = optionalTarget || new Vector3();

		return this.delta(result).multiplyScalar(t).add(this.start);
	}

	/**
	 * @description 矩阵应用
	 */
	public applyMatrix4(matrix: Matrix4) {
		this.start.applyPoint(matrix);
		this.end.applyPoint(matrix);

		return this;
	}

	/**
	 * @description 是否相等
	 */
	public equal(line: Line3) {
		return line.start.equals(this.start) && line.end.equals(this.end);
	}

}