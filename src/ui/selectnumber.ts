/*
 * 选数量对话框
 * props = {count?:number ||, maxCount?:number, minCount?:number, interval?:number}
 * props可以有count, 默认为1
 * props可以有maxCount, 默认为Number.MAX_SAFE_INTEGER
 * props可以有minCount, 默认为0
 * props可以有interval, 默认为200毫秒
 */

// ============================== 导入
import { Json } from '../lang/type';
import { ResTab } from '../util/res_mgr';
import { set as task } from '../util/task_mgr';
import { notify } from '../widget/event';
import { Widget } from '../widget/widget';

const INTERVAL = 200;
// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
export class SelectNumber extends Widget {
	public timerRef: number = 0;

	/**
	 * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
	 * @example
	 */
	public setProps(props: Json, oldProps?: Json): void {
		props.count = props.count || 1;
		props.minCount = props.minCount || 0;
		props.maxCount = props.maxCount || Number.MAX_SAFE_INTEGER;
		props.interval = props.interval || INTERVAL;
		this.props = props;
	}

	/**
	 * @description 按下事件
	 * @example
	 */
	// tslint:disable-next-line:typedef
	public down(step) {
		this.props.step = step;
		// tslint:disable-next-line:no-this-assignment
		const w = this;
		this.timerRef = setTimeout(() => { changeCount(w, step, true); }, 800);
	}

	/**
	 * @description 鼠标或手指抬起事件
	 * @example
	 */
	// tslint:disable-next-line:typedef
	public up(e) {
		if (this.timerRef) {
			clearTimeout(this.timerRef);
			this.timerRef = 0;
		}
		changeCount(this, this.props.step, false);
		task(notify, [this.parentNode, 'ev-selectcount', { count: this.props.count }], 90000, 1);
	}
	/**
	 * @description 销毁时调用，一般在渲染循环外调用
	 * @example
	 */
	public destroy(): boolean {
		if (!super.destroy()) {
			return false;
		}
		this.timerRef && clearTimeout(this.timerRef);

		return true;
	}

}

/**
 * @description 更改选择数量
 * @param startTimeout--是否开启定时器
 * @example
 */
const changeCount = (w: SelectNumber, step: number, startTimeout: boolean) => {
	const to = w.props.count + step;
	if (step > 0) {
		if (to >= w.props.maxCount) {
			w.props.count = w.props.maxCount;
			w.timerRef = 0;
		} else {
			w.props.count = to;
			if (startTimeout) {
				w.timerRef = setTimeout(() => { changeCount(w, step, true); }, w.props.interval);
			}
		}
	} else if (step < 0) {
		if (to <= w.props.minCount) {
			w.props.count = w.props.minCount;
			w.timerRef = 0;
		} else {
			w.props.count = to;
			if (startTimeout) {
				w.timerRef = setTimeout(() => { changeCount(w, step, true); }, w.props.interval);
			}
		}
	}
	w.paint();
};
