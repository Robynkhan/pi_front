/**
 * 
 */
import { HandlerResult } from '../../../util/event';
import { Forelet } from '../../../widget/forelet';
import { Widget } from '../../../widget/widget';

export const forelet = new Forelet();
forelet.addHandler('ok', (text): HandlerResult => {
	forelet.paint(text);
	
	return HandlerResult.BREAK_OK;
});