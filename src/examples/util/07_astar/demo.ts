/** 
 * 输入框，要求props为{sign:string|number, text:string, id:string|number}, 注意text要转义引号
 */

// ============================== 导入

import { astar, Node } from '../../../math/astar';
import { Widget } from '../../../widget/widget';

// ============================== 导出

class Tile {
	public width: number;
	public height: number;
	public items: TileNode[];

	constructor(w: number, h: number) {
		this.width = w;
		this.height = h;
		this.items = [];
	}
}

enum Usage {
	NONE = 'white',  // 可走区域
	START = 'green',  // 开始节点
	END = 'blue',   // 结束节点
	WALL = 'gray',   // 墙
	PATH = 'red'     // 路径节点
}

class TileNode implements Node {
	public x: number;
	public y: number;
	public usage: Usage;
	public tile: Tile;

	constructor(tile: Tile, x: number, y: number, isWall: boolean) {
		this.x = x;
		this.y = y;
		this.tile = tile;
		this.usage = Usage.NONE;
	}

	/* tslint:disable:function-name */
	public g(last: TileNode) {
		let r = 0;
		if (last.x === this.x) {
			r = last.y === this.y ? 0 : 1;
		} else if (last.y === this.y) {
			r = 1;
		} else {
			r = 1.414;
		}

		return r;
	}

	public h(finish: TileNode) {
		return Math.abs(finish.x - this.x) + Math.abs(finish.y - this.y);
	}

	public *[Symbol.iterator]() {
		const x = this.x;
		const y = this.y;
		const w = this.tile.width;
		const h = this.tile.height;

		const ns = [
			{ x: x, y: y - 1 }, { x: x, y: y + 1 }, { x: x + 1, y: y }, { x: x - 1, y: y },
			{ x: x - 1, y: y - 1 }, { x: x + 1, y: y - 1 }, { x: x + 1, y: y + 1 }, { x: x - 1, y: y + 1 }
		];

		for (const n of ns) {
			if (n.x >= 0 && n.y >= 0 && n.x < w && n.y < h) {
				const item = this.tile.items[w * n.y + n.x];
				if (item.usage === Usage.WALL) continue;

				// 对角线能穿，前提是不能有临墙挡着
				if (n.x !== x && n.y !== y) {
					let t = this.tile.items[w * y + n.x];
					if (t.usage === Usage.WALL) continue;

					t = this.tile.items[w * n.y + x];
					if (t.usage === Usage.WALL) continue;
				}

				yield item;
			}
		}
	}
}

export class Demo extends Widget {
	public tile: Tile;
	public usage: Usage;
	public start: TileNode;
	public end: TileNode;

	/* tslint:disable:typedef */
	public props = {
		time: 0,
		width: 1024,
		height: 768,
		w: 64,
		h: 64,
		items: [] as TileNode[]
	};

	public create() {
		this.tile = new Tile(this.props.w, this.props.h);
		this.tile.items = this.props.items;

		for (let j = 0; j < this.props.h; ++j) {
			for (let i = 0; i < this.props.w; ++i) {
				const node = new TileNode(this.tile, i, j, false);
				this.props.items.push(node);
			}
		}

		this.usage = Usage.NONE;

		this.start = this.tile.items[0];
		this.start.usage = Usage.START;

		this.end = this.tile.items[1];
		this.end.usage = Usage.END;
	}

	public clearWall() {
		for (const n of this.props.items) {
			if (n.usage === Usage.WALL || n.usage === Usage.PATH) {
				n.usage = Usage.NONE;
			}
		}
		this.props.time = 0;
		this.paint(false);
	}

	public mousedown(x: number, y: number) {

		this.clearPath();

		const node = this.props.items[x + y * this.props.w];
		switch (node.usage) {
			case Usage.START:
				this.usage = Usage.START;
				break;
			case Usage.END:
				this.usage = Usage.END;
				break;
			case Usage.WALL:
				node.usage = Usage.NONE;
				this.usage = Usage.NONE;
				break;
			case Usage.NONE:
				node.usage = Usage.WALL;
				this.usage = Usage.WALL;
				break;
			default:
		}

		this.paint(false);
	}

	public mousemove(e: MouseEvent, x: number, y: number) {

		if (e.which !== 1) return;

		const node = this.props.items[x + y * this.props.w];
		switch (this.usage) {
			case Usage.START:
				if (node !== this.start && this.end !== node) {
					node.usage = Usage.START;
					this.start.usage = Usage.NONE;
					this.start = node;
				}
				break;
			case Usage.END:
				if (node !== this.start && this.end !== node) {
					node.usage = Usage.END;
					this.end.usage = Usage.NONE;
					this.end = node;
				}
				break;
			case Usage.WALL:
				if (node !== this.start && this.end !== node) {
					node.usage = this.usage;
				}
				break;
			case Usage.NONE:
				if (node !== this.start && this.end !== node) {
					node.usage = this.usage;
				}
				break;
			default:
		}

		this.paint(false);
	}

	public randomWall() {

		this.clearWall();

		const count = this.props.w * this.props.h;
		for (const n of this.props.items) {
			if (n.usage !== Usage.START && n.usage !== Usage.END) {
				n.usage = Math.random() > 0.7 ? Usage.WALL : Usage.NONE;
			}
		}

		this.paint(false);
	}

	public clearPath() {
		for (const n of this.props.items) {
			if (n.usage === Usage.PATH) {
				n.usage = Usage.NONE;
			}
		}
		this.props.time = 0;
	}

	public searchPath() {

		this.clearPath();

		const paths = [];
		const s = performance.now();
		astar(paths, this.start, this.end);
		const e = performance.now();
		this.props.time = e - s;

		paths.forEach((n: TileNode) => {
			if (n.usage === Usage.WALL) {
				alert('paths not wall!!');
				throw new Error('paths not wall!!');
			}
			if (n.usage !== Usage.START && n.usage !== Usage.END) {
				n.usage = Usage.PATH;
			}
		});

		this.paint(false);
	}
}