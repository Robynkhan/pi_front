/**
 * 单连接管理器，提供登录，断点续连，慢请求提示等功能
 */

// ============================== 导入
import { commonjs } from '../lang/mod';
import { now } from '../lang/time';
import { Connect } from '../net/websocket/connect';
import { Handler, HandlerMap, HandlerResult } from '../util/event';
import { callTime } from '../util/task_mgr';
import { Forelet } from '../widget/forelet';

// ============================== 导出
/**
 * @description 枚举连接状态
 */
export enum ConState {
	init = 0,
	opening,
	opened,
	closed
}

/**
 * @description 枚举登录状态
 */
export enum LoginState {
	init = 0,
	logining,
	logined,
	relogining,
	logouting,
	logouted,
	logerror
}

/**
 * @description 导出的forelet
 */
export const forelet = new Forelet();

/**
 * 获取通讯地址
 */
export const getUrl = () => {
	return conUrl;
};

/**
 * 设置通讯地址
 */
export const setUrl = (url: string) => {
	conUrl = url;
};

/**
 * 打开连接
 */
export const open = (callback: Function, errorCallback: Function, timeout?: number) => {
	timeout = timeout || defaultTimeout;
	let lastError;
	// 接收后台推送服务器时间，并设置成服务器时间
	Connect.setNotify((msg) => {
		if (msg.type === 'closed') {
			setConState(ConState.closed);
		} else if (msg.msg) {
			if (msg.msg.type === 'echo_time') {
				localTime = con.getActiveTime();
				serverTime = msg.msg.param.stime;
				pingpong = localTime - msg.msg.param.ctime;
			} else {
				handlerMap.notify(msg.msg.type, [msg.msg.param]);
			}
		}
	});
	ping();
	timeout += now();
	const cfg = { encode: false, isText: (commonjs.flags.os.name === 'Android') && (commonjs.flags.os.version < '4.4.0') };
	const func = (result) => {
		if (result.error) {
			if (now() > timeout) {
				setConState(ConState.closed);

				return callTime(errorCallback, [lastError ? lastError : result], 'open');
			}
			lastError = result;
			setTimeout(() => {
				Connect.open(conUrl, cfg, func, 10000);
			}, 3000);
		} else {
			con = result;
			setConState(ConState.opened);
			con.send({ type: 'app@time', param: { ctime: now() } });
			callTime(callback, [result], 'open');
		}
	};
	Connect.open(conUrl, cfg, func, 10000);
	setConState(ConState.opening);
};

/**
 * 通讯请求
 */
export const request = (msg: any, cb: Function, timeout?: number, force?: boolean) => {
	if (!(conState === ConState.opened && (force || loginState === LoginState.logined))) {
		return waitArray.push({ msg: msg, cb: cb });
	}
	let ref = setTimeout(() => {
		ref = 0;
		slowReq++;
		show();
	}, waitTimeout);
	con.request(msg, (r) => {
		if (r.error) {
			if (conState === ConState.closed) {
				reopen();
			}
		}
		if (ref) {
			clearTimeout(ref);
		} else {
			slowReq--;
			show();
		}
		callTime(cb, [r], 'request');
	}, timeout || defaultTimeout);
};

/**
 * 发送请求
 */
export const send = (msg: any) => {
	con && con.send(msg);
};

/**
 * 登录
 */
// tslint:disable:no-reserved-keywords
export const login = (uid: string, type: number, password: string, cb: Function, timeout?: number) => {
	if (con === null) {
		if (conState !== ConState.init) {
			throw new Error(`login, invalid state: ${conState}`);			
		}

		return open(() => {
			login(uid, type, password, cb, timeout);
		}, (result) => {
			callTime(cb, [result], 'login');
		}, timeout);
	}
	con.request({ type: 'login', param: { type: type, password: password, user: uid } }, (result) => {
		if (result.error) {
			setLoginState(LoginState.logerror);
			result.result = result.error;
			callTime(cb, [result], 'logerror');
		} else {
			setLoginState(LoginState.logined);
			requestWaits();
			user = uid;
			userType = type;
			tempPassword = result.password;
			result.result = 1;
			callTime(cb, [result], 'login');
		}
	}, timeout || defaultTimeout);
	setLoginState(LoginState.logining);
};

/**
 * 登出
 */
export const logout = () => {
	setLoginState(LoginState.logouting);
	request({ type: 'logout' }, (result) => {
		setLoginState(LoginState.logouted);
	}, defaultTimeout);
};

/**
 * 重登录成功或失败的回调
 */
export const setReloginCallback = (cb: Function) => {
	reloginCallback = cb;
};

/**
 * 消息处理器
 */
export const setMsgHandler = (type: string, cb: Function) => {
	handlerMap.add(type, (r) => {
		callTime(cb, [r], 'recv');

		return HandlerResult.OK;
	});
};

/**
 * 获取服务器时间
 */
export const getSeverTime = () => {
	return now() - localTime + serverTime;
};
/**
 * 获取ping的来回时间
 */
export const getPingPongTime = () => {
	return pingpong;
};

/**
 * 获取连接状态
 */
export const getConState = () => {
	return conState;
};

/**
 * 获取登录状态
 */
export const getLoginState = () => {
	return loginState;
};

// ============================== 本地
// 默认的超时时间
const defaultTimeout: number = 10000;

/**
 * 重登录回调
 */
let reloginCallback: Function = null;

/**
 * 消息处理列表
 */
const handlerMap: HandlerMap = new HandlerMap();

/**
 * con表示连接
 */
let con: any = null;

/**
 * 连接状态
 */
let conState: ConState = ConState.init;

/**
 * 登录状态
 */
let loginState: LoginState = LoginState.init;

/**
 * 登录用户信息
 */
let user: string = '';

/**
 * 登录用户类型，为多平台相同用户名做准备
 */
let userType: number = 0;

/**
 * 登录成功后，生成临时密码，在重登陆需要配合使用
 */
let tempPassword: string = '';

// 连接中断时，需要等待连接并登录成功后的请求
const waitArray: any[] = [];

/**
 * 慢请求总数量
 */
let slowReq: number = 0;

// 通讯地址
let conUrl: string = '';

// 通讯等待时间
const waitTimeout = 200;

// 超时关闭链接
const closeTimeout = 30000;

// 心跳时间
const pingTime = 10000;

// 服务器时间
let serverTime = 0;
// 本地时间
let localTime = 0;
// 通讯时间，ping的来回时间
let pingpong = 0;

// 设置连接状态
const setConState = (s: number) => {
	if (conState === s) {
		return;
	}
	conState = s;
	show();
};
// 设置登录状态
const setLoginState = (s: number) => {
	if (loginState === s) {
		return;
	}
	loginState = s;
	show();
};

/**
 * 重新打开连接
 */
const reopen = () => {
	open(() => {
		if (loginState === LoginState.logined || loginState === LoginState.relogining) {
			relogin();
		}
	}, null);
};
/**
 * 重登录
 */
const relogin = () => {
	request({ type: 'relogin', param: { user: user, userType: userType, password: tempPassword } }, (result) => {
		if (result.error) {
			setLoginState(LoginState.logerror);
			reloginCallback && reloginCallback({ type: 'logerror', result: result });
		} else {
			setLoginState(LoginState.logined);
			requestWaits();
			reloginCallback && reloginCallback({ type: 'relogin', result: result });
		}
	}, defaultTimeout);
	setLoginState(LoginState.relogining);
};

/**
 * 将所有等待申请列表全部请求
 */
const requestWaits = () => {
	waitArray.map(elem => request(elem.msg, elem.cb, defaultTimeout));
};

/**
 * 定时器：每隔10s调用一次，发送本地时间
 */
const ping = () => {
	const func = () => {
		if (conState === ConState.closed) {
			reopen();
		} else if (conState === ConState.opened) {
			if (now() > con.getActiveTime() + closeTimeout) {
				con.close();
				setConState(ConState.closed);
				reopen();
			} else {
				con.send({ type: 'app@time', param: { ctime: now() } });
			}
		}
		setTimeout(func, pingTime);
	};
	setTimeout(func, pingTime);
};

/**
 * 绘制
 */
const show = () => {
	forelet.paint({ ping: pingpong, slowReq: slowReq, con: conState, login: loginState });
};
