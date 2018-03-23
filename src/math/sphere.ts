/**
 * @description 球
 */
import { Matrix4 } from './matrix4';
import { Vector3 } from './vector3';

import { AABB } from './aabb';
import { Plane } from './plane';

/**
 * 注：不能在这里初始化，否则会引起模块的循环引用
 */
// tslint:disable-next-line:variable-name
let _aabb: AABB;

export class Sphere {
	public center: Vector3; // 圆心
	public radius: number;  // 半径

	/**
	 * @description 构造
	 */
	constructor(center?: Vector3, radius?: number) {
		// tslint:disable:no-constant-condition
		this.center = (center !== undefined) ? center : new Vector3();
		this.radius = (radius !== undefined) ? radius : 0;
	}

	/**
	 * @description 设置
	 */
	// tslint:disable-next-line:no-reserved-keywords
	public set(center: Vector3, radius: number) {
		this.center.copy(center);
		this.radius = radius;

		return this;
	}

	/**
	 * @description 从点中设置
	 */
	public setFromPoints(points: Vector3[], optionalCenter?: Vector3) {
		if (_aabb === undefined) _aabb = new AABB();

		const center = this.center;
		if (optionalCenter !== undefined) {
			center.copy(optionalCenter);
		} else {
			_aabb.setFromPoints(points).center(center);
		}

		let maxRadiusSq = 0;
		for (let i = 0, il = points.length; i < il; i++) {
			maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSq(points[i]));
		}
		this.radius = Math.sqrt(maxRadiusSq);

		return this;
	}

	/**
	 * @description 克隆
	 */
	public clone() {
		return new Sphere().copy(this);
	}

	/**
	 * @description 拷贝
	 */
	public copy(sphere: Sphere) {
		this.center.copy(sphere.center);
		this.radius = sphere.radius;

		return this;
	}

	/**
	 * @description 是否为空
	 */
	public empty() {
		return (this.radius <= 0);
	}

	/**
	 * @description 是否包含点
	 */
	public containsPoint(point: Vector3) {
		return (point.distanceToSq(this.center) <= (this.radius * this.radius));
	}

	/**
	 * @description 到点的距离
	 */
	public distanceToPoint(point: Vector3) {
		return (point.distanceTo(this.center) - this.radius);
	}

	/**
	 * @description 是否和球相交
	 */
	public intersectsSphere(sphere: Sphere) {
		const radiusSum = this.radius + sphere.radius;

		return sphere.center.distanceToSq(this.center) <= (radiusSum * radiusSum);
	}

	/**
	 * @description AABB相交
	 */
	public intersectsAABB(aabb: AABB) {
		return aabb.intersectsSphere(this);
	}

	/**
	 * @description 平面相交
	 */
	public intersectsPlane(plane: Plane) {
		// We use the following equation to compute the signed distance from
		// the center of the sphere to the plane.
		//
		// distance = q * n - d
		//
		// If this distance is greater than the radius of the sphere,
		// then there is no intersection.
		return Math.abs(this.center.dot(plane.normal) - plane.constant) <= this.radius;
	}

	/**
	 * @description 裁剪点
	 */
	public clampPoint(point: Vector3, optionalTarget?: Vector3) {
		const deltaLengthSq = this.center.distanceToSq(point);
		const result = optionalTarget || new Vector3();
		result.copy(point);
		if (deltaLengthSq > (this.radius * this.radius)) {
			result.sub(this.center).normalize();
			result.multiplyScalar(this.radius).add(this.center);
		}

		return result;
	}

	/**
	 * @description 取AABB
	 */
	public getBoundingBox(optionalTarget?: AABB) {
		const box = optionalTarget || new AABB();
		box.set(this.center, this.center);
		box.expandByScalar(this.radius);

		return box;
	}

	/**
	 * @description 矩阵应用
	 */
	public applyMatrix4(matrix: Matrix4) {
		this.center.applyPoint(matrix);
		this.radius = this.radius * matrix.getMaxScaleOnAxis();

		return this;
	}

	/**
	 * @description 平移
	 */
	public translate(offset: Vector3) {
		this.center.add(offset);

		return this;
	}

	/**
	 * @description 相等
	 */
	public equal(sphere: Sphere) {
		return sphere.center.equals(this.center) && (sphere.radius === this.radius);
	}

}