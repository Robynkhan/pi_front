/**
 * 输入框，要求props为{sign:string|number, text:string, id:string|number}, 注意text要转义引号
 */

import { Bluetooth } from '../../../browser/bluetooth';
import { Widget } from '../../../widget/widget';

import { RES_TYPE_BLOB, ResTab } from '../../../util/res_mgr';
import { getRealNode, paintCmd3 } from '../../../widget/painter';

import { GetDeviceID } from '../../../browser/device';

// ============================== 导出
export class Demo extends Widget {

	public test() {
		try {

			console.log(`000000000 ${navigator.userAgent}`);

			GetDeviceID.getDeviceID({
				success(idStr: string) {
					alert(`GetDeviceID.getDeviceID: ${idStr}`);
				}
			});
		} catch (e) {
			alert(`test exception: ${e}`);			
		}
	}
}