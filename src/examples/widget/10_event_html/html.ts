/**
 * 
 */
import {Forelet} from '../../../widget/forelet';
import {Widget} from '../../../widget/widget';

interface Props {
	count:number;
}

export let forelet = new Forelet();
export class Html extends Widget {
	public props:Props;
	constructor() {
		super();
		this.props = {count : 0};
	}
	public onClick(event:any) {
		alert('hey!');
		this.props.count++;
		this.paint();
	}
}

const html = new Html();

class Father {
	public name:string;
	constructor() {
		this.name = 'zx';
	}
	public click() {
		alert('i am father');
	}
}

/* tslint:disable:class-name */
class child extends Father {
	public age:number;
	constructor() {
		super();
		this.age = 12;
	}
	public click() {
		alert('i am child');
	}
}