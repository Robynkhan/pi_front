/**
 * 场景相关
 */

// ===========================导入
import { Json } from '../lang/type';
import { Renderer } from '../render3d/renderer';
import { THREE } from '../render3d/three';
import { getScale } from '../ui/root';
import * as Hash from '../util/hash';
import { ResTab } from '../util/res_mgr';
import { compile, toFun } from '../util/tpl';
import { Parser } from '../util/tpl_str';

const resTab = {};
/* tslint:disable:prefer-const */
let limitTime;
let renderer;
const scene = {};
const width = {};
const height = {};
const pause = {};
const listener = {};
const camera: any = {};
const parentNode = {
	type: 'Node',
	position: [0, 0, 0]
};
const FPS = 0;
const div = {};
const log = [];
const lastTime = new Date().getTime();
const clock = new THREE.Clock();
// ===========================导出
/* tslint:disable:variable-name */
export let mgr_data = {
	name: '',
	width: width,
	height: height,
	div: div,
	limitTime: limitTime,
	sceneTab: {},
	camera: camera,
	move_onOff: true,
	scale: 0.7,
	threeScene: scene
};

/* tslint:disable:class-name no-unnecessary-class function-name typedef*/
export class mgr {
	/**
	 * * @description 得到帧率
	 */
	public static FPS() {
		return FPS;
	}

	/**
	 * * @description 打印
	 */
	public static log(msg) {
		log.push(msg);
	}

	public static createRenderer(width, height, antialias = false, ratio = 1) {
		renderer = new Renderer(width, height, antialias, ratio);

		return renderer;
	}

	public static createScene(sceneData, name) {
		mgr_data.name = name;
		resTab[name] = sceneData.resTab;
		const scene1 = renderer.createScene(sceneData);
		scene[name] = scene1;

		return scene1;
	}
	
	/**
	 * * @description 设置场景对象的位置
	 */
	public static setPos(data, x, y, z) {
		data._show.old.position[0] = x;
		data._show.old.position[1] = z || 0;
		data._show.old.position[2] = y;
		if (data._show.old.ref) {
			scene[mgr_data.name].modify(data._show.old, ['position']);
		}
	}
	
	/**
	 * * @description 创建指定数据对应的场景对象
	 */
	public static create(obj, parent?) {
		if (parent) {
			parent = parent;
		} else {
			// parent = parentNode;
		}
		// let func = toFun(compile(tplStr, Parser), "");
		// let obj = new SceneOld[type](JSON.parse(func(data)));
		// let obj;
		// try {
		// obj = JSON.parse(data);
		addHash(obj);
		// } catch (e) {
		//     //console.log(data, e);
		// }

		obj._show = obj._show || {};
		// data._show.tpl = func;
		obj._show.old = obj;

		scene[mgr_data.name].insert(obj, parent, resTab[mgr_data.name]);
	}

	/**
	 * @description 修改指定数据对应的场景对象
	 *  低2祯
	 */
	public static modify(obj, old) {
		// let obj;
		// if (!data) {
		//     console.log(data);
		// }
		try {
			// obj = JSON.parse(data._show.tpl(undefined, data));
			addHash(obj);
		} catch (e) {
			// console.log(data._show.tpl(data));
		}
		obj._show = old._show;

		if (obj._show.old.ref) {
			mergeNode(obj, obj._show.old, obj._show.old.resTab, 'position');
		}
	}

}

// ============================本地

const mergeProperty = (obj, newAttr, old, key, resTab, attr) => {
	let i;
	const oldAttr = old[key];
	const cAttr = attr.concat([key]);
	const endAttr = { image: true, lookatOnce: true, playAnim: true, position: true, scale: true, rotate: true, textCon: true };

	if (key === '_$hash' || key === '_show') {
		return;
	}

	if (typeof newAttr === 'object') {
		if (key === 'children') {
			for (i = newAttr.length - 1; i >= 0; i--) {
				const v = newAttr[i];
				const oldv = oldAttr[i];
				if (!v && oldv) {
					old[i] = v;
					scene[mgr_data.name].remove(oldv);
				} else if (v && !oldv) {
					old[i] = v;
					scene[mgr_data.name].insert(v, old, resTab);
				} else if (v && oldv) {
					mergeNode(v, oldv, resTab, 'position');
				}
			}
		} else if (!newAttr) {
			old[key] = newAttr;
			scene[mgr_data.name].modify(obj, cAttr);
		} else if (newAttr._$hash === oldAttr._$hash) {
			return;
		} else if (oldAttr) {
			if (endAttr[key] === true) {
				old[key] = newAttr;
				scene[mgr_data.name].modify(obj, cAttr);

				return;
			}

			for (const k in newAttr) {
				mergeProperty(obj, newAttr[k], oldAttr, k, resTab, cAttr);
			}
		} else {
			old[key] = newAttr;
			scene[mgr_data.name].modify(obj, cAttr);
		}
		oldAttr._$hash = newAttr._$hash;
	} else if (newAttr !== oldAttr) {
		old[key] = newAttr;
		scene[mgr_data.name].modify(obj, cAttr);
	}
};

// 合并
const mergeNode = (newObj, old, resTab, skip?) => {
	if (newObj._$hash === old._$hash) {
		return;
	}
	for (const k in newObj) {
		// if(k === skip)
		//     continue;
		mergeProperty(old, newObj[k], old, k, resTab, []);
		old._$hash = newObj._$hash;
	}
};

const addHash = (obj) => {
	let k;
	let parentHash = 0;
	let keyHash = 0;
	let valueHash = 0;
	let childHash = 0;
	for (k in obj) {
		const v = obj[k];
		keyHash = Hash.iterHashCode(k, 0, Hash.charHash);

		if (typeof v === 'object') {
			if (v === null) {
				continue;
			} else {
				v._$hash = valueHash = addHash(v);
				childHash = Hash.nextHash(keyHash, valueHash);
			}
		} else if (isNaN(v)) {
			childHash = Hash.iterHashCode(v, keyHash, Hash.charHash);
		} else {
			if (Number.isInteger(v)) {
				childHash = Hash.nextHash(Hash.nextHash(keyHash, 5), v);
			} else {
				childHash = Hash.nextHash(keyHash, 6);
				const v1 = Math.floor(v);
				childHash = Hash.nextHash(Hash.nextHash(childHash, v1), Math.floor((v - v1) * 0xFFFFFFFF));
			}
		}

		parentHash = Hash.nextHash(parentHash, childHash);
	}
	obj._$hash = parentHash;

	return parentHash;
};

const parseTpl = (fileName: string, data: Json) => {

	const parse = (fn: string, dt: Json) => {
		// let tplfun = getTemplateFunction(fn);
		// return tplfun(null, dt, null);
	};

	const parseChild = (obj: Json) => {
		if (obj && obj.children) {
			const children = obj.children;
			for (let i = 0; i < children.length; i++) {
				if (children[i].type === 'prefab') {
					const o = parse(children[i].tpl, children[i]);
					obj.children[i] = o;
					parseChild(o);
				}
			}
		}
	};

	const obj = parse(fileName, data);
	parseChild(obj);

	return obj;
};
