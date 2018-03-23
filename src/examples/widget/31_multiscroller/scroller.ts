/**
 * 
 */
import { notify } from '../../../widget/event';
import { Widget } from '../../../widget/widget';

export class Scroller extends Widget {
	/* tslint:disable:typedef */
	public inner = null;
	public outer = null;
	public outery = 0;
	public innery = 0;
	public scroll(event) {
		console.log(`id is : ${event.id}, x is : ${event.x}, y is : ${event.y}`);
		if (event.id === 'outer') {
			this.outery = event.y;
			this.outer = event.instance;
			if (event.y === -100) {
				this.outer.disable();
			}
		}
		if (event.id === 'inner') {
			this.inner = event.instance;
			this.innery = event.y;
			if (this.innery === 0) {
				this.outer.enable();
			}
		}
	}
	public tap() {
		alert('tap');
	}
	public longtap() {
		alert('longtap');
	}
}  
