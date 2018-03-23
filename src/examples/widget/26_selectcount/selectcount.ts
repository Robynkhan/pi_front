/**
 * 
 */
import { Json } from '../../../lang/type';
import { notify } from '../../../widget/event';
import { Widget } from '../../../widget/widget';

interface Props {
    count: number;
}

export class Count extends Widget {

    public props: Props;
    constructor() {
        super();
        this.props = {
            count: 1
        };
    }

    public changeCount(count: number) {
        this.props.count = count;
        this.paint();

        return true;
    }

} 
