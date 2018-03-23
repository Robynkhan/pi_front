/**
 * 
 */
import { translate } from '../../../compile/drust';
import { Forelet } from '../../../widget/forelet';
import { Widget } from '../../../widget/widget';

// 测试初始化
export const test = () => {
	/* tslint:disable:no-debugger */
	debugger;
	const ss = `
		///同时
	struct Point<T> {
		/// x值
		x: T,
		y: u32,
		z: f32,
		b: bool,
		c: Plane,
	}
	`;
	const r = translate(ss, '');
	console.log('translate, ', r);
};

export const forelet = new Forelet();
forelet.listener = (cmd: string, w: Widget): void => {
	if (cmd === 'firstPaint') {
		console.log('ok', w.name);
		setTimeout(test, 1);
	}
};

forelet.addHandler('Click', () => {

	return 0;
});
