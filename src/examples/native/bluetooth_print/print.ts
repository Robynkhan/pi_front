/**
 * 蓝牙打印工具类
 * 对应的代码在：http://www.jianshu.com/p/0fe3a7e06f57
 */

import { Bluetooth } from '../../../browser/bluetooth';

const WIDTH_PIXEL = 384;

/**
 * 初始化Pos实例
 *
 * @param encoding 编码
 * @throws IOException
 */
//  constructor  (encoding: string) {
// 	initPrinter();
// }

let bluetooth: Bluetooth;
export const init = (bt: Bluetooth) => {
	bluetooth = bt;
};

export const print = (bs: Uint8Array) => {
	bluetooth.writeBytes(bs);
};

export const printRawBytes = (bytes: Uint8Array) => {
	bluetooth.writeBytes(bytes);
	bluetooth.flush();
};

/**
 * 初始化打印机
 *
 * @throws IOException
 */
export const initPrinter = () => {
	bluetooth.writeInt(0x1B);
	bluetooth.writeInt(0x40);
	bluetooth.flush();
};

/**
 * 打印换行
 *
 * @return lineNum 需要打印的空行数
 */
export const printLine = (lineNum = 1) => {
	for (let i = 0; i < lineNum; i++) {
		bluetooth.writeString('\n');
	}
	bluetooth.flush();
};

/**
 * 打印空白(一个Tab的位置，约4个汉字)
 *
 * @param length 需要打印空白的长度,
 * @throws IOException
 */
export const printTabSpace = (length: number) => {
	for (let i = 0; i < length; i++) {
		bluetooth.writeString('\t');
	}
	bluetooth.flush();
};

/**
 * 绝对打印位置
 *
 * @throws IOException
 */
export const setLocation = (offset: number) => {
	const bs = new Uint8Array(4);
	bs[0] = 0x1B;
	bs[1] = 0x24;
	bs[2] = (offset % 256);
	bs[3] = (offset / 256);

	return bs;
};

export const getStringPixLength = (str: string) => {
	let pixLength = 0;
	for (let i = 0; i < str.length; i++) {
		const c = str.charCodeAt(i);
		if (c > 127) {
			pixLength += 24;
		} else {
			pixLength += 12;
		}
	}

	return pixLength;
};

export const getOffset = (str: string) => {
	return WIDTH_PIXEL - getStringPixLength(str);
};

/**
 * 打印文字
 *
 * @throws IOException
 */
export const printText = (text: string) => {
	bluetooth.writeString(text);
	bluetooth.flush();
};

/**
 * 对齐0:左对齐，1：居中，2：右对齐
 */
export const printAlignment = (alignment: number) => {
	/* tslint:disable:number-literal-format */
	bluetooth.writeInt(0x1b);
	bluetooth.writeInt(0x61);
	bluetooth.writeInt(alignment);
};

export const printLargeText = (text: string) => {

	bluetooth.writeInt(0x1b);
	bluetooth.writeInt(0x21);
	bluetooth.writeInt(48);

	bluetooth.writeString(text);

	bluetooth.writeInt(0x1b);
	bluetooth.writeInt(0x21);
	bluetooth.writeInt(0);

	bluetooth.flush();
};

// 需要实现
export const arraycopy = (src: any, srcPos: number, dest: any, destPos: number, length: number) => {
	for (let i = 0; i < length; ++i) {
		dest[destPos + i] = src[srcPos + i];
	}
};

export const printTwoColumn = (title: string, content: string) => {
	let iNum = 0;
	const byteBuffer = new Uint8Array(1000);
	let tmp = bluetooth.getGbk(title);

	arraycopy(tmp, 0, byteBuffer, iNum, tmp.length);
	iNum += tmp.length;

	tmp = setLocation(getOffset(content));
	arraycopy(tmp, 0, byteBuffer, iNum, tmp.length);
	iNum += tmp.length;

	tmp = bluetooth.getGbk(content);
	arraycopy(tmp, 0, byteBuffer, iNum, tmp.length);
	print(byteBuffer);
};

export const printThreeColumn = (left: string, middle: string, right: string) => {
	let iNum = 0;
	const byteBuffer = new Uint8Array(200);
	let tmp = new Uint8Array(1);

	arraycopy(tmp, 0, byteBuffer, iNum, tmp.length);
	iNum += tmp.length;

	tmp = bluetooth.getGbk(left);
	arraycopy(tmp, 0, byteBuffer, iNum, tmp.length);
	iNum += tmp.length;

	const pixLength = getStringPixLength(left) % WIDTH_PIXEL;
	if (pixLength > WIDTH_PIXEL / 2 || pixLength === 0) {
		/* tslint:disable:prefer-template */
		middle = '\n\t\t' + middle;
	}

	tmp = setLocation(192);
	arraycopy(tmp, 0, byteBuffer, iNum, tmp.length);
	iNum += tmp.length;

	tmp = bluetooth.getGbk(middle);
	arraycopy(tmp, 0, byteBuffer, iNum, tmp.length);
	iNum += tmp.length;

	tmp = setLocation(getOffset(right));
	arraycopy(tmp, 0, byteBuffer, iNum, tmp.length);
	iNum += tmp.length;

	tmp = bluetooth.getGbk(right);
	arraycopy(tmp, 0, byteBuffer, iNum, tmp.length);

	print(byteBuffer);
};

