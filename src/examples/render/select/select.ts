/**
 * 
 */
import { Json } from '../../../lang/type';
import { notify } from '../../../widget/event';
import { getRealNode } from '../../../widget/painter';
import { Widget } from '../../../widget/widget';

/**
 * @description 导出组件Widget类
 * @example
 */
export class Select extends Widget {
	public setProps(props: Json, oldProps?: Json): void {
		this.props = props;
	}

	public firstPaint() {
		const el = getRealNode((<any>this.tree).children[0]);
		el.onchange = this.change.bind(this);
	}

	public change(e:any) {
		this.props.name = e.currentTarget.value;
		this.paint();
		notify(this.parentNode, 'ev-select', {value: e.currentTarget.value});

	}

}