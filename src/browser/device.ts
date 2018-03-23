/**
 * 
 */
import { NativeObject, registerSign } from './native';

export class GetDeviceID extends NativeObject {
	
	/* tslint:disable:function-name */
	public static getDeviceID(param: any) {
		NativeObject.callStatic(GetDeviceID, 'getDeviceID', param);
	}
}

registerSign(GetDeviceID, {
	getDeviceID: []
});