/**
 * 
 */
import {notify} from '../../../widget/event';
import { Widget } from '../../../widget/widget';

interface Props {
	arr: number[];
}

export class Attr extends Widget {
	constructor() {
		super();
		this.props = {
			arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '+', '='],
			formula: ''
		};
	}
	public childClick(e: any) {
		
		const item = this.props.arr[e];	   
		console.log(item);
		if (item === '=') {
			console.log('1111');
			// tslint:disable-next-line:no-eval
			alert(eval(this.props.formula));
		} else {
			this.props.formula += item;
		}

	}
}
