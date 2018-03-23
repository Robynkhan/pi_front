
/**
 * 语音合成：文字变语音
 */

import { callNative } from './event';

let isInit = false;
let callback;

/**
 * 语音合成开始播放
 * @param info 合成字符串
 * @param callback 语音合成回调，参数:1.code,2.msg
 */
export const start = (info: String, cb: any): boolean => {
	if (callback) {
		return false;
	}

	if (!isInit) {
		callNative('YNSpeech', 'speechInit');
		isInit = true;
	}

	callback = cb;

	callNative('YNSpeech', 'speechPlay', info);

	return true;
};

/**
 * 语音合成停止播放
 */
export const stop = (): void => {
	if (!isInit) {
		throw new Error('SpeechSynthesizer.stop invaid call: uninit');
	}
	callNative('YNSpeech', 'speechStop');
};

/**
 *  语音合成暂停播放
 */
export const pause = (): void => {
	if (!isInit) {

		throw new Error('SpeechSynthesizer.pause invaid call: uninit');

	}

	callNative('YNSpeech', 'speechPause');
};

/**
 *  语音合成继续播放
 */

export const resume = (): void => {

	if (!isInit) {

		throw new Error('SpeechSynthesizer.resume invaid call: uninit');

	}

	callNative('YNSpeech', 'speechResume');

};

/**
 * 语音回调函数
 * code: 为0代表成功，其他数值代表失败；
 * msg，当code不为0时候，msg代表错误信息
 */
/* tslint:disable:variable-name */
export const _callback = (code: number, msg: string) => {

	if (callback) {

		callback(code, msg);

		callback = undefined;

	}

};