
/**
 * 语音识别：语音变文字
 */

import { callNative } from './event';

let callback;

/**
 * @todo 目前的语音识别，停止说话后，就会结束；还没有考虑按着一直说的功能
 */
export const start = (cb: any): boolean => {
	if (callback) {
		return false;
	}
	
	callback = cb;
	callNative('YNSpeech', 'startListening');

	return true;
};

/**
 * 语音识别停止录音，但是识别将继续。
 */
export const stop = (): void => {
	callNative('YNSpeech', 'stopListening');
};

/**
 * 语音识别取消录音，识别也取消。
 */
export const cancel = (): void => {
	callback = undefined;
	callNative('YNSpeech', 'cancelListening');
};

/**
 * 语音识别销毁，释放资源
 */
export const desdroty = (): void => {
	callback = undefined;
	callNative('YNSpeech', 'destroyListening');
};

/**
 * 语音回调函数
 * code: 为0代表成功，此时msg代表识别的字符串
 * code: 其他代表失败，此时msg代表错误信息
 */
/* tslint:disable:variable-name */
export const _callback = (code: number, msg: string) => {
	if (callback) {
		callback(code, msg);
		callback = undefined;
	}
};