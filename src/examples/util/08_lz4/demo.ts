/** 
 * 输入框，要求props为{sign:string|number, text:string, id:string|number}, 注意text要转义引号
 */

// ============================== 导入

import { compress, decompress, free } from '../../../util/lz4';
import { Widget } from '../../../widget/widget';

// ============================== 导出

export class Demo extends Widget {

	/* tslint:disable:typedef */
	public props = {
		status: '',
		count: 0,
		size: 0,
		compressTime: 0,
		decompressTime: 0,
		avgCompressTime: '',
		avgDecompressTime: ''
	};

	public test() {

		this.props.status = '压缩和解压成功';
		this.props.count = 0;
		this.props.compressTime = 0;
		this.props.decompressTime = 0;

		const count = 100;             // 总次数

		const size = 30 * 1024;   // 处理的原始数据大小
		this.props.size = size;
		
		for (let i = 0; i < count; ++i) {

			++this.props.count;

			const data = new Uint8Array(size);
			for (let j = 0; j < size; ++j) {
				data[j] = randomInt(0, 255);
			}

			// 压缩

			let begin = performance.now();
			const compressData = compress(data);
			let end = performance.now();
			this.props.compressTime += end - begin;

			if (!compressData) {
				this.props.status = '压缩失败';
				break;
			}

			// 解压

			begin = performance.now();
			const decompressData = decompress(compressData, size);
			end = performance.now();
			this.props.decompressTime += end - begin;

			if (!decompressData) {
				free(compressData);
				this.props.status = '解压失败';
				break;
			}

			// 判断相等
			let status = data.length === decompressData.length;
			for (let j = 0; j < decompressData.length; ++j) {
				status = status && decompressData[j] === data[j];
			}
			if (!status) {
				free(compressData);
				free(decompressData);
				this.props.status = '解压后数据和原始数据不同';
				break;
			}

			// 一定要释放内存！！！
			free(compressData);
			free(decompressData);
		}

		this.props.avgCompressTime = (this.props.compressTime / this.props.count).toFixed(2);
		this.props.avgDecompressTime = (this.props.decompressTime / this.props.count).toFixed(2);
		this.paint();
	}
}

// 生成 左闭右开区间[begin, end)内的随机整数
const randomInt = (begin: number, end: number) => {
	const tmp = (end - begin) * Math.random();
	
	return begin + Math.floor(tmp);
};