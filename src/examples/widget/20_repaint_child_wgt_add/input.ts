/**
 * 本质上是专门给备注使用的输入框
 */
// ======================================= 导入
import {notify} from '../../../widget/event';
import {Widget} from '../../../widget/widget';

// ======================================= 导出
export class Input extends Widget {
    public props:Props;
    public create() {
        super.create();
        /* tslint:disable:no-object-literal-type-assertion */
        this.props = {} as Props;
        this.props.defaultText = '';
    }
    public getInput(event:any) {
        event.fixedValue = event.currentTarget.value;
        notify(event.node, 'ev-input', {fixedValue:event.fixedValue, fixedEvent:event});
    }
}

// ======================================= 本地
interface Props {
    defaultText:string;
}