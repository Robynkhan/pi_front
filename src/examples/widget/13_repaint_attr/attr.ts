/**
 * 
 */
import {Widget} from '../../../widget/widget';

interface Props {
	id:string;
	name:string;
}

export class Attr extends Widget {
	constructor() {
		super();
		this.props = {
			id:'1',
			name:'tangmin'
		};
	}
	public attach() {
		setTimeout(() => {
			this.props.id = '2';
			this.paint();
		}, 3000);
	}
}
