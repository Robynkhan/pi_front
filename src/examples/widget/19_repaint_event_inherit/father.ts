/**
 * 
 */
import { notify } from '../../../widget/event';
import { Widget } from '../../../widget/widget';

interface Props {
    clickFunc: string;
}

export class Father extends Widget {
    public props: Props;
    constructor() {
        super();
        this.props = {
            clickFunc: 'click1'
        };
    }
    public click1(event: any) {
        alert('i am click1 from father');
        this.props.clickFunc = 'click2';
        this.paint();
    }
    public click2(event: any) {
        alert('i am click2 from father');
    }
}  