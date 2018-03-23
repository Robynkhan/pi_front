/*
 * 世界， 可以注册组件，可以创建实体
 * 每个实体都是一个组件树，组件不会被共享
 * 参考 谷歌AR/VR开源库lullaby github.com/google/lullaby
 * rs版本的ecs https://github.com/slide-rs
 * c#版本的ecs https://github.com/sschmid/Entitas-CSharp
 * 	https://github.com/andoowhy/EgoCS
 * 
 * ecs 介绍
 * https://www.zhihu.com/question/61169850
 * http://gad.qq.com/article/detail/28682
 * http://gad.qq.com/article/detail/28219
 * https://blog.codingnow.com/2017/06/overwatch_ecs.html
 */
/* tslint:disable:no-reserved-keywords */
declare var module: any;
// ============================== 导入
import { addToMeta, MStruct, MStructMeta, removeFromMeta, StructMgr} from '../struct/struct_mgr';
import { BinBuffer } from '../util/bin';
import { strHashCode } from '../util/hash';
import { arrDelete, arrInsert } from '../util/util';

/**
 * 组件, 组件只能有一个父组件
 * @example
 */
export class Component extends MStruct {
	// 父组件
	public parent: Component | Entity;
	public removeMeta() {
		super.removeMeta();
		parent = null;
	}	
}

/**
 * 实体
 * @example
 */
export class Entity extends MStruct {
	public parent: Entity;// 父实体
	/* tslint:disable:typedef */
	public children = new Map<number, Entity>();// 子实体
	public comp = new Map<Function, Component>();// 组件表

	/**
	 * 添加子实体，并调用监听器（创建、修改、删除，可以定义域监听）
	 * @param e:子实体， mgr:管理器
	 */
	public addChild(e: Entity) {
		if (!e) {
			return;
		}
		if (e.parent) {
			throw new Error('entity has already parent');
		}		
		e.parent = this;
		this.children.set(e._$index, e);		
	}	

	/**
	 * 移除子实体
	 */
	public removeChild(index: number) {
		const ee = this.children.get(index);
		if (!ee) {
			throw new Error(`entity is not exist!,index:${index}`);			
		}
		this.children.delete(index);
		removeFromMeta(ee);
		ee.children.forEach((v) => {
			ee.removeChild(v._$index); // 递归删除子实体
		});
	}

	/**
	 * 添加子组件，相同的子组件类型会替换，并调用监听器（创建、修改、删除，可以定义域监听）
	 */
	public addComp(c: Component) : Component {
		if (c && c.parent) {
			throw new Error('component has already parent');
		}
		const old = this.comp.get(c.constructor);
		if (old) {
			removeFromMeta(old);
			old.parent = null;
		}
		this.comp.set(c.constructor, c);
		c.parent = this;
		// c.fieldKey = ""; // 特殊处理
		addToMeta(this._$meta.mgr, c);	
		
		return old;
	}

	/**
	 * 移除子组件，参数为子组件的类， 并调用监听器（创建、修改、删除，可以定义域监听）
	 */
	public removeComp(compClass: Function) : Component {
		const old = this.comp.get(compClass);
		if (!old) {
			throw new Error('component is not exist');
		}
		old.removeMeta();

		return old;
	}

	/**
	 * 获取组件
	 */
	public getComp(compClass: Function) {
		return this.comp.get(compClass);
	}

}

/**
 * 实体索引
 * @example
 */
export class EntityIndex {
	// 实体索引
	public map = new Map<number, Entity>();
	// 包含的组件类
	public keys = new Set<Function>();
	// 对应的组件监听器
	public addListener: Function;
	public removeListener: Function;
	
	constructor(keys: Function[]) {
		this.keys = new Set(keys);
	}

}
/**
 * 组件索引
 * @example
 */
/* tslint:disable:max-classes-per-file */
export class ComponentIndex {
	// 组件索引
	public map = new Map<number, Component>();
	// 组件类
	public key : Function;
	// 父组件类
	public parentKey: Function;
	// 对应的组件监听器
	public addListener: Function;
	public removeListener: Function;
	
