/**
 * 
 */
import { Widget } from '../../../widget/widget';

/**
 * 选项
 */
interface TodoItem {
	name: string;          // 描述事项
	isCompleted: boolean;  // 是否完成
}

/**
 * 显示状态
 */
enum ShowState {
	All = 'all',             // 显示所有
	Active = 'active',       // 显示未完成
	Completed = 'completed'  // 显示已完成
}

/**
 * Todo组件
 */
export class TodoWidget extends Widget {

	/**
	 * props就是tpl的it
	 */
	// tslint:disable-next-line:typedef
	public props = {

		isAllCompleted: false,	  // 是否全部选中

		state: ShowState.All,     // 当前显示状态

		items: <TodoItem[]>[],    // todo列表

		// 注意：props的属性 只读
		get leftCount() {        // 还剩多少项未完成
			// 注意：这里主要是为写代码方便，如果获取很频繁（比如一秒钟调用上百次），或者列表很大（比如几千条），那还是用循环不至于损失性能
			return this.items.filter(v => !v.isCompleted).length;
		},

		/**
		 * 显示过滤函数，返回true，该选项则显示出来
		 */
		filter(item: TodoItem) {
			// 显示所有
			if (this.state === ShowState.All) return true;
			
			// 显示已完成/未完成
			return this.state === ShowState.Completed ? item.isCompleted : !item.isCompleted;
		}
	};

	/**
	 * 添加一个选项
	 * @param e HTML Event
	 */
	// tslint:disable-next-line:typedef
	public add(e) {
		this.props.items.push({
			name: e.target.value,
			isCompleted: false
		});

		// 清空输入框的值
		e.target.value = '';
		// 绘制，参数一般不填true，除非特殊情况（比如该组件大规模更新）
		this.paint();
	}

	/**
	 * 移除第index个todo选项
	 */
	public remove(index: number) {
		this.props.items.splice(index, 1);
		this.paint();
	}

	/**
	 * 全选或全不选
	 */
	public toggleCompleteAll() {
		const p = this.props;
		p.isAllCompleted = !p.isAllCompleted;
		
		for (const item of p.items) {
			item.isCompleted = p.isAllCompleted;
		}
		this.paint();
	}

	/**
	 * 切换完成的状态
	 */
	public toggleComplete(index: number) {
		const item = this.props.items[index];
		item.isCompleted = !item.isCompleted;
		this.paint();
	}

	/**
	 * 显示所有
	 */
	public showAll() {
		this.props.state = ShowState.All;
		this.paint();
	}

	/**
	 * 显示未完成的
	 */
	public showActive() {
		this.props.state = ShowState.Active;
		this.paint();
	}

	/**
	 * 显示已完成的
	 */
	public showCompleted() {
		this.props.state = ShowState.Completed;
		this.paint();
	}

	/**
	 * 清空已经完成的选项
	 */
	public clearCompleted() {
		this.props.items = this.props.items.filter(v => !v.isCompleted);
		this.paint();
	}
}