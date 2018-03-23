/**
 * 
 */
import { callNative } from './event';

let callback;

export const start = (cb: any): boolean => {

	if (callback) {
		return false;

	}

	callback = cb;

	callNative('YNZxing', 'startActivityForResult');

	return true;

};

/* tslint:disable:variable-name */
export const _callBack = (code: number, msg: string) => {
	if (callback) {
		callback(code, msg);
		callback = undefined;
	}
};