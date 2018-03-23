/**
 * 
 */
import {Widget} from '../../../widget/widget';

interface Props {
    style:string;
}

export class Grand extends Widget {
    constructor() {
        super();
        this.props = {
            style: 'b'
        };
    }
}  