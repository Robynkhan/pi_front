'use strict';
// 依赖表加载成功后的回调函数
winit.initNext = function() {
	var win = winit.win;
	win._babelPolyfill = 1;
	win.pi_modules = 1;
	win.Map = 1;
	var startTime = winit.startTime;
	console.log("init time:", Date.now() - startTime);
	// 清除运营商注入的代码
	var clear = function() {
		//清除window上新增的对象
		var k;
		for(k in window){
			if(window.hasOwnProperty(k) && !win[k])
				window[k] = null;
		}
		//清除body里面的非pi元素（自己添加的元素都有pi属性）
		var i, arr = document.body.children;
		for(i = arr.length - 1; i >= 0; i--) {
			k = arr[i];
			if(!k.getAttribute("pi"))
				document.body.removeChild(k);
		}
	};
	//clear();
	pi_modules.depend.exports.init(winit.deps, winit.path);
	var flags = winit.flags;
	winit = undefined;//一定要立即释放，保证不会重复执行
	var div = document.createElement('div');
	div.setAttribute("pi", "1");
	div.setAttribute("style", "position:absolute;bottom:10px;left: 2%;width: 95%;height: 10px;background: #262626;padding: 1px;border-radius: 20px;border-top: 1px solid #000;border-bottom: 1px solid #7992a8;");
	var divProcess = document.createElement('div');
	divProcess.setAttribute("style", "width: 0%;height: 100%;background-color: rgb(162, 131, 39);border-radius: 20px;");
	div.appendChild(divProcess);
	document.body.appendChild(div);
	var modProcess = pi_modules.commonjs.exports.getProcess();
	var dirProcess = pi_modules.commonjs.exports.getProcess();
	modProcess.show(function(r){
		modProcess.value = r*0.2;
		divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});
	dirProcess.show(function(r){
		dirProcess.value = r*0.8;
		divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});
	pi_modules.commonjs.exports.require(["util/html", "widget/util"], {}, function(mods, fm) {
		console.log("first mods time:", Date.now() - startTime, mods, Date.now());
		var html = mods[0], util = mods[1];
		// 判断是否第一次进入,决定是显示片头界面还是开始界面
		var userinfo = html.getCookie("userinfo");
		pi_modules.commonjs.exports.flags = html.userAgent(flags);
		flags.userinfo = userinfo;
		html.checkWebpFeature(function(r) {
		flags.webp = flags.webp || r;
		// 加载基础及初始目录，显示加载目录的进度动画
		
		/** 新人注意：需要在这里加载项目需要的文件 */
		util.loadDir(["tutorial/todomvc/widget/", "worker/", "ui/", "util/", "widget/"], flags, fm, undefined, function(fileMap) {
			console.log("first load dir time:", Date.now() - startTime, fileMap, Date.now());
			var tab = util.loadCssRes(fileMap);
			// 将预加载的资源缓冲90秒，释放
			tab.timeout = 90000;
			tab.release();
			//clear();
			console.log("res time:", Date.now() - startTime);
			// 启动计算线程
			var worker = pi_modules.commonjs.exports.relativeGet("worker/client").exports;
			worker.create("calc", 2, ["util/img"], fm);
			worker.request("calc", "util/hash", "calcHashTime", ["asdf", 1000], undefined, 900, 0, function (r) {
				console.log("calc hash count per ms: "+ (r.count/r.time | 0));
			}, function(err) {
				console.log(err);
			});
			// 加载根组件
			var root = pi_modules.commonjs.exports.relativeGet("ui/root").exports;
			root.cfg.full = true;//PC模式
			util.addWidget(document.body, "ui-root");
			
			/** 新人注意: 打开组件*/
			var w = root.open("tutorial-todomvc-widget-todo");
			// 删除加载进度条
			document.body.removeChild(div);
		}, function(r){
			alert("加载目录失败, "+r.error + ":" + r.reason);
		}, dirProcess.handler);
		});
	}, function(result){
		alert("加载基础模块失败, "+result.error + ":" + result.reason);
	}, modProcess.handler);
};

// 初始化开始
(winit.init = function () {
	if(!winit) return;
	winit.deps && self.pi_modules && self.pi_modules.butil && self._babelPolyfill && winit.initNext();
	(!self._babelPolyfill) && setTimeout(winit.init, 100);
})();
