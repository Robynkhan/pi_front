/** 
 * 输入框，要求props为{sign:string|number, text:string, id:string|number}, 注意text要转义引号
 */

// ============================== 导入

import { Heap } from '../../../util/heap';
import { Widget } from '../../../widget/widget';

// ============================== 导出

export class Demo extends Widget {

	public props: any[] = [];

	public test() {

		if (this.props.length > 1) return;

		let count = 300;

		const interval = setInterval(() => {

			if (--count === 0) {
				clearInterval(interval);

			}

			const arr = [];

			const num = Math.floor(Math.random() * 1000);
			for (let i = 0; i < num; ++i) {

				arr.push(Math.floor(Math.random() * 100));
			}

			const heap = new Heap<number>((a, b) => a - b);

			for (let i = 0; i < arr.length; ++i) {
				heap.insert(arr[i]);
			}

			const result = [];

			while (!heap.empty()) {

				result.push(heap.pop());

			}

			const arr1 = arr.slice(0);

			arr1.sort((a, b) => a - b);

			let b = true;

			for (let i = 0; i < arr1.length; ++i) {

				if (arr1[i] !== result[i]) {

					b = false;

					alert('算法有问题哈');

					clearInterval(interval);

					throw new Error('算法有问题哈');

				}

			}

			this.props.push(b ? 1 : 0);

			if (count === 0) {

				this.props.length = 0;

				this.props.push('全部测试通过！！');

			}

			this.paint();

		}, 20);

	}

}