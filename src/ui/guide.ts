/*
 * 引导模块
 * 包括引导状态表{state1:[{name:"gs1",...},{name:"g2",...}],state2:[{name:"gs2",...},{name:"g2",...}],...}，引导组件和引导强制组件
 * 当开始指定引导状态时，弹出引导强制组件，查找和监听引导组件的初始化，负责整个引导过程。
 * 通过监听器，可以在开始和结束时记录到后台，和衔接剧情等。
 * 引导组件应该嵌在指定的按钮组件内，负责通知引导模块有指定引导状态的按钮初始化。
 * 监听按钮是否按下，如果当前在指定引导类型上，刷新引导强制组件。
 * 引导强制组件保证只有按钮组件的区域可以被按下。
 * 
 * 考虑如果在一个状态下，用户异常退出，用户重新登录后需要修复到该状态，而该状态可能需要从主界面引导才可以进入该状态。这个引导过程应该定义一个单独的修复状态。可以采用state1_fix的命名来定义。由应用代码来判断和调用。
 * 
 * 在一个状态下，用户异常退出，还有可能导致该状态无法继续（比如物品已经被用掉了）。这种情况，应该减少一个状态下的步数，来保证状态内数据的原子性。并可以通过代码来跳过异常状态。
 * 
 * @example <app-ui-guide>"g2"</app-ui-guide>
 */

// ============================== 导入
import { Json } from '../lang/type';
import { createHandlerList } from '../util/event';
import { offsetPos } from '../util/html';
import { addNativeEventListener } from '../widget/event';
import { Forelet } from '../widget/forelet';
import { Widget } from '../widget/widget';
import { destory, getRoot, open, setForbidBack } from './root';

// ============================== 导出
/**
 * @description 导出的监听器列表
 * @example
 */
export const listenerList = createHandlerList();

/**
 * @description 导出组件Widget类
 * @example
 */
export class Guide extends Widget {
	public id: number = maxID++;
	public painted: boolean = false;
	/**
	 * @description 第一次计算后调用，此时创建了真实的dom，但并没有加入到dom树上，一般在渲染循环外调用
	 * @example
	 */
	public firstPaint(): void {
		super.firstPaint();
		widgetMap.set(this.id, this);
	}
	/**
	 * @description 添加到dom树后调用，在渲染循环内调用
	 * @example
	 */
	public attach(): void {
		if (!cur) {
			return;
		}
		const show = stateTable[cur][step];
		if (this.props === show.name) {
			guideForce(this, show);
		}
	}
	/**
	 * @description 绘制方法，
	 * @param reset表示新旧数据差异很大，不做差异计算，直接生成dom
	 * @example
	 */
	public paint(reset?: boolean): void {
		if (this.painted) {
			return;
		}
		this.painted = true;
		super.paint(reset);
	}
	/**
	 * @description 销毁时调用，一般在渲染循环外调用
	 * @example
	 */
	public destroy(): boolean {
		if (!super.destroy()) {
			return;
		}
		widgetMap.delete(this.id);
	}
	/**
	 * @description 销毁时调用，一般在渲染循环外调用
	 * @example
	 */
	public guide() {
		if (!cur) {
			return;
		}
		const steps = stateTable[cur];
		if (this.props !== steps[step].name) {
			return;
		}
		if (step < steps.length - 1) {
			step++;
			if (!guideFind()) {
				// 如果没有找到当前存在的引导组件，则强制引导组件回到初始态
				guideForceWidget.setProps({ x: 0, y: 0, w: 0, h: 0, show: {} });
				guideForceWidget.paint();
			}
		} else {
			// 引导结束
			setForbidBack(false);
			if (guideForceWidget) {
				destory(guideForceWidget);
			}
			guideForceWidget = null;
			listenerList({ type: 'guideOver', state: cur });
			cur = '';
		}
	}

}

/**
 * @description 初始化引导状态表
 * @param stateTab 引导状态表
 * @example
 */
export const init = (stateTab: Json) => {
	stateTable = stateTab;
};

/**
 * @description 开始指定的引导状态
 * @param state 引导状态
 * @example
 */
export const start = (state: string) => {
	cur = state;
	step = 0;
	setForbidBack(true);
	if (!guideForceWidget) {
		guideForceWidget = open(guideForceWidgetName, { height: 0, left: 0, top: 0, width: 0 });
	}
	guideFind();
	listenerList({ type: 'guideStart', state: cur });
};

/**
 * @description 获得引导强制组件的名称
 */
export const getGuideForceWidgetName = (): string => {
	return guideForceWidgetName;
};

/**
 * @description 设置引导强制组件的名称
 * @param widgetName  "app-ui-guideforce"
 */
export const setGuideForceWidgetName = (widgetName: string): void => {
	guideForceWidgetName = widgetName;
};

// ============================== 本地
/**
 * @description 引导状态表
 */
let stateTable: Json = {};
/**
 * @description 当前状态
 */
let cur: string = '';
/**
 * @description 当前状态的步数
 */
let step: number = 0;

/**
 * @description Widget自增ID,用于区分创建的Widget
 */
let maxID = 1;
/**
 * @description 引导强制组件的名称
 */
const widgetMap: Map<number, Widget> = new Map();

/**
 * @description 引导强制组件的名称
 */
let guideForceWidgetName = '';
/**
 * @description 引导强制组件
 */
let guideForceWidget: Widget = null;

/**
 * @description 寻找指定的引导组件
 */
const guideFind = (): boolean => {
	const show = stateTable[cur][step];
	for (const w of widgetMap.values()) {
		if (w.props === show.name) {
			guideForce(w, show);

			return true;
		}
	}
	
	return false;
};
/**
 * @description 刷新强制引导组件
 */
const guideForce = (w: Widget, show: any): void => {
	const el = w.tree.link as HTMLElement;
	const pos = { x: 0, y: 0, w: el.offsetWidth, h: el.offsetHeight, show: show };
	const p = offsetPos(el, getRoot(), pos);
	if (!p) {
		pos.x = pos.y = pos.w = pos.h = 0;
	}
	guideForceWidget.setProps(pos);
	guideForceWidget.paint();
};

// ============================== 立即执行
