/*
 * 树形菜单，要求props为{tag:"btn$", show:{select:true, cfg:{} }, arr:[]}，嵌套使用，子菜单的props为父菜单的引用
 */

// ============================== 导入
import { Json } from '../lang/type';
import { notify } from '../widget/event';
import { Widget } from '../widget/widget';

// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
export class TreeMemu extends Widget {
	/**
	 * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
	 * @example
	 */
	public setProps(props: Json, oldProps?: Json): void {
		this.props = props;
		if (Number.isInteger(props)) {
			this.props = this.parentNode.widget.props.arr[props];
		}
	}
	/**
	 * @description 按钮事件
	 * @example
	 */
	// tslint:disable-next-line:typedef
	public change(e) {
		if (this.props.arr) {
			this.props.show.select = !this.props.show.select;

			return this.paint();
		}
		notify(this.parentNode, 'ev-tm-open', e);
	}

}
// ============================== 本地

// ============================== 立即执行
