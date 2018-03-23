/*
 * 图像文字
 * 只支持单行文字，不支持继承的font属性，不支持line-height属性
 * 	如果支持继承的font属性，则需要在div放入节点后，获取font属性
 * 	如果支持多行文本，需要支持line-height属性，并处理对齐问题
 * 要求props为 {
 * 					textCfg:canvas.ImgTextCfg,
 * 					space?:number,
 * 					"show":"" // 如果有show，表示为拼接文字，text为全文字，show变动不会生成新的文字图片
 * 				}
 * 
canvas.ImgTextCfg {
		"text": "测试",
		"font": "normal 400 24px 宋体",
		"color": "#636363" | GradientCfg, // 颜色 或渐变颜色
		"shadow": { // 阴影
			"offsetX": number,
			"offsetY": number, //偏移量
			"blur": number, // 模糊值，一般为5
			"color": string; // 颜色 "rgba(0,0,0,0.5)" "gray" "#BABABA"
		};
		"strokeWidth": number, // 描边宽度
		"strokeColor": string | GradientCfg, // 描边颜色
		"background": string | GradientCfg, // 背景
	}
 */

// ============================== 导入
import { Json } from '../lang/type';
import { getImgTextKey, RES_TYPE_IMGTEXT } from '../util/canvas';
import { ResTab } from '../util/res_mgr';
import { Widget } from '../widget/widget';

// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
export class ImgText extends Widget {

	/**
	 * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
	 * @example
	 */
	public setProps(props: Json, oldProps?: Json): void {
		const key = getImgTextKey(props.textCfg);
		if (!props.textCfg.isCommon) {
			props.space && (props.textCfg.space = props.space);
			props.show && (props.textCfg.text = props.show);
		}
		if (this.props && this.props.textCfg && this.props.textCfg.key === key) {
			this.props.show = props.show;
		} else {
			this.props = props;
			let tab = this.resTab;
			if (!tab) {
				this.resTab = tab = new ResTab();
			}
			const res = tab.get(key);
			if (res) {
				props.textCfg.url = res.link;
				if (res.args.charUV) {
					props.textCfg.charUV = res.args.charUV;
				}
				props.textCfg.width = res.args.width;
				props.textCfg.height = res.args.height;
				props.textCfg.zoomfactor = res.args.zoomfactor;
			} else {
				tab.load(key, RES_TYPE_IMGTEXT, props.textCfg, undefined, (res) => {
					props.textCfg.url = res.link;
					if (res.args.charUV) {
						props.textCfg.charUV = res.args.charUV;
					}
					props.textCfg.width = res.args.width;
					props.textCfg.height = res.args.height;
					props.textCfg.zoomfactor = res.args.zoomfactor;
					this.paint();
				});
			}
		}
	}

}

// ============================== 本地

// ============================== 立即执行
