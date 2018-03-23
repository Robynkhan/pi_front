/**
 * 
 */
import {notify} from '../../../widget/event';
import {Widget} from '../../../widget/widget';

export class Grand extends Widget {
	constructor() {
		super();
	}
	public grandClick(event:any) {
		alert('i am grand , i get on-click event');
	}
	public childClick(event:any) {
		alert('i am grand , i get ev-child-click event');
	}
	public fatherClick(event:any) {
		alert('i am grand , i get ev-father-click event');
	}
}