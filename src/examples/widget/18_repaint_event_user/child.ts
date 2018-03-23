/**
 * 
 */
import { notify } from '../../../widget/event';
import { Widget } from '../../../widget/widget';

export class Child extends Widget {
	constructor() {
		super();
		this.props = {
		};
	}
	public clickFunc(event: any) {
		event.preventDefault();
		notify(event.node, 'ev-click', { value: 'tangmin' });
	}

	public click1(event: any) {
		event.preventDefault();
		alert(' i am click 1');
		this.props.clickFunc = 'click2';
		this.paint();
	}
	public click2(event: any) {
		alert(' i am click 2');
	}
}  