	constructor(key: Function, parentKey?: Function) {
		this.key = key;
		this.parentKey = parentKey;
	}

}

/**
 * 单例组件索引
 * @example
 */
export class SingleIndex {
	// 实体索引
	public comp: Component;
	// 组件类
	public key : Function;
	// 对应的组件监听器
	public addListener: Function;
	public removeListener: Function;
	
	constructor(key: Function) {
		this.key = key;
	}

}

/**
 * 创建世界
 * @example
 */
export class World extends StructMgr {

	/**
	 * 构造方法
	 */
	constructor() {
		super();
		super.register(strHashCode(`${module.id}Entity`, 0), Entity, `${module.id}Entity`);
		
	}

	/**
	 * 添加实体索引
	 */
	public addEntityIndex(i: EntityIndex) {
		i.addListener = (c:Component) => {
			const p = c.parent as Entity;
			for (const k of i.keys) {
				if (!p.getComp(k)) {
					return;
				}
			}
			i.map.set(p._$index, p);
		};
		i.removeListener = (c:Component) => {
			const p = c.parent as Entity;
			i.map.delete(p._$index);
		};
		for (const c of i.keys) {
			this.addAddListener(c, i.addListener, Entity);
			this.addRemoveListener(c, i.removeListener, Entity);
		}
	}
	/**
	 * 移除实体索引
	 */
	public removeEntityIndex(i: EntityIndex) {
		for (const c of i.keys) {
			this.removeAddListener(c, i.addListener, Entity);
			this.removeRemoveListener(c, i.removeListener, Entity);
		}
	}
	/**
	 * 添加组件索引
	 */
	public addComponentIndex(i: ComponentIndex) {
		i.addListener = (c:Component) => {
			i.map.set(c._$index, c);
		};
		i.removeListener = (c:Component) => {
			i.map.delete(c._$index);
		};
		this.addAddListener(i.key, i.addListener, i.parentKey);
		this.addRemoveListener(i.key, i.removeListener, i.parentKey);
	}
	/**
	 * 移除组件索引
	 */
	public removeComponentIndex(i: ComponentIndex) {
		this.removeAddListener(i.key, i.addListener, i.parentKey);
		this.removeRemoveListener(i.key, i.removeListener, i.parentKey);
	}
	/**
	 * 添加单例组件索引
	 */
	public addSingleIndex(i: SingleIndex) {
		i.addListener = (c:Component) => {
			i.comp = c;
		};
		i.removeListener = (c:Component) => {
			i.comp = null;
		};
		this.addAddListener(i.key, i.addListener);
		this.addRemoveListener(i.key, i.removeListener);
	}
	/**
	 * 移除单例组件索引
	 */
	public removeSingleIndex(i: SingleIndex) {
		this.removeAddListener(i.key, i.addListener);
		this.removeRemoveListener(i.key, i.removeListener);
	}

