/**
 * 蓝牙打印机模块
 * 
 */
import { arrayBufferToBase64, base64ToArrayBuffer } from '../util/base64';
import { callNative } from './event';

/**
 * java回调类型
 * FindAdapter:打印机寻找回调类型
 * ConnectSocket:打印机连接回调类型
 */
enum CallbackType {
	FindAdapter = 0,
	ConnectSocket = 1,
	OnResumeType = 2,
	StateReceiver = 3,
	WriteType = 4
}

/**
 * 蓝牙打印机
 */

let findCallback;
let OnResumeCallback;
let StateReceiverCallback;
let WriteCallback;

let gID = 10;
let isInit = false;
const connectCBMap = {};

if (!isInit) {
	isInit = true;
	callNative('YNBlueTooth', 'blueToothInit');
}

export class Bluetooth {

	public socketID: string;
	public connectCB: any;

	private connectCBID: number;

	constructor() {
		this.socketID = '';

		if (!isInit) {
			isInit = true;
			callNative('YNBlueTooth', 'blueToothInit');
		}
	}

	public isOpen() {
		if (!isInit) {
			throw new Error('blueTooth.isBluetoothOn = false call: uninit');
		}

		return callNative('YNBlueTooth', 'isBluetoothOn');
	}

	/**
	 * 蓝牙弹窗打开
	 */
	public open() {
		callNative('YNBlueTooth', 'bluetoothOpen');
	}

	/**
	 * 蓝牙跳转系统打开
	 */
	public openSystem() {
		callNative('YNBlueTooth', 'bluetoothOpenSystem');
	}

	/**
	 * 蓝牙从所有已配对设备中找出打印设备，并返回设备名字的java数组
	 */
	public fillAdapter(cb: Function) {
		if (this.isOpen()) {
			findCallback = cb;
			callNative('YNBlueTooth', 'blueToothFillAdapter');
		} else {
			cb(-1);
		}
	}

	/**
	 * 蓝牙socket连接，判断传入的下标对应的名字是否正确，正确才会尝试连接
	 */
	public connectSocket(code: number, name: string, address: string, cb: Function) {
		if (this.isOpen()) {
			this.connectCBID = ++gID;
			this.connectCB = cb;
			connectCBMap[this.connectCBID] = this;
			callNative('YNBlueTooth', 'blueToothConnectSocket', code, name, address, this.connectCBID);
		} else {
			cb(-1);
		}
	}

	/**
	 * 蓝牙写flush
	 */
	public flush() {

		callNative('YNBlueTooth', 'blueToothFlush', this.socketID);
	}

	/**
	 * 蓝牙写write
	 */
	public writeString(info: string) {
		callNative('YNBlueTooth', 'blueToothWriteString', info, this.socketID);
	}

	/**
	 * 蓝牙写byte数组
	 */
	public writeBytes(bytes: Uint8Array) {
		const param = arrayBufferToBase64(bytes.buffer);
		callNative('YNBlueTooth', 'blueToothWriteBytes', param, this.socketID);
	}

	/**
	 * 蓝牙打印整数
	 */
	public writeInt(i: number) {
		callNative('YNBlueTooth', 'blueToothWriteInt', i, this.socketID);
	}

	/**
	 * 蓝牙改变字符串编码方式，默认info = "GBK"
	 */
	public setEncodeChar(info: string) {
		callNative('YNBlueTooth', 'setEncodeChar', info, this.socketID);
	}

	/**
	 * 蓝牙socket关闭
	 */
	public closeSocket() {
		callNative('YNBlueTooth', 'blueToothCloseSocket', this.socketID);
		this.socketID = '';
		delete connectCBMap[this.socketID];
	}

	/**
	 * 蓝牙改变UUID,默认UUID为打印机通用uid = "00001101-0000-1000-8000-00805F9B34FB"
	 */
	public setUUID(uid: string) {
		callNative('YNBlueTooth', 'blueToothChangeUUID', uid);
	}

	/**
	 * getGBK
	 */
	public getGbk(info: string) {
		const s = callNative('YNBlueTooth', 'blueToothGetGbk', info);

		return new Uint8Array(base64ToArrayBuffer(s));
	}

	/**
	 * onResultActivity
	 */
	public setResumeCallback(cb: Function) {
		OnResumeCallback = cb;
	}

	/**
	 * setStateReceiverback
	 */
	public setStateReceiverback(cb: Function) {
		StateReceiverCallback = cb;
	}

	/**
	 * setWriteReceiverback
	 */
	public setWriteReceiverback(cb: Function) {
		WriteCallback = cb;
	}

}

/**
 * 蓝牙回调函数
 * code: 为0代表成功，此时msg代表识别的字符串
 * code: 其他代表失败，此时msg代表错误信息
 */
export const blueToothCallback = (cbType: CallbackType, code: number, msg: string, userParam = 0) => {
	let cb;
	switch (cbType) {
		case CallbackType.FindAdapter:
			cb = findCallback;
			break;
		case CallbackType.ConnectSocket:

			const obj = connectCBMap[userParam];
			if (obj) {
				if (code === 0) obj.socketID = msg;
				obj.connectCB(code, msg);
			}
			break;
		case CallbackType.OnResumeType:
			cb = OnResumeCallback;
			break;
		case CallbackType.StateReceiver:
			cb = StateReceiverCallback;
			break;
		case CallbackType.WriteType:
			cb = WriteCallback;
			break;
		default:
	}
	if (isInit && cb) {
		cb(code, msg);
	}
};