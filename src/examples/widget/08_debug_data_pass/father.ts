/**
 * 
 */
import {Widget} from '../../../widget/widget';

interface Props {
	begindate:string;
	stopdate:string;
}

export class Father extends Widget {
	public props: Props;
	constructor() {
		super();
		this.props = {
			begindate: '2017-12-4',
			stopdate: '2017-12-8'
		};
	}
	public attch() {
		const d =  new Date();
		this.props.stopdate =  `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;        
	}
}  