	/**
	 * 添加组件添加监听器
	 */
	public addAddListener(compClass: Function, listener: Function, parentCompClass?: Function) {
		const meta = getMeta(this, compClass);
		if (parentCompClass) {
			meta.addFilter = arrInsert(meta.addFilter, new ListenerCfg(listener, getMeta(this, parentCompClass)));
		} else {
			meta.addAddListener(listener);
		}
	}
	/**
	 * 移除组件添加监听器
	 */
	public removeAddListener(compClass: Function, listener: Function, parentCompClass?: Function) {
		const meta = getMeta(this, compClass);
		if (parentCompClass) {
			meta.addFilter = arrDelete(meta.addFilter, getListenerIndex(meta.addFilter, listener));
		} else {
			meta.removeAddListener(listener);
		}
	}
	/**
	 * 注册组件修改监听器
	 */
	public addModifyListener(compClass: Function, listener: Function, parentCompClass?: Function) {
		const meta = getMeta(this, compClass);
		if (parentCompClass) {
			const p = this.constructMap.get(parentCompClass);
			if (!p) {
				throw new Error(`unregister component, name:${parentCompClass.name}`);				
			}
			meta.modifyFilter = arrInsert(meta.modifyFilter, new ListenerCfg(listener, getMeta(this, parentCompClass)));
		} else {
			meta.modify = arrInsert(meta.modify, listener);
		}
	}
	/**
	 * 移除组件添加监听器
	 */
	public removeModifyListener(compClass: Function, listener: Function, parentCompClass?: Function) {
		const meta = getMeta(this, compClass);
		if (parentCompClass) {
			meta.modifyFilter = arrDelete(meta.modifyFilter, getListenerIndex(meta.modifyFilter, listener));
		} else {
			meta.removeModifyListener(listener);
		}
	}
	/**
	 * 注册组件移除监听器
	 */
	public addRemoveListener(compClass: Function, listener: Function, parentCompClass?: Function) {
		const meta = getMeta(this, compClass);
		if (parentCompClass) {
			meta.removeFilter = arrInsert(meta.removeFilter, new ListenerCfg(listener, getMeta(this, parentCompClass)));
		} else {
			meta.remove = arrInsert(meta.remove, listener);
		}
	}
	/**
	 * 移除组件添加监听器
	 */
	public removeRemoveListener(compClass: Function, listener: Function, parentCompClass?: Function) {
		const meta = getMeta(this, compClass);
		if (parentCompClass) {
			meta.removeFilter = arrDelete(meta.removeFilter, getListenerIndex(meta.removeFilter, listener));
		} else {
			meta.removeRemoveListener(listener);
		}
	}

	/**
	 * 创建实体
	 */
	public create() : Entity {
		const e = new Entity();
		addToMeta(this, e);
		
		return e;
	}
}

// ============================== 本地
// 监听器配置信息
class ListenerCfg {
	public listener: Function;
	// 监听的父组件元信息
	public parentCompMeta: CompMeta;
	constructor(listener: Function, p: CompMeta) {
		this.parentCompMeta = p;
		this.listener = Function;
	}
}

// 组件元信息
class CompMeta extends MStructMeta {
	public addFilter:ListenerCfg[] = [];// 插入监听器，需要过滤键和父组件
	public modifyFilter:ListenerCfg[] = [];// 修改监听器，需要过滤键和父组件
	public removeFilter:ListenerCfg[] = [];// 删除监听器，需要过滤键和父组件

	public addNotify(c: Component) {
		super.addNotify(c);
		notify(this.addFilter, c);
	}
	public removeNotify(c: Component) {
		super.removeNotify(c);
		notify(this.removeFilter, c);
	}
	public modifyNotify(c: Component, fieldKey:string, value:any, old:any, fieldKeyIndex?:string | number) {
		const arr = this.modify;
		const arrFilter = this.modifyFilter;
		for (const l of arr) {
			l(c, fieldKey, value, old, fieldKeyIndex);
		}
		for (const l of arrFilter) {
			c.parent._$meta === l.parentCompMeta && l.listener(c, fieldKey, value, old, fieldKeyIndex);
		}
	}

}

/**
 * 获取组件元信息
 */
const getMeta = (w:World, compClass:Function): CompMeta => {
	const meta = w.constructMap.get(compClass) as CompMeta;
	if (!meta) {
		throw new Error(`unregister component, name:${compClass.name}`);		
	}

	return meta;
};

/**
 * 获取监听器的位置
 */
const getListenerIndex = (arr:ListenerCfg[], listener: Function): number => {
	for (let i = arr.length - 1; i >= 0; i--) {
		if (arr[i].listener !== listener) {
			return i;
		}
	}
	
	return -1;
};
	
// 通知监听器
const notify = (arrFilter:ListenerCfg[], c: Component) => {
	for (const l of arrFilter) {
		(c.parent._$meta === l.parentCompMeta) && l.listener(c);
	}
};
