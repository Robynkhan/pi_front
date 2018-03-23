
/**
 * 音频录制器，底层封装
 * 
 * 调用的例子：
 * 
 * let recorder = new AudioRecorder();
 * recorder.init();
 * 
 * recorder.start();  // 开始录制
 * recorder.stop();   // 结束录制
 * let arrayBuffer1 = recorder.getContent();  // 取录制的内容
 * 
 * recorder.start();  // 开始录制
 * recorder.stop();   // 结束录制
 * let arrayBuffer2 = recorder.getContent();  // 取录制的内容
 * 
 * recorder.release();
 */

import { base64ToArrayBuffer } from '../util/base64';

const NativeRecord = (<any>self).YNAudioRecord;

// 浏览器的音频支持格式
const SUPPORT_MP3 = 0;
const SUPPORT_AAC = 1;

// 测试是否支持AAC格式
const testAACSupport = () => {
	// AAC数据

	if (AudioContext) {
		const aacData = new Int8Array([-1, -15, -20, 64, 1, -65, -4, 0, 0, 20, 3, -23, 28, -1, -15, -20, 64, 1, -65, -4, 0, 0, 20, 3, -23, 28]);

		const context = new AudioContext();
		const source = context.createBufferSource();
		context.decodeAudioData(aacData.buffer,  (data) => {
			// 有回调，则说明浏览器支持AAC
			NativeRecord.supportFormat(SUPPORT_AAC);
		});
	}
};

if (NativeRecord) {
	testAACSupport();
}

export class AudioRecorder {

	public isRecording: boolean = false;
	public native: number = 0;

	/**
	 * 初始化
	 */
	public init() {
		if (!NativeRecord) {
			throw new Error('window.YNAudioRecord can\'t found');
		}
		if (this.native) {
			throw new Error('already init');
		}
		this.native = NativeRecord.create();
	}

	/**
	 * 释放底层的录制器资源
	 */
	public release() {
		if (!this.native) {
			throw new Error('don\'t init');
		}
		NativeRecord.destroy(this.native);
		this.native = 0;
	}

	/**
	 * 开始录制
	 */
	public start() {
		if (!NativeRecord) {
			throw new Error('window.YNAudioRecord can\'t found');
		}
		if (!this.native) {
			throw new Error('don\'t init');
		}

		if (this.isRecording) {
			this.stop();
		}

		if (NativeRecord.start(this.native)) {
			this.isRecording = true;
		}
	}

	/**
	 * 停止录制
	 */
	public stop() {
		if (!NativeRecord) {
			throw new Error('window.YNAudioRecord can\'t found');
		}
		if (!this.native) {
			throw new Error('don\'t init');
		}
		this.isRecording = false;
		NativeRecord.stop(this.native);
	}

	/**
	 * 取最近一次的录制的内容
	 * @return ArrayBuffer 二进制数据
	 */
	public getContent() {
		if (!NativeRecord) {
			throw new Error('window.YNAudioRecord can\'t found');
		}
		if (!this.native) {
			throw new Error('don\'t init');
		}
		if (this.isRecording) {
			throw new Error('getContent: must after stop');
		}

		// Base64Str
		let content = NativeRecord.get(this.native);
		if (content !== '') {
			content = base64ToArrayBuffer(content);
		}
		
		return content;
	}
}