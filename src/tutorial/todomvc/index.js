'use strict';
document.body.style.backgroundColor = "#2F2F2F";
winit.path = "/dst/"; //"/pi/0.1/";

/** 新人注意：这里的路径要正确修改 */
winit.loadJS(winit.domains, "/dst/boot/init.js?" + '111', "utf8", winit.initFail, "load init error");
winit.loadJS(winit.domains, "/dst/tutorial/todomvc/next.js?" + '222', "utf8", winit.initFail, "load next error");
winit.loadJS(winit.domains, winit.path + ".depend?" + Math.random(), "utf8", winit.initFail, "load list error");

/** 新人注意：在正式发布时，不用调试代码时，需要打开下面的注释，这样加载会快很多 */
// winit.debug = false;