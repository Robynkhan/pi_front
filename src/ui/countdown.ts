/*
 * 倒计时
 * props = {"now_time":10000,"cd_time":10000,"cd_interval":1000}
 * props必须有cd_time属性，表示倒计时的时间点，可以是时间点的毫秒数，也可以是代表时间点的字符串（yyyy-MM-dd HH:mm:ss）毫秒。
 * props可以有now_time属性(使用时间不是本地时间,请传)，表示现在时间，可以是时间点的毫秒数，也可以是代表时间点的字符串（yyyy-MM-dd HH:mm:ss）毫秒
 * props可以有cd_interval属性，表示倒计时的计时频率，单位毫秒，默认1000。
 * props可以有cd_not_zerofill，表示是否不补零,默认补零.
 */

import { Json } from '../lang/type';
import { ResTab } from '../util/res_mgr';
import {set as task} from '../util/task_mgr';
import { notify } from '../widget/event';
import { Widget } from '../widget/widget';

/**
 * @description 导出组件Widget类
 * @example
 */
export class CountDown extends Widget {
	public timerRef: number = 0;

	/**
	 * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
	 * @example
	 */
	public setProps(props: Json, oldProps?: Json): void {
		this.timerRef && clearTimeout(this.timerRef);
		// tslint:disable-next-line:no-this-assignment
		const scope = this;
		this.props = props;
		initCd_time(props);

		let flag = interval(props, scope);
		if (!flag) return;
		const func = (): void => {
			flag = interval(props, scope);
			if (!flag) {
				clearTimeout(this.timerRef);
				this.timerRef = 0;
			} else {
				this.paint();
				this.timerRef = setTimeout(func, props.cd_interval || 1000);
			}
		};
		this.timerRef = setTimeout(func, props.cd_interval || 1000);
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

// 倒计时对象
interface CdInfo {	
	year: number;
	month: number;
	date: number;
	hour: number;
	minute: number;
	second: number;
	ms: number;
	tms: number;
}

// 显示数字
const show = (e, time, carry, zerofill, callBack): any => {
	let t;
	let i;
	let s;

	t = Math.floor(time / carry);
	time = time % carry;
	s = '';
	if (!e.cd_not_zerofill && zerofill > 0) {
		i = t > 0 ? Math.floor(Math.log10(t)) + 1 : 1;
		for (; i < zerofill; i++) {
			s += '0';
		}
	}
	if (callBack) callBack(s + t);

	return time;
};

// 定时调用倒计时
const interval = (e, wt: Widget) => {
	const now = (new Date()).getTime();
	if (e.cd_time > 0) {
		if (now > e.cd_time) {
			task(notify, [wt.parentNode, 'ev-countdownend', null], 90000, 1);
			e.cd_time = 0;

			return false;
		} else {
			e.cdInfo = calcCd(e, now);

			return true;
		}
	}
};

// 倒计时使用本地当前时间和cd_time计算倒计时时间，但外部传入的倒计时开始时间可能与本地时间有一定差距，需要将它们的差加到cd_time上
// tslint:disable-next-line:variable-name
const initCd_time = (props: Json) => {
	if ((typeof props.cd_time === 'string') && props.cd_time.constructor === String) {
		props.cd_time = strToMs(props.cd_time);
	}
	if ((typeof props.now_time === 'string') && props.now_time.constructor === String) {
		props.now_time = strToMs(props.now_time);
	}

	const now = (new Date()).getTime();
	props.cd_time +=  now - props.now_time || now;
};

// 计算倒计时
const calcCd  = (e, now) => {
	now = e.cd_time - now;
	
	// tslint:disable-next-line:no-object-literal-type-assertion
	const cdInfo = {} as CdInfo;
	
	now = show(e, now, 24 * 60 * 60 * 1000, 0, (time) => {cdInfo.date = time;});
	now = show(e, now, 60 * 60 * 1000, 2, (time) => {cdInfo.hour = time;});
	now = show(e, now, 60 * 1000, 2, (time) => {cdInfo.minute = time;});
	now = show(e, now, 1000, 2, (time) => {cdInfo.second = time;});
	now = show(e, now, 1, 3, (time) => {cdInfo.ms = time;});
	cdInfo.tms = e.cd_time - now;
	
	return cdInfo as CdInfo;
};

// 将字符串时间转化成时间点的毫秒数
const strToMs  = (timeStr: string) => {
	try {
		const arr = timeStr.split(' ');
		const date = new Date();
		let temp;
		if (arr[0]) {
			temp = arr[0].split('-');
			// tslint:disable:radix
			date.setFullYear(parseInt(temp[0].replace(/\b(0+)/gi,'')));
			date.setMonth(parseInt(temp[1].replace(/\b(0+)/gi,'')) - 1);
			date.setDate(parseInt(temp[2].replace(/\b(0+)/gi,'')));
		}

		if (!arr[1]) {
			temp = [];
		} else {
			temp = arr[1].split('-');
		}
			
		date.setHours(parseInt((temp[0] || '0').replace(/\b(0+)/gi,'')) || 0);
		date.setMinutes(parseInt((temp[1] || '0').replace(/\b(0+)/gi,'')) || 0);
		date.setSeconds(parseInt((temp[2] || '0').replace(/\b(0+)/gi,'')) || 0);

		return date.getTime();

	} catch (error) {
		throw new Error(`invalid time str: ${timeStr}`);		
	}
	
};