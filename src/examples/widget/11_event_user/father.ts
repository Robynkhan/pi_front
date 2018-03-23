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
		alert(`father get it : ${event.value}`);        
	}
}
