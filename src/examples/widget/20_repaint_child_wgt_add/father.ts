/**
 * 
 */
import { Widget } from '../../../widget/widget';

interface Props {
	hasChild2: boolean;
	hasChild: string;
}

export class Father extends Widget {
	public props: Props;
	constructor() {
		super();
		this.props = {
			hasChild2: false,
			hasChild: '1111'
		};
	}
	public attach() {
		setTimeout(() => {
			this.props.hasChild2 = true;
			this.paint();
		}, 3000);
	}
	public inputClick(e: any) {
		this.props.hasChild = e.fixedValue;
		this.paint();
		console.log(this.props.hasChild);
	}
}   
