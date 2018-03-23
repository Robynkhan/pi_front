/*
 * 提交输入框，要求props为{sign:string|number, text?:string, readOnly?:string, focus?:boolean, id?:string|number}, 注意text要转义引号
 */

// ============================== 导入
import { notify } from '../widget/event';
import { getRealNode, paintCmd3 } from '../widget/painter';
import { VirtualNode } from '../widget/virtual_node';
import { Input } from './input';

// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
export class Submit extends Input {

	/**
	 * @description 获取输入框
	 * @example
	 */
	public getInput() {
		return findInput(<VirtualNode>this.tree);
	}
	/**
	 * @description 提交
	 * @example
	 */
	public submit() {
		const i = this.getInput() as HTMLInputElement;
		paintCmd3(i, 'value', this.lastText || '');
		notify(this.parentNode, 'ev-input-submit', {id: this.props.id, text: i.value, input: i });
	}

}

// ============================== 本地
// 递归查找input
const findInput = (node: VirtualNode) : HTMLElement => {
	for (const i of node.children) {
		if (!(<VirtualNode>i).children) {
			continue;
		}
		if ((<VirtualNode>i).tagName === 'input') {
			return getRealNode(i);
		}
		const r = findInput(<VirtualNode>i);
		if (r) {
			return r;
		}
	}
};
