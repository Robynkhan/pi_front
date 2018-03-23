/**
 * 
 */
import { gen } from '../../../compile/genvdom';
import { parserTpl } from '../../../compile/vdom';
import { compile, toFun } from '../../../util/tpl';
import { Forelet } from '../../../widget/forelet';

const test = [];
// test
// html
let i = 0;
test[i++] = `<div>xxxx</div>`;// k v ,string
// k v ,string
/* tslint:disable:max-line-length */
test[i++] = `<div on-xx = "abc('ba',12)"  w-clazz="bc cd ef" selected style="background:#ffffff;" on-tap="btnClick1" on-ltap="xxxx" on-ltap="xxxx"></div>`;
test[i++] = `<input ab="bc cd ef" gh/>`;// k v ,string
test[i++] = `<meta ab="bc cd ef" gh>`;// k v ,string
test[i++] = `<div ab-c="bc cd ef" gh>
<div ab="bc cd ef" gh>12345</div></div>`;
// test[5] = `
// <div on-xx="abc('ba',12)"  w-clazz="bc cd ef" selected ab="bc cd ef" gh>
	
// </div>`
test[i++] = `
<div on-xx="abc('ba',12)"  w-clazz="bc cd ef" selected ab="bc cd ef" gh>
	;nbsp
	<input ab="bc cd ef" gh/>
	#1235;	
	<meta ab="bc cd ef" gh>
	haha
	<div name="tangmin">
		<div>
			zwx
		</div>
	</div>
</div>`;
// json 
test[i++] = `
{{: it = {"name":"tangmin"} }}
{"ab": "{{it.name}}" }`;// k v ,string
test[i++] = `{"ab":"def", "cd":"123","ef":"null","gh":"true"}`;// k v ,string
test[i++] = `{"ab":"def", "cd":123,"ef":null,"gh":true}`;// k v ,string
// test[8] = `{"abc":def}`;//不支持这种写法
test[i++] = `{"ab":12,  "cd":{"ef":null,"gh":true}, "ef":34}`;// k v ,string
test[i++] = `{"abc":[],"cfg":[]}`;// k v,[]
// 10
test[i++] = `[{"ab":1},{"cd":2}]`;// []
test[i++] = `{"abc":["def", "def", "123", 123, "null", null, "false", false]}`;// k v, []
test[i++] = `{"abc":["def", "def", "123", 123, "null", null, "false", false], "ghi": ["def", "def", "123", 123, "null", null, "false", false]}`;// k v, []
test[i++] = `[{"abc":["def", "def", "123", 123, "null", null, "false", false]}, {"ghi": ["def", "def", "123", 123, "null", null, "false", false]}]`;// []

// js
test[i++] = `{{: window.console.log("xx", 2)}}`;// 执行
test[i++] = `{{let x = (( 3 + 1) * 2) + 2}}
{{: window.console.log(x)}}
`;// 赋值
test[i++] = `{{: it = {"ab":"def", "cd":123,"ef":null,"gh":true} }}
{{: console.log(it)}}
`;
test[i++] = `{{let xx = {"ab":12,  "cd":{"ef":null,"gh":true}, "ef":34} }}
{{: console.log(xx)}}
`;
test[i++] = `{{: it = {"abc":["def", "def", "123", 123, "null", null, "false", false], "ghi": ["def", "def", "123", 123, "null", null, "false", false]} }}
{{: console.log(it)}}
`;

test[i++] = `{{: it = [{"abc":["def", "def", "123", 123, "null", null, "false", false]}, {"ghi": ["def", "def", "123", 123, "null", null, "false", false]}] }}
{{: console.log(it)}}
{{: window.console.log(it[0].abc[4], it[0].abc[5], "haha") }}
`;
// 20 
test[i++] = ` 
{{: it = {"isOK": 1} }}
{{if it.isOK === 1}}
{{: console.log("success")}}
{{end}}
`;// if
test[i++] = `
{{: it = {"isOK": 1} }}
{{if it.isOK === 1}}
{{ it.isOK }}
{{end}}
`;// if

test[i++] = `
{{: it = {"isOK": 1} }}
{{if it.isOK === 1}}
{{ 2+1 }}
{{end}}
`;// if

test[i++] = `
{{: it = {"isOK": 5} }}
{{if it.isOK === 1}}
{{ it.isOK }}
{{else}}
{{: console.log("xxx")}}
{{end}}
`;// if else

test[i++] = `
{{: it = {"isOK": 5} }}
{{if it.isOK === 1}}
{{:console.log("if",it.isOK)}}
{{elseif it.isOK === 2}}
{{:console.log("elseif1", it.isOK)}}
{{elseif it.isOK === 3}}
{{:console.log("elseif2", it.isOK)}}
{{else}}
{{: 1>2}}
{{end}}
`;// else if

test[i++] = `
{{let i =  1}}
{{: i++}}
{{: ++i}}
{{: console.log(i)}}
`;

test[i++] = `
{{: it = {"arr": [1,2,3]} }}
{{for key,value of it.arr}}
{{:console.log(value)}}
{{end}}
`;// for

test[i++] = `
{{: it = {"arr": [1,2,3,4,5,6,7]} }}
{{for key,value of it.arr}}
{{if key === 3}}
{{continue}}
{{elseif key === 5}}
{{break}}
{{else}}
{{:console.log(value)}}
{{end}}
{{end}}
`;// for

test[i++] = `
{{let x = 1}}
{{while x < 8}}
{{: x++}}
{{if x === 3}}
{{continue}}
{{elseif x === 5}}
{{break}}
{{else}}
{{: console.log(x)}}
{{end}}
{{end}}
`;// while

test[i++] = `
{{let myFunc = function (value) {let a = 1;	} }}
`;// function
// 30
test[i++] = `
{{let myFunc = function(value){if(value > 0 ){return 1}else{return 0 } } }}
{{: console.log(myFunc(1)) }}
{{: console.log(myFunc(1,2)) }}
`;// function

test[i++] = `{{: it = new Date}}
{{:console.log(it)}}
{{let a = new Date()}}
{{:console.log(a)}}
`;// exec

test[i++] = `
{{let i = 2}}
{{: console.log((i > 0) ? 1 : 0)}}
`;// exec
// comp
test[i++] =  `
{{: it = {"isOK": true, "size": -1} }}
{{let x = 1}}
{{% 同时}}
{{if it.isOK}}
	<div a="1">@xx dd</div>
{{elseif it.size + 1 > x}}
	<div b>1234</div>
{{else}}
	<input/>
{{end}}
`;

test[i++] = `
{{: it = {"client": "zwx"} }}
<widget id="1" name="tangmin" xxx >{"name":{{it.client}} }</widget>`;

test[i++] = `
{{: it = {"client": "zwx", "cate":"股东投资"} }}
<div ev-btn="equityClick" {{if it.cate.startsWith("股东投资")}} w-clazz="show" {{else}} w-clazz="hide" {{end}}>
	<widget w-tag="app-wgt-com-imgbtn"  w-clazz="itemStyle">{"cfg":{"text":{{it.client}} }, "e":{} }</widget>
</div>`;

test[i++] = `
{{: it = {"client": "zwx", "cate":"股东投资"} }}
<div ev-btn="equityClick" ><widget w-tag="app-wgt-com-imgbtn"  w-clazz="itemStyle">{"cfg":{"text":"{{it.client}}" }, "e":{} }</widget></div>`;

test[i++] = `
{{: it = {"client": "zwx", "cate":"股东投资"} }}
<div ev-btn="equityClick" {{if it.cate.startsWith("股东投资")}} w-clazz="show" {{else}} w-clazz="hide" {{end}}>
</div>`;

test[i++] = `
{{: it = {"client": "zwx", "cate":"股东投资"} }}
<div {{if it.cate.startsWith("股东投资")}} class="ab bc" {{else}} checked {{end}}></div>`;
test[i++] = `
{{: it = {"client": "zwx", "cate":"股东投资"} }}
<div class={{if it.cate.startsWith("股东投资")}}"ab bc"{{else}}"cd"{{end}}></div>`;
// 40
test[i++] = `
{{: it = {"client": "zwx", "cate":"股东投资"} }}
<div class="ab {{if it.cate.startsWith("股东投资")}} cd {{else}} ef {{end}}"></div>`;

// test[i++] = `
// {{: it = {"date":"2017-01-01", "canClick":true} }}
// <div class="full_screen" ev-page-head-left="returnFunc">    
//     <div style="margin-top: 72px;height: 180px;" class="ch_boxShadow ch_cardPartStyle">
//         <div class="ch_flex" style="font-size: 18px;padding-top: 24px;padding-bottom: 12px;">
//             <div class="ch_flexChild" style="margin-left: 4%;height: 42px;line-height: 42px;">确认结账</div>
//             <div style="text-align: center;" class="ch_flexChild">
//                 <div style="background-color: #64c0eb; height: 42px;line-height: 42px;width: 140px;border-radius: 24px;color: white;font-size: 15px;">{{it.date}}</div>
//             </div>
//         </div>
//         <div class="ch_flex" style="font-size: 18px;padding-top: 24px;line-height: 42px;">
//             <div class="ch_flexChild" style="margin-left: 4%;">是否结账？</div>
//             <div style="text-align: center;color: #64c0eb;text-align: center;" class="ch_flexChild"> 
//                 <div on-tap="checkoutClick" style="font-size: 22px;display: inline;text-align: left;{{if it.canClick}} pointer-events:visible;color:#64c0eb; {{else}} pointer-events:none;color:grey; {{end}}"  class = "iconfont" >&#xe638;<span style="color: #333;margin-left: 8%;">确定</span></div>
//             </div>
//         </div>
//     </div>
//     <widget w-tag="app-wgt-com-head">{"title":"结账", "visibleRight":"hidden"}</widget>
//     <div class="help1" on-tap="helpPop" >?</div>    
// </div> 
// `;

test[i++] = `<widget w-tag="child$">{"child":"tangmin{{it.name.replace('aaa','bbb')}}"}</widget>`;

test[i++] = `
{{: it = {"show":true} }}
{{if !it.show }}
{{: window.console.log("false")}}
{{else}}
{{: window.console.log("true")}}
{{end}}
`;
test[i++] = `
{{: it = {"weapon":true} }}
{{let test = null }}
{{if it.weapon}}
{{: test = 1 }}
{{else}}
{{: test = [ {"type" : "Skeleton","res" : "xxx" } ] }}
{{end}}`;

test[i++] = `
{{: it={"name":"zwx"} }}
{{let bip=[{"type":"Skeleton","res":it.name }]}}
{{: window.console.log(bip)}}
`;	

export const forelet = new Forelet();

forelet.addHandler('click', () => {
	// for(let i = 0; i< test.length; i++){
	// 	console.log(i);
	// 	console.log(parserTpl(test[i]));
	// }
	
	const t = test[test.length - 1];
	alert(t);
	const syntax = parserTpl(t);
	console.log(syntax);
	const domStr = gen(syntax);
	const func = toFun(domStr, '');
	console.log(func());
	
	return 0;
});
