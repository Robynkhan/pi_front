
/** 
 * shareTargetTimeLine 、 shareTargetTimeLine参数如下
 * 视屏 info {"url":"http://pgccdn.v.baidu.com/1267620323_3035637655_20170519203709.mp4?authorization=
 * bce-auth-v1%2Fc308a72e7b874edd9115e4614e1d62f6%2F2017-05-19T12%3A37%3A13Z%2F
 * -1%2F%2F75c802a5e1bc25bba8d475cb85fda301c614d453bdec5b11d1e34cd31291fdfc&responseCacheControl
 * =max-age%3D8640000&responseExpires=Sun%2C+27+Aug+2017+20%3A37%3A13+GMT&xcode
 * =410f34d34d9f47614ad758fab4c248efab303a93afdeacd0&time=1496386664&_=1496304109520","title":"11", "desc":"11"}
 *      type "video"
 * url info {"url":"www.baidu.com","title":"后天", "desc":"后天"}
 *      type "url"
 * 文字 info {"text":"分享文字"}
 *      type "text"
 */
import * as Android from '../../../browser/android';
import { Json } from '../../../lang/type';
import { loadImage } from '../../../render3d/load';
import { ResTab } from '../../../util/res_mgr';
import { notify } from '../../../widget/event';
import { Widget } from '../../../widget/widget';

interface Props {
	info: Json;
}

const music: Props = {
	info: {
		/* tslint:disable:no-http-string */
		url: 'http://c.y.qq.com/v8/playsong.html?songid=109325260&songmid=000kuo2H2xJqfA&songtype=0&source=mqq&wv=1',
		title: '后天', text: '', musicUrl: 'http://ws.stream.qqmusic.qq.com/C100000kuo2H2xJqfA.m4a?fromtag=0',
		shareType: Android.ShareType.music, imageUrl: '../../dst/ui/btnl.png'
	}
};

const video: Props = {
	info: {
		/* tslint:disable:max-line-length */
		videoUrl: 'http://pgccdn.v.baidu.com/1267620323_3035637655_20170519203709.mp4?authorization=bce-auth-v1%2Fc308a72e7b874edd9115e4614e1d62f6%2F2017-05-19T12%3A37%3A13Z%2F-1%2F%2F75c802a5e1bc25bba8d475cb85fda301c614d453bdec5b11d1e34cd31291fdfc&responseCacheControl=max-age%3D8640000&responseExpires=Sun%2C+27+Aug+2017+20%3A37%3A13+GMT&xcode=410f34d34d9f47614ad758fab4c248efab303a93afdeacd0&time=1496386664&_=1496304109520',
		title: '后天',
		text: '后天',
		shareType: Android.ShareType.video,
		url: 'http://www.baidu.com'
	}
};

const text: Props = {
	info: { text: '分享文字', shareType: Android.ShareType.text, title: '文本', url: 'http://www.baidu.com' }
};

const img: Props = {
	info: { imageUrl: '../../dst/ui/btnl.png', shareType: Android.ShareType.image }
};

const url: Props = {
	info: { url: 'http://news.sina.com.cn/c/2013-10-22/021928494669.shtml', title: '后天', text: '后天', shareType: Android.ShareType.url, imageUrl: '../../dst/ui/btnl.png' }
};

export class Entery extends Widget {

	public props: Props;

	public setProps(props: Props, oldProps?: Props): void {
		this.props = url;
		Android.register();
	}
} 
