/*
 * 提示组件
 * 负责维护一棵提示组件树，提示及当前打开的提示组件都在这棵树上
 * 根据提示数据的设置，更新当前打开的提示组件，是否显示提示UI（如:红点）
 * 组件的更新通过监听setProps来完成
 * @example <app-ui-tip>{"tip_keys":["a.b.c","d.e.f"]}</app-ui-tip>
 */

// ============================== 导入
import { Json } from '../lang/type';
import { Widget } from '../widget/widget';

// ============================== 导出
/**
 * @description 导出组件Widget类
 * @example
 */
export class Tip extends Widget {

	/**
	 * @description 设置属性，默认外部传入的props是完整的props，重载可改变行为
	 * @example
	 */
	public setProps(props: Json, oldProps?: Json): void {
		if (props && oldProps) {
			delWidget(this, oldProps.tip_keys);
		}
		props.show = addWidget(this, props.tip_keys);
		this.props = props;
	}
	/**
	 * @description 销毁时调用，一般在渲染循环外调用
	 * @example
	 */
	public destroy(): boolean {
		if (!super.destroy()) {
			return;
		}
		delWidget(this, this.props.tip_keys);
	}

}

/**
 * @description 判断指定的键对应的提示数量
 * @param keys "a.b.c.d"
 * @example
 */
// tslint:disable:no-reserved-keywords
export const get = (key: string): number => {
	const e = getEntry(tree, key);

	return e ? e.count : 0;
};

/**
 * @description 设置指定的键对应的提示是否有效
 * @param keys "a.b.c.d"
 */
export const set = (key: string, b: boolean): void => {
	if (!key) {
		return;
	}
	if (b) {
		let e = setEntry(tree, key);
		if (e.count > 0) {
			return;
		}
		while (e) {
			e.count++;
			if (e.count === 1) {
				paint(e.widgets, true);
			}
			e = e.parent;
		}

		return;
	}
	let e = getEntry(tree, key);
	let has = false;
	while (e) {
		e.count--;
		if (e.count > 0) {
			break;
		}
		paint(e.widgets, false);
		if (!has) {
			if (e.widgets) {
				has = true;
			} else if (e.parent) {
				e.parent.children.delete(e.key);
			}
		}
		e = e.parent;
	}
};

// ============================== 本地
// 提示条目
class Entry {
	// 本条目及以子条目的提示数量
	public count: number = 0;
	// 键
	public key: string = '';
	// 键
	public parent: Entry = null;
	// 子条目
	public children: Map<string, Entry> = new Map();
	// 关心本条目的组件
	public widgets: Widget[] = null;
}

/**
 * @description 提示树
 */
const tree = new Entry();

/**
 * @description 根据路径删除该组件的引用
 */
const delWidget = (w: Widget, keys: string[]) => {
	if (!keys) {
		return;
	}
	for (const key of keys) {
		const e = getEntry(tree, key);
		if (!e) {
			continue;
		}
		const arr = e.widgets;
		if (!arr) {
			continue;
		}
		const i = arr.indexOf(w);
		if (i < 0) {
			continue;
		}
		const len = arr.length - 1;
		if (i < len) {
			arr[i] = arr[len];
		}
		if (len) {
			arr.length = len;
		} else {
			e.widgets = null;
		}
	}
};

/**
 * @description 添加组件，返回是否显示
 */
const addWidget = (w: Widget, keys: string[]): boolean => {
	let show = false;
	for (const key of keys) {
		const e = setEntry(tree, key);
		let arr = e.widgets;
		if (!arr) {
			e.widgets = arr = [];
		}
		arr.push(w);
		show = show || e.count > 0;
	}

	return show;
};

/**
 * @description 根据提示数据刷新需要更新的组件
 */
const paint = (widgets: Widget[], show: boolean) => {
	if (!widgets) {
		return;
	}
	for (const w of widgets) {
		const props = w.getProps();
		if (props.show !== show) {
			props.show = show;
			w.paint();
		}
	}
};

/**
 * @description 获得对象的值，键可以多层，用"."分隔
 * @example
 */
export const getEntry = (e: Entry, key: string): Entry => {
	let i = key.indexOf('.');
	let j = 0;
	while (i > j) {
		const k = key.slice(j, i);
		const v = e.children.get(k);
		if (!v) {
			return;
		}
		e = v;
		j = i + 1;
		i = key.indexOf('.', j);
	}
	if (j > 0) {
		key = key.slice(j);
	}

	return e.children.get(key);
};

/**
 * @description 设置提示树，返回最后的提示条目
 * @example
 */
const setEntry = (e: Entry, key: string): Entry => {
	let i = key.indexOf('.');
	let j = 0;
	while (i > j) {
		const k = key.slice(j, i);
		let v = e.children.get(k);
		if (!v) {
			v = new Entry();
			v.key = k;
			v.parent = e;
			e.children.set(k, v);
		}
		e = v;
		j = i + 1;
		i = key.indexOf('.', j);
	}
	if (j > 0) {
		key = key.slice(j);
	}
	let v = e.children.get(key);
	if (!v) {
		v = new Entry();
		v.key = key;
		v.parent = e;
		e.children.set(key, v);
	}
	
	return v;
};

// ============================== 立即执行
