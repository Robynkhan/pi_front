/*
 * 图像滤镜
 * 支持多种滤镜，可以连续滤镜处理，包括 灰度-色相饱和度亮度-亮度对比度-腐蚀-锐化-高斯模糊
 * props = {"img":"./1.png", "path":"{{_path}}", arr":[["gray"], ["hsl", 180?, 1?, 1?], 
 * ["brightnessContrast", 0.5, 0?], ["corrode", 3?], ["sharp", 3?], ["gaussBlur", 3?]]}
 * 如果arr不存在或长度为0, 表示使用标准图像
 */

// ============================== 导入
import { butil } from '../lang/mod';
import { Json } from '../lang/type';
import { getImgFilterKey, RES_TYPE_IMGFILTER } from '../util/canvas';
import { ResTab } from '../util/res_mgr';
import { Widget } from '../widget/widget';

// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
export class ImgFilter extends Widget {

	/**
	 * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
	 * @example
	 */
	public setProps(props: Json, oldProps?: Json): void {
		this.props = props;
		if (!(props.arr && props.arr.length)) {
			this.props.url = props.file || (props.img ? butil.relativePath(props.img, props.path) : '');

			return;
		}
		const key = getImgFilterKey(props);
		let tab = this.resTab;
		if (!tab) {
			this.resTab = tab = new ResTab();
		}
		const res = tab.get(key);
		if (res) {
			props.url = res.link;
		} else {
			tab.load(key, RES_TYPE_IMGFILTER, props, tab, (res) => {
				props.url = res.link;
				this.paint();
			});
		}
	}

}

// ============================== 本地

// ============================== 立即执行
