/**
 * 
 */
import {Widget} from '../../../widget/widget';

interface Props {
	style:string;
}

export class Clazz extends Widget {
	constructor() {
		super();
		this.props = {
			style:'yellow'
		};
	}
	public attach() {
		setTimeout(() => {
			this.props.style = 'red';
			this.paint();
		}, 3000);
		setTimeout(() => {
			this.props.style = 'blue';
			this.paint();            
		}, 6000);
	}
}
