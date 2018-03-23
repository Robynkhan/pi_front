/**
 * 
 */
import {Widget} from '../../../widget/widget';

interface Props {
	hasChild2:boolean;
}

export class Father extends Widget {
	public props:Props;
	constructor() {
		super();
		this.props = {
			hasChild2:true
		};
	}
	public attach() {
		setTimeout(() => {
			this.props.hasChild2 = false;
			this.paint();
		}, 3000);
	}
}  