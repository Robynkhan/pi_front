/*
 * 滑动选项卡
 * 用户可以单击选项，来切换卡片，也可以滑动或快速滑动卡片来切换卡片。滑动到头后，有橡皮筋效果。
 * 根据提示条目显示红点提示或数量提示
 */

// ============================== 导入
import { now } from '../lang/time';
import { calc, cubicOut, quadIn, sinOut } from '../math/tween';
import { getSupportedProperty } from '../util/html';
import { clearTimer, setTimer, TimerRef } from '../util/task_mgr';
import { getRealNode, paintCmd3 } from '../widget/painter';
import { findNodeByAttr, VirtualNode } from '../widget/virtual_node';
import { Widget } from '../widget/widget';

// ============================== 导出
/**
 * @description 定时器的定时时间，毫秒
 */
export const TimerTime = 30;
/**
 * @description 运动速度，宽度100%/秒
 */
export const Speed = 100;

/**
 * @description 导出组件Widget类
 * @example
 */
export class SlideTab extends Widget {
	public transform: string = ''; // transform的兼容键
	public end: number = 0; // 结束位置，为(卡片数量-1)*-100
	public container: HTMLElement = undefined; // 卡片的容器
	public containerWidth: number = 0;
	public timerRef: TimerRef = undefined;
	public startTime: number = 0; // 定时运动的起始时间
	public startOffset: number = 0; // 定时运动的起始位置
	public swipe: number = 0; // 挥动的方向，0为无挥动，-1左，1右
	public lastOffset: number = 0;
	public moving: number = 0;

	/**
	 * @description 第一次计算后调用，此时创建了真实的dom，但并没有加入到dom树上，一般在渲染循环外调用
	 * @example
	 */
	public firstPaint(): void {
		super.firstPaint();
		this.props = this.props || { cur: 0, old: {} };
		this.transform = getSupportedProperty('transform');
		this.end = -(this.config.value.arr.length - 1) * 100;
	}
	/**
	 * @description 定住移动的卡片或初始化
	 * @example
	 */
	public poiseStart(e: any) {
		this.moving = 0;
		if (!this.container) {
			this.container = getRealNode(findNodeByAttr(this.tree as VirtualNode, 'container'));
			this.containerWidth = this.container.getBoundingClientRect().width;
		}
		if (this.timerRef) {
			clearTimer(this.timerRef);
			const r = tween(this);
			this.timerRef = null;
			this.lastOffset = (r === false) ? -this.props.cur * 100 : r;
		} else {
			this.lastOffset = -this.props.cur * 100;
		}
	}
	/**
	 * @description 松开移动的卡片
	 * @example
	 */
	public poiseEnd(e: any) {
		if (this.moving > 0 || this.timerRef) {
			return;
		}
		if (this.lastOffset === -this.props.cur * 100) {
			return;
		}
		this.timerRef = setTimer(tween, [this], TimerTime);
		this.startTime = now();
		this.startOffset = this.lastOffset;
		this.moving = 2;
	}
	/**
	 * @description 处理tpl里面的on-move事件
	 * @example
	 */
	public moveTab(e: any) {
		let d = this.lastOffset + (e.x - e.startX) * 100 / this.containerWidth;
		if (d > 0) { // 左边拉到头
			d = calc(d > 100 ? 100 : d, 0, 100, 100, cubicOut) / 3;
		} else if (d < this.end) { // 右边拉到头
			d = this.end - calc(this.end - d > 100 ? 100 : this.end - d, 0, 100, 100, cubicOut) / 3;
		}
		// tslint:disable-next-line:prefer-template
		paintCmd3(this.container.style, this.transform, 'translateX(' + d + '%)');
		this.moving = 1;
		if (e.subType === 'over') {
			this.timerRef = setTimer(tween, [this], TimerTime);
			this.startTime = now();
			this.startOffset = d;
			this.moving = 2;
			if (e.swipe) {
				this.swipe = (e.x - e.lastX) > 0 ? 1 : -1;
			} else {
				this.swipe = 0;
			}
		}
	}
	/**
	 * @description 选择按钮切换
	 * @example
	 */
	public change(e: any) {
		if (e.cmd === this.props.cur) {
			return;
		}
		if (this.timerRef) {
			clearTimer(this.timerRef);
			this.timerRef = null;
		}
		this.props.cur = e.cmd;
		this.paint();
	}
}

// ============================== 本地
/**
 * @description 定时器调用运动函数
 * @example
 */
const tween = (widget: SlideTab): any => {
	let d;
	const time = now() - widget.startTime;
	if (widget.startOffset > 0) { // 左边弹回
		d = widget.startOffset * 1000 / Speed;
		if (time > d) {
			d = 0;
			clearTimer(widget.timerRef);
			widget.timerRef = null;
		} else {
			d = calc(time, widget.startOffset, 0, d, quadIn);
		}
	} else if (widget.startOffset < widget.end) { // 右边弹回
		d = (widget.end - widget.startOffset) * 1000 / Speed;
		if (time > d) {
			d = widget.end;
			clearTimer(widget.timerRef);
			widget.timerRef = null;
		} else {
			d = calc(time, widget.startOffset, widget.end, d, quadIn);
		}
	} else if (widget.swipe !== 0) { // 挥动
		let end = widget.startOffset % 100;
		end = (widget.swipe > 0) ? widget.startOffset - end : widget.startOffset - end - 100;
		d = stop(widget, end, time);
		if (d === false) {
			return false;
		}
	} else { // 平稳运动，中间根据起始位置靠那边，决定运动方向
		let end = widget.startOffset % 100;
		end = (end > -50) ? widget.startOffset - end : widget.startOffset - end - 100;
		d = stop(widget, end, time);
		if (d === false) {
			return false;
		}
	}
	// tslint:disable-next-line:prefer-template
	paintCmd3(widget.container.style, widget.transform, 'translateX(' + d + '%)');

	return d;
};

/**
 * @description 停止，判断是否刷新
 * @example
 */
const stop = (widget: SlideTab, end: number, time: number): any => {
	let d = Math.abs(end - widget.startOffset) * 1000 / Speed;
	if (time > d) {
		d = end;
		clearTimer(widget.timerRef);
		widget.timerRef = null;
		if (widget.props.cur !== -end / 100) {
			widget.props.cur = -end / 100;
			widget.paint();

			return false;
		}
	} else {
		d = calc(time, widget.startOffset, end, d, sinOut);
	}

	return d;
};
// ============================== 立即执行
