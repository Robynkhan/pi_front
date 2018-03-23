/**
 * 
 */
import {notify} from '../../../widget/event';
import {Widget} from '../../../widget/widget';

export class Father extends Widget {
	constructor() {
		super();
	}
	public fatherClick(event:any) {
		alert('i am father , i get on-click event');
	}
	public childClick(event:any) {
		alert(`i am father , i get ev-child-click event${event.value}`);        
		notify(event.node, 'ev-father-click', {value:'tangmin'});
	}
}