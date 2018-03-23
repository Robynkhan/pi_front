/**
 * 
 */
import { Json } from '../../../lang/type';
import { notify } from '../../../widget/event';
import { Widget } from '../../../widget/widget';

interface Props {
	count: number;
	isend: boolean;
}

export class CountDownDemo extends Widget {

	public props: Props;
	constructor() {
		super();
		this.props = {
			count: 1,
			isend: false
		};
	}

	public end() {
		this.props.isend = true;
		this.paint();
	}

} 
