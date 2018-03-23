/**
 * 
 */
import * as Android from '../browser/android';
import { Widget } from '../widget/widget';

// tslint:disable-next-line:class-name
export class login extends Widget {
	constructor() {
		super();
	}

	// 登录微信
	public loginWX() {
		Android.loginWX();

		return true;
	}

	// 登录QQ
	public loginQQ() {
		Android.loginQQ();

		return true;
	}

	// 微博登录
	public loginWeiBo() {
		Android.loginWB();
	}

}