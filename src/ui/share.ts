/**
 * 
 */
import * as Android from '../browser/android';
import { Widget } from '../widget/widget';

interface Props {
	info: Android.ShareData;
}

export class Share extends Widget {

	public props: Props;
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

	// 分享到朋友圈
	public shareTargetTimeLine() {
		Android.shareToLine(this.props.info);

		return true;
	}

	// 分享给朋友
	public shareTargetSession() {
		Android.shareToFriend(this.props.info);

		return true;
	}

	// 分享给QQ
	public shareQQ() {
		Android.shareToQQ(this.props.info);

		return true;
	}

	// 分享到微博
	public shareWB() {
		Android.shareToWB(this.props.info);

		return true;
	}

}
