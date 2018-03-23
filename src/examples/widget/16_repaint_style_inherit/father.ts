/**
 * 
 */
import {Widget} from '../../../widget/widget';

interface Props {
	style:string;
}

export class Father extends Widget {
	public prop:Props;
	constructor() {
		super();
		this.props = {
			style: 'b'
		};
	}
	public attach() {
		setTimeout(() => {
			this.props.style = 'c';
			this.paint();
		}, 3000);
	}
}