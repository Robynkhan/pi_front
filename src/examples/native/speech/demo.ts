/** 
 * 输入框，要求props为{sign:string|number, text:string, id:string|number}, 注意text要转义引号
 */

// ============================== 导入
import * as reg from '../../../browser/speech_recognition';
import * as syn from '../../../browser/speech_synthesizer';
import * as code from '../../../browser/zxing';
import { Widget } from '../../../widget/widget';

// ============================== 导出
export class Demo extends Widget {

	public start() {
		syn.start('在山的那边海的那边，有一群蓝鲸鱼',(code,msg) => {
			switch (code) {
				case 0:
					alert(`语音合成成功，string = ${msg} code =${code}`);					
					break;
				case 1:
					alert(`语音合成失败，string = ${msg} code =${msg}`);					
					break;
				default:
			}				
		});
	}

	public stop() {
		
		syn.stop();
	}

	public pause() {
		syn.pause();
	}

	public resume() {
		syn.resume();
	}

	// 分界线---------------------------------------

	public lisStart() {
		reg.start((code, msg) => {
			if (code === 0) {
				alert(`语音识别成功，string = ${msg}`);				
			} else {
				alert(`语音识别失败，code = ${code}, message = ${msg}`);				
			}
		});
	}

	public lisStop() {
		reg.stop();
	}

	public lisCancel() {
		reg.cancel();
	}

	public code() {
		code.start((code,msg) => {
			switch (code) {
				case 0:
					alert(`二维码识别成功 = ${msg} code =${code}`);					
					break;
				case 1:
					alert(`二维码识别失败 = ${msg} code =${code}`);					
					break;
				default:
			}		
		});
	}

}
