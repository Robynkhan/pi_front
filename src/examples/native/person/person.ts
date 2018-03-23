/**
 * 
 */

import { NativeListener, NativeObject, ParamType, registerSign } from '../../../browser/native';

export class Person extends NativeObject {
	private name: string;

	public getName(param: any) {

		const func = param.success;

		param.success = (name) => {
			this.name = name;
			func && func(name);
		};

		this.call('getName', param);
	}
}

registerSign(Person, {
	getName: [
		{
			name: 'date',
			type: ParamType.Number
		},
		{
			name: 'cardID',
			type: ParamType.String
		}]
});
