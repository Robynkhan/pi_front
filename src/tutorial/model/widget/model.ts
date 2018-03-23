/**
 * 
 */
import { notify } from '../../../widget/event';
import { getRealNode } from '../../../widget/painter';
import { Widget } from '../../../widget/widget';

interface ModelData {
	show: boolean;
}
export class Tree extends Widget {
	public props: ModelData; 
	public create() {
		this.props = {
			show: false
		};
	}

	public showModel() {
		this.props.show = true;
		this.paint();
	}

	public closeModel() {
		this.props.show = false;
		this.paint();
	}
}
