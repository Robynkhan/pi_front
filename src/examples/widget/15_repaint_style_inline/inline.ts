/**
 * 
 */
import {Widget} from '../../../widget/widget';

interface Props {
	style:string;
}

export class Inline extends Widget {
	constructor() {
		super();
		this.props = {
			style:'background-color : yellow ; font-size : 20px ; ' 
		};
	}
}  