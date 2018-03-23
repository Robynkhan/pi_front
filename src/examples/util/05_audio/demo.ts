/** 
 * 
 */
/* tslint:disable:no-reserved-keywords */
declare var module: any;

import { Forelet } from '../../../widget/forelet';

import { butil } from '../../../lang/mod';
import { Mgr } from '../../../util/sound';

export const mgr = new Mgr();

export const forelet = new Forelet();
(forelet as any).click = (): void => {
	console.log('play', mgr);
	mgr.volume = 0.2;
	mgr.timeout = 30000;
	mgr.play(butil.relativePath('./6_3117_72.mp3', module.info.path), 2, 2, 4);
	setTimeout(() => {mgr.stop();}, 4000);
};