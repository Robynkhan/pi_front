/** 
 * 输入框，要求props为{sign:string|number, text:string, id:string|number}, 注意text要转义引号
 */

// ============================== 导入
import { Bluetooth } from '../../../browser/bluetooth';
import { Widget } from '../../../widget/widget';

import { RES_TYPE_BLOB, ResTab } from '../../../util/res_mgr';
import { getRealNode, paintCmd3 } from '../../../widget/painter';
import { Test } from './test';

// ============================== 导出
export class Demo extends Widget {

	/* tslint:disable:typedef */
	public p = new Test();

	public test() {
		try {

			Test.testStatic({
				a: 1,
				b: 2,
				c: 3,
				d: 4,
				s: 'abcdefg',
				success(r, a, b, c, d, s) {
					alert(`Test.testStatic: ${r}, ${a}, ${b}, ${c}, ${d}, ${s}`);
				}
			});

			this.p.init({
				success() {
					alert('person init success');
				}
			});

			this.p.testCallback(msg => alert(`demo: ${msg}`));

			this.p.testInstance({
				a: 1,
				b: 2,
				c: 3,
				d: 4,
				s: 'abcdefg',
				success(r, a, b, c, d, s) {
					alert(`Test.testInstance: ${r}, ${a}, ${b}, ${c}, ${d}, ${s}`);
				}
			});

			this.p.close({
				success() {
					alert('person close success');
				}
			});

		} catch (e) {
			alert(`test exception: ${e}`);
		}
	}
}