/*
 * 输入框，要求props为{sign:string|number, text?:string, readOnly?:string, focus?:boolean, id?:string|number}, 注意text要转义引号
 */

// ============================== 导入
import { notify } from '../widget/event';
import { getRealNode, paintCmd3 } from '../widget/painter';
import { Widget } from '../widget/widget';

// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
export class Input extends Widget {
	public lastSign: number = 0;
	public lastText: string = undefined;
	public readOnly: string = undefined;

	/**
	 * @description 绘制方法，
	 * @param reset 表示新旧数据差异很大，不做差异计算，直接生成dom
	 * @example
	 */
	public paint(reset: boolean): void {
		if (!this.tree) {
			super.paint(reset);
		}
		if (!this.props) {
			this.props = {};
		}
		if (this.lastSign === this.props.sign) {
			return;
		}
		this.lastSign = this.props.sign;
		if (this.props.text !== undefined) {
			this.lastText = this.props.text;
			paintCmd3(this.getInput(), 'value', this.lastText);
		}
		let r = this.props.readOnly;
		if (r === null) {
			r = undefined;
		}
		if (this.readOnly !== r) {
			this.readOnly = r;
			paintCmd3(this.getInput(), 'readOnly', r || 'false');
		}
	}
	/**
	 * @description 添加到dom树后调用，在渲染循环内调用
	 * @example
	 */
	public attach(): void {
		this.props.focus && focus();
	}
	/**
	 * @description 失焦
	 * @example
	 */
	public getInput() {
		return getRealNode(this.tree);
	}
	/**
	 * @description 输入事件
	 * @example
	 */
	// tslint:disable:typedef
	public onInput(e) {
		notify(this.parentNode, 'ev-input-text', { native: e, id: this.props.id, text: e.target.value });
	}
	/**
	 * @description 失焦事件
	 * @example
	 */
	public onBlur(e) {
		notify(this.parentNode, 'ev-input-blur', { native: e, id: this.props.id, text: e.target.value });
	}
	/**
	 * @description 聚焦事件
	 * @example
	 */
	public onFocus(e) {
		notify(this.parentNode, 'ev-input-focus', { native: e, id: this.props.id, text: e.target.value });
	}
	/**
	 * @description 失焦
	 * @example
	 */
	public blur() {
		this.getInput().blur();
	}
	/**
	 * @description 聚焦
	 * @example
	 */
	public focus() {
		this.getInput().focus();
	}
}

// ============================== 本地

// ============================== 立即执行
