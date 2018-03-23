/**
 * 
 */

import { addCallback, NativeListener, NativeObject, ParamType, registerSign, removeCallback } from '../../../browser/native';

export class Test extends NativeObject {

	/**
	 * 
	 * @param param 
	 *     a: number,
	 *     b: number,
	 *     c: number,
	 *     d: number,
	 *     s: string,
	 *     success: () => {}
	 *     fail: () => {}
	 * 
	 */
	/* tslint:disable:function-name */
	public static testStatic(param: any) {
		NativeObject.callStatic(Test, 'testStatic', param);
	}

	/**
	 * 
	 * @param param 
	 *     a: number,
	 *     b: number,
	 *     c: number,
	 *     d: number,
	 *     s: string,
	 *     success: () => {}
	 *     fail: () => {}
	 * 
	 */
	public testInstance(param: any) {
		this.call('testInstance', param);
	}

	/**
	 * 测试回调函数
	 */
	public testCallback = (callback: Function) => {
		const id = addCallback(callback);
		this.call('testCallback', {
			cbID: id
		});
	}
}

registerSign(Test, {
	testCallback: [
		{
			name: 'cbID',
			type: ParamType.Number
		}
	],
	testInstance: [
		{
			name: 'a',
			type: ParamType.Number
		}, {
			name: 'b',
			type: ParamType.Number
		}, {
			name: 'c',
			type: ParamType.Number
		}, {
			name: 'd',
			type: ParamType.Number
		}, {
			name: 's',
			type: ParamType.String
		}
	],
	testStatic: [
		{
			name: 'a',
			type: ParamType.Number
		}, {
			name: 'b',
			type: ParamType.Number
		}, {
			name: 'c',
			type: ParamType.Number
		}, {
			name: 'd',
			type: ParamType.Number
		}, {
			name: 's',
			type: ParamType.String
		}
	]

});