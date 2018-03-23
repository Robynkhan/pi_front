/**
 * @description 球面坐标
 */
import { clamp } from '../util/math';
import { Vector3 } from './vector3';

export class Spherical {
	public radius: number;  // 半径
	public phi: number;     // 极角poles，在正负y轴之间
	public theta: number;   // 圆的equator，从z轴正向开始

	/**
	 * @description 构造函数
	 */
	constructor(radius?: number, phi?: number, theta?: number) {
		this.radius = radius !== undefined ? radius : 1.0;
		this.phi = phi !== undefined ? phi : 0.0;
		this.theta = theta !== undefined ? theta : 0.0;
	}

	/**
	 * @description 设置
	 */
	// tslint:disable-next-line:no-reserved-keywords
	public set(radius: number, phi: number, theta: number) {
		this.radius = radius;
		this.phi = phi;
		this.theta = theta;
	}

	/**
	 * @description 克隆
	 */
	public clone() {
		return new Spherical().copy(this);
	}

	/**
	 * @description 拷贝
	 */
	public copy(src: Spherical) {
		this.radius = src.radius;
		this.phi = src.phi;
		this.theta = src.theta;

		return this;
	}

	/**
	 * @description 限制phi在 [EPS, Pi - EPS]
	 */
	public makeSafe() {
		const EPS = 0.0001;
		this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));
	}

	/**
	 * @description 直角坐标转球面坐标
	 */
	public setFromVector3(v: Vector3) {
		this.radius = v.length();
		if (this.radius === 0) {
			this.theta = 0;
			this.phi = 0;
		} else {
			this.theta = Math.atan2(v.x, v.z);
			this.phi = Math.acos(clamp(v.y / this.radius, -1, 1));
		}
		
		return this;
	}
}