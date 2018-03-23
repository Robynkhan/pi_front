/**
 * 
 */
import * as Android from '../browser/android';
import { Widget } from '../widget/widget';

interface Props {
	info:Android.ShareData;
}

export class Pay extends Widget {

	public props:Props;
	constructor() {
		super();
	}

	/**
	 * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
	 * @example
	 */
	public setProps(props: Props, oldProps?: Props): void {
		this.props = props;
	}

	// 支付宝支付
	public payZhiFuBao() {
		Android.payZhiFuBao();
		
		return true;
	}

}
