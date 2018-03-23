/**
 * 
 */
import { notify } from '../../../widget/event';
import { Widget } from '../../../widget/widget';

export class Child extends Widget {
	constructor() {
		super();
	}
	public childClick(event: any) {
		alert('childClick');
		notify(event.node, 'ev-click', { value: 'tangmin' });
	}

}