export const printDashLine = () => {
	printText('--------------------------------');
};

/*************************************************************************
 * 假设一个360*360的图片，分辨率设为24, 共分15行打印 每一行,是一个 360 * 24 的点阵,y轴有24个点,存储在3个byte里面。
 * 即每个byte存储8个像素点信息。因为只有黑白两色，所以对应为1的位是黑色，对应为0的位是白色
 **************************************************************************/
export const draw2PxPoint = (data: ImageData): Uint8Array => {
	// 先设置一个足够大的size，最后在用数组拷贝复制到一个精确大小的byte数组中
	const size = data.width * data.height / 8 + 1000;
	const tmp = new Uint8Array(size);
	for (let i = 0; i < tmp.length; ++i) {
		tmp[i] = 0;
	}

	let k = 0;
	// 设置行距为0
	tmp[k++] = 0x1B;
	tmp[k++] = 0x33;
	tmp[k++] = 0x00;
	// 居中打印
	tmp[k++] = 0x1B;
	tmp[k++] = 0x61;
	tmp[k++] = 1;
	for (let j = 0; j < data.height / 24; j++) {
		tmp[k++] = 0x1B;
		tmp[k++] = 0x2A;// 0x1B 2A 表示图片打印指令
		tmp[k++] = 33; // m=33时，选择24点密度打印
		tmp[k++] = data.width % 256; // nL
		tmp[k++] = Math.floor(data.width / 256); // nH
		for (let i = 0; i < data.width; i++) {
			for (let m = 0; m < 3; m++) {
				for (let n = 0; n < 8; n++) {
					const b = px2Byte(i, j * 24 + m * 8 + n, data);
					tmp[k] += tmp[k] + b;
				}
				k++;
			}
		}
		tmp[k++] = 10;// 换行
	}
	// 恢复默认行距
	tmp[k++] = 0x1B;
	tmp[k++] = 0x32;

	const result = new Uint8Array(k);
	arraycopy(tmp, 0, result, 0, k);

	return result;
};

/**
 * 图片二值化，黑色是1，白色是0
 *
 * @param x   横坐标
 * @param y   纵坐标
 * @param bit 位图
 */
export const px2Byte = (x: number, y: number, bit: ImageData): number => {
	if (x < bit.width && y < bit.height) {
		const index = y * bit.width * 4 + x * 4;
		const red = bit.data[index];
		const green = bit.data[index + 1];
		const blue = bit.data[index + 2];
		const gray = RGB2Gray(red, green, blue);

		return gray < 128 ? 1 : 0;
	}

	return 0;
};

/**
 * 图片灰度的转化
 */
export const RGB2Gray = (r: number, g: number, b: number): number => {
	return Math.floor(r * 0.29900 + g * 0.58700 + g * 0.11400); // 灰度转化公式
};

export const getNowFormatDate = () => {
	const date = new Date();
	const seperator1 = '-';
	const seperator2 = ':';
	const month = date.getMonth() + 1;
	const strDate = date.getDate();
	let months;
	let strDates;
	if (month >= 1 && month <= 9) {
		months = '0' + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDates = '0' + strDate;
	}
	const currentdate = date.getFullYear() + seperator1 + months + seperator1 + strDates
		+ ' ' + date.getHours() + seperator2 + date.getMinutes()
		+ seperator2 + date.getSeconds();

	return currentdate;
};

export const printBitmap = (data: ImageData) => {
	const bmpByteArray = draw2PxPoint(data);
	printRawBytes(bmpByteArray);
};

export const printTest = (data?: ImageData) => {
	initPrinter();

	// 店铺名 居中 放大
	// printAlignment(1);
	// printLargeText("解忧杂货店");
	// printLine();
	// printAlignment(0);
	// printLine();

	// printTwoColumn("时间:", "2017-05-09 15:50:41");

	// printLine();

	// printTwoColumn("订单号:", "12345678");
	// printLine();

	// printTwoColumn("付款人:", "VitaminChen");
	// printLine();

	// // 分隔线
	// printDashLine();
	// printLine();

	// //打印商品列表
	// printText("商品");
	// printTabSpace(1);
	// printText("   数量");
	// printTabSpace(1);
	// printText("   单价");
	// printLine();

	// printThreeColumn("iphone6", "1", "4999.00");
	// printThreeColumn("测试一个超长名字的产品看看打印出来会怎么样哈哈哈哈哈哈", "1", "4999.00");

	// printDashLine();
	// printLine();

	// printTwoColumn("订单金额:", "9998.00");
	// printLine();

	// printTwoColumn("实收金额:", "10000.00");
	// printLine();

	// printTwoColumn("找零:", "2.00");
	// printLine();

	// printDashLine();

	// TODO：打印图片还没调试好
	printBitmap(data);

	// printLine(4);
	// printDashLine();
};