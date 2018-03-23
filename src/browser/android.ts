/**
 * 音乐分享：必须有imageUrl(缩略图, 有的平台，无缩略图无法分享)
 * 			必须有title
 * 			必须有musicUrl(音乐的url)
 * 			可以有text(描述)
 * 			可以有url(点击跳转的url，qq分享有用)
 * 
 * 图片分享：必须有imageUrl(分享的图片)
 * 
 * 文字分享：必须有text(文本内容)
 * 			可以有title(标题，仅在qq中起作用，且qq分享必须含有title)
 * 			可以有url(点击跳转，仅在qq中起作用，且qq分享必须含有url)
 * 
 * url分享：必须有url
 * 			必须有imageUrl(缩略图)
 * 			可以有text(标题，仅在qq和微博中起作用，且qq分享必须含有text)
 * 			可以有title(标题，仅在qq和微博中起作用，且qq分享必须含有title)
 * 
 * 视频分享：未测试
 * 			
 */

import { Json } from '../lang/type';

export const loginType = ['weixin', 'zhifubao', 'xiaomi'];

export enum ShareType {
	text,
	image,
	url,
	music,
	video
}

export const SHARE_TYPE = 'shareType';
export const SHARE_TEXT = 'text';
export const SHARE_TITLE = 'title';
export const SHARE_IMAGE_URL = 'imageUrl';
export const SHARE_IMAGE_BYTE = 'imageByte';
export const SHARE_URL = 'url';
export const SHARE_VIDEO_URL = 'videoUrl';
export const SHARE_MUSIC_URL = 'musicUrl';

const qqAppId = '101403709';// qq appId
const wxAppId = 'wx2c75307e997deb3b';// 微信appId
const wbAppId = '1725019549';// 微博appId

export interface ShareData {
	shareType: ShareType; // 分享类型
	text?: string;// 分享文字
	title?: string;// 分享标题
	imageUrl?: string;// 图片url
	url?: string;// 网页url
	videoUrl?: string;// 视频url
	musicUrl?: string;// 音乐url

	imageByte?: string; // 图片二进制，通过base64编码成字符串
}

export const register = () => {
	(<any>self).YNWeiXin.register(wxAppId);
	(<any>self).YNWeiBo.register(wbAppId);
	(<any>self).YNTencent.register(qqAppId);
};

/**
 * @description 微信登录
 */
export const loginWX = () => {
	const scope = 'snsapi_userinfo';
	const state = '111111';
	(<any>self).YNWeiXin.login(scope, state);
};

/**
 * @description 微信支付
 */
export const WXPay = () => {
	(<any>self).YNWeiXin.pay();
};

/**
 * @description 分享给朋友
 */
export const shareToFriend = (info: ShareData) => {
	const data = {};
	initShareData(info, data as ShareData, () => {
		(<any>self).YNWeiXin.shareToFriend(JSON.stringify(data));
	});
};

/**
 * @description 分享到朋友圈
 */
export const shareToLine = (info: ShareData) => {
	const data = {};
	initShareData(info, data as ShareData, () => {
		(<any>self).YNWeiXin.shareToLine(JSON.stringify(data));
	});
};

/**
 * @description QQ登录
 */
export const loginQQ = () => {
	(<any>self).YNTencent.login();
};

/**
 * @description 分享到qq
 */
export const shareToQQ = (info: ShareData) => {
	const data = {};
	initShareData(info, data as ShareData, () => {
		(<any>self).YNTencent.share(JSON.stringify(data));
	});
};

/**
 * @description 微博登录
 */
export const loginWB = () => {
	(<any>self).YNWeiBo.login();
};

/**
 * @description 分享到微博
 */
export const shareToWB = (info: ShareData) => {
	const data = {};
	initShareData(info, data as ShareData, () => {
		(<any>self).YNWeiBo.share(JSON.stringify(data));
	});
};

/**
 * @description 支付宝支付
 */
export const payZhiFuBao = () => {
	(<any>self).YNZhiFuBao.pay('');

};

const initShareData = (info: ShareData, result: ShareData, callBack: Function): ShareData => {
	result.text = info.text ? info.text : '';
	result.title = info.title ? info.title : '';
	result.imageByte = info.imageByte ? info.imageByte : '';
	result.url = info.url ? info.url : '';
	result.videoUrl = info.videoUrl ? info.videoUrl : '';
	result.musicUrl = info.musicUrl ? info.musicUrl : '';
	result.imageUrl = '';
	result.shareType = info.shareType;

	if (!info.imageByte && info.imageUrl) {
		generateImg(info.imageUrl, (img) => {
			result.imageByte = getBase64Image(img);
			callBack();
		});
	} else {
		callBack();
	}

	return result as ShareData;
};

const generateImg = (imageUrl: string, callBack: Function) => {
	const img = new Image();
	img.src = imageUrl;
	img.onload = () => {
		callBack(img);
	};
};

const getBase64Image = (img): string => {
	// 创建一个空的canvas元素
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;

	// Copy the image contents to the canvas
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);

	// Get the data-URL formatted image
	// Firefox supports PNG and JPEG. You could check img.src to
	// guess the original format, but be aware the using "image/jpg"
	// will re-encode the image.
	const dataURL = canvas.toDataURL('image/png');

	return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
};