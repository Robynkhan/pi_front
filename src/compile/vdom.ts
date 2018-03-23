/**
 * tpl的词法和语法分析器
 */
import { createRuleReader } from '../compile/ebnf';
import { Parser } from '../compile/parser';
import { createByStr } from '../compile/reader';
import { Scanner } from '../compile/scanner';
import * as match from '../util/hash';

// TEXT 文本状态 0
// 文本态无法直接切换到htmlAttr和htmlstr态,只能切换到另外3个状态

// 测试初始化
export const parserTpl = (tpl, filename?:string, errFunc?:any) => {	
	const reader = createByStr(tpl);
	const scanner = new Scanner();
	scanner.setRule(lexText, '0');
	scanner.setRule(lexScript, '1');
	scanner.setRule(lexHtml, '2');
	scanner.setRule(lexAttr, '3');
	scanner.setRule(lexStr, '4');
	scanner.setRule(lexStrSingle, '5');	
	scanner.setRule(lexJson, '10');
	scanner.initReader(reader);
	const parser = new Parser();
	parser.setRule(syntaxTpl, cfgTpl);
	parser.initScanner(scanner);
	const syntax = parser.parseRule('body');
	if (parser.cur) {
		console.log(
			`\x1b[31m error: "${filename}"解析出错,lastIndex is : ${parser.lastIndex}, lastMatch is : ${JSON.stringify(parser.lastMatch)}\x1b[0m`);
		if (errFunc) {
			errFunc(` error: "${filename}"解析出错,lastIndex is : ${parser.lastIndex}, lastMatch is : ${JSON.stringify(parser.lastMatch)}`);
		}
	}

	return syntax;
};
const lexText = `
	(* comment *)
	commentBlock = "{{%" , [ { & !"}}"!, ?all? & } ], "}}" ;
	(* 切换到脚本态 *)
	"{{" = "{{";
	(* 切换到json态,只有在tpl中向下传递数据才会出现json态 *)
	"{" = "{";
	(* 切换到json态,只有在tpl中向下传递数据才会出现json态, 数组是json的特殊存在形式 *)
	"[" = "[";
	(* 切换到tpl态 *)
	"<" = "<";
	text = [{ & ! | "<", "{", "[" | !, ?all? & }] ;	
`;

// JS 脚本状态 1
const lexScript = `
	whitespace = {?whitespace?}#?;	

	(* 特殊的函数声明 *)

	(* back *)	
	"}}" = "}}";

	(* separator *)
	"," = ",";
	"." = ".";
	";" = ";";
	":" = ":";
	"{" = "{";
	"}" = "}";
	"(" = "(";
	")" = ")";
	"[" = "[";
	"]" = "]";

	(* type keyword *)
	true = & "true", identifier &;
	false = & "false", identifier &;
	null = & "null", identifier &;
	undefined = & "undefined", identifier &;
	(* keyword *)
	if = & "if", identifier &;
	elseif = & "elseif", identifier &;
	else = & "else", identifier &;
	end = & "end", identifier &;
	for = & "for", identifier &;
	while = & "while", identifier &;
	let = & "let", identifier &;
	var = & "var", identifier &;
	switch = & "switch", identifier &;
	try = & "try", identifier &;
	catch = & "catch", identifier &;
	finally = & "finally", identifier &;
	case = & "case", identifier &;
	default = & "default", identifier &;
	return = & "return", identifier &;
	
	
	new = & "new", identifier &;
	function =  & "function", identifier &;
	
	break = & "break", identifier &;
	continue = & "continue", identifier &;
	of = & "of", identifier &;
	in = & "in", identifier &;

	(* normal *)
	identifier = [{"_"}], ?alphabetic? , [ { |?word?, "$"| } ] ;
	float = [| "0", integer10 |], ".", { ? digit ? }, [floate] ;
	floate = |"e", "E"|, |"+", "-"|, { ? digit ? } ;
	integer16 = "0x" , { |? digit ?, 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f' | } ;
	integer = | "0", integer10 | ;
	integer10 = ? digit19 ? , [ { ? digit ? } ] ;
	regular = "/",{& !"/"!, !"}}"!, !" "!, ?visible? &},|"/gi", "/ig", "/g", "/i", "/"|;
	(* 脚本态内部肯定是普通字符串 *)
	string = '"', [{ | '\\"', & !'"'!, ?visible? & | }], '"' ;
	singlequotestring = "'", [{ | "\\'", & !"'"!, ?visible? & | }], "'" ;

	(* compare operator *)
	"===" = "===";
	"!==" = "!==";
	"==" = "==";
	"!=" = "!=";
	"<=" = "<=";
	">=" = ">=";
	(* assignment operator *)
	"=" = "=";
	"+=" = "+=";
	"-=" = "-=";
	"*=" = "*=";
	"/=" = "/=";
	"%=" = "%=";
	"<<=" = "<<=";
	">>=" = ">>=";
	">>>=" = ">>>=";
	"&=" = "&=";
	"|=" = "|=";
	"^=" = "^=";
	(* arithmetic operator *)
	"++" = "++";
	"--" = "--";
	"**" = "**";
	"+" = "+";
	"-" = "-";
	"*" = "*";
	"/" = "/";
	"%" = "%";
	(* bool operator *)
	"&&" = "&&";
	"||" = "||";
	"!" = "!";
	(* bit operator *)
	"&" = "&";
	"|" = "|";
	"~" = "~";
	"^" = "^";
	">>>" = ">>>";
	"<<" = "<<";
	">>" = ">>";
	(* compare operator *)
	"<" = "<";
	">" = ">";
	(* condition operator *)
	"?" = "?";
`;

// HTML状态 2 因为attr是特殊的状态，所以 >和/>应该在htmlAttr中
const lexHtml = `
	whitespace = {?whitespace?}#?;
	(* normal *)
	img = & "img", identifier &;
	input = & "input", identifier &;
	meta = & "meta", identifier &;
	identifier = ["_"], ?alphabetic? , [ { |?word?, "-", "$"| } ] ;
	close = "/", identifier, ">";	
	(* separator *)	
`;
// HTMLattr状态 3
// 这个版本要求value必须是字符串
const lexAttr = `
	whitespace = {?whitespace?}#?;
	"/>" = "/>";
	">" = ">";
	(*因为属性可以直接跳转到脚本 *)
	"{{" = "{{";
	(* normal *)
	identifier = ["_"], ?alphabetic? , [ { |?word?, "-", "$"| } ] ;	
	(* separator *)
	"=" = "=";	
	"quota" = '"';	
	"singlequota" = "'";
`;
// htmlstr状态 4,单指html attr中的字符串，脚本和JSON中的字符串不包含在这种状态之中
const lexStr = `
	(* comment *)
	
	commentBlock = "{{%" , [ { & !"}}"!, ?all? & } ], "}}" ;
	"{{" = "{{";		
	lstring =  [{ | '\\"', & !'"'!, !'{{'!, !'>'!, !'/>'!, ?visible? & | }];
`;
const lexStrSingle = `
(* comment *)
	
commentBlock = "{{%" , [ { & !"}}"!, ?all? & } ], "}}" ;
"{{" = "{{";		
singlelstring =  [{ | "\\'", & !"'"!, !"{{"!, !">"!, !"/>"!, ?visible? & | }];
`;

// json状态 10
const lexJson = `
whitespace = {?whitespace?}#?;

(* separator *)
"{{" = "{{";
"," = ",";
":" = ":";
"{" = "{";
"}" = "}";
"[" = "[";
"]" = "]";
"quota" = '"';	


(* normal 只支持双引号 *)
(* 基础的数据就只有 这5种*)
number = |  integer16, float, integer | ;
bool = | true , false |;
null = & "null", identifier &;
undefined = & "undefined", identifier &;

true = & "true", identifier &;
false = & "false", identifier &;
float = [[ "-" ] , | "0", integer10 |], ".", { ? digit ? }, [floate] ;
floate = |"e", "E"|, |"+", "-"|, { ? digit ? } ;
integer16 = [ "-" ] , "0x" , { |? digit ?, 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f' | } ;
integer = | "0", integer10 | ;
integer10 = [ "-" ] , ? digit19 ? , [ { ? digit ? } ] ;
identifier = [{"_"}], ?alphabetic? , [ { |?word?, "$"| } ] ;
`;

// 状态 0:text 1:js 2:html 3:htmlAttr 4:htmlAttrStr 10: json 
// 语法
// j代表json,s代表script

// body = [{|"text", script, jobj, jarr, html, attr, attrStr, "lstring" |}];删除了lstring,如果不对再加回去
/* tslint:disable:max-line-length */
const syntaxTpl = `
	script = "{{"#?1, | if, for, while, exec,  def,  jsbreak, jscontinue, jsexpr|;
	html = "<"#?2, | el |;
	jobj = "{"#?10,  [|jpair,script|], [{[","#?], |jpair,script|}], "}"#?back ;
	jarr = "["#?10, [|jstr,"number","bool","null", jobj, jarr, script|, [{","#?, |jstr,"number","bool","null", jobj, jarr, script|}]], "]"#?back;
	jpair = |"identifier", jstr|, ":"#?, |jstr, "number","bool","null", jobj, jarr, script, jscript|;
	jstr = "quota"#?4, "lstring"#back, "quota"#?;
	jscript = "quota"#?4, ["lstring"], script, [{["lstring"],script}], "lstring"#back, "quota"#?;
	exec = ":"#?, ?expr?, [{",",?expr?}], "}}"#?back;
	value = |"string", "identifier"|;
	attrs = [{|attr, script|}];
	attr = "identifier", ["="#?, |"identifier", attrStr,  attrscript, singleattrStr,singleattrscript, script|];
	attrStr = "quota"#?4, "lstring"#back, "quota"#?;
	singleattrStr = "singlequota"#?5, "singlelstring"#back, "singlequota"#?;
	attrscript = "quota"#?4, ["lstring"], script, [{["lstring"],script}], "lstring"#back, "quota"#?;
	singleattrscript = "singlequota"#?5, ["singlelstring"], script, [{"singlelstring",script}], "singlelstring"#back, "singlequota"#?;
	el = | inputtag, imgtag, metatag, tag|;	
	imgtag = "img"#?3, attrs, "/>"#?0;
	inputtag = "input"#?3, attrs, "/>"#?0;
	metatag = "meta"#?3, attrs, ">"#?0;
	tag = "identifier"#3, attrs, ">"#?0, body, "<"#?2, "close"#?back;

	if = "if"#?, ?expr?, "}}"#?back, body, [{elseif}], [else], "{{"#?1, "end"#?, "}}"#?back;
	elseif = "{{"#?1, "elseif"#?, ?expr?, "}}"#?back, body;
	else = "{{"#?1, "else"#?, "}}"#?back, body;
	body = [{|"text", script, jobj, jarr, html, attr, attrStr, "lstring", "singlelstring"|}];

	cond = ?expr?, ":"#?, ?expr?;
	field = "identifier";
	fielde = ?expr?, "]"#?;
	bracket = ?expr?, ")"#?;
	call = [?expr?, [{","#?, ?expr?}]], ")"#?;
	new = "identifier", ["("#?, [?expr?, [{","#?, ?expr?}]], ")"#?];
	arr = [?expr?, [{","#?, ?expr?}]], "]"#?;
	kv = |"identifier", "string"|, ":"#?, ?expr?;
	obj = [kv, [{","#?, kv}]], "}"#?;	

	
	while = "while"#?, ?expr?, "}}"#?back, body,"{{"#?1, "end"#?, "}}"#?back;
	for = "for"#?, "identifier", [","#? , "identifier"], |"of", "in"|, ?expr?, "}}"#?back, , body,"{{"#?1, "end"#?, "}}"#?back;
	dv = "identifier", ["="#?, ?expr?];
	def = "let"#?, [dv, [{","#?, dv}]], "}}"#?back;
	(*只支持了一条命令 *)
	jsexpr = & ! | "break", "continue", "end", "else", "elseif"| ! ,?expr? &, "}}"#?back;
	jsbreak = "break","}}"#?back;
	jscontinue = "continue","}}"#?back;
	exprgroup = [?expr?, [{","#?, ?expr?}]];

	(* js 特有部分*)
	jsfn = "("#?, jsfnargs, ")"#?, jsblock;
	jsfnargs = ["identifier", [{","#?, "identifier"}]];
	jsblock = "{"#?, [{?expr?, [";"#?]}], "}"#?;
	jsbody = | @"{"#?, [{?expr?, [";"#?]}], "}"#?@, @?expr?, [";"#?]@ |;
	jsif = "("#?, ?expr?, ")"#?, jsbody, [{jselseif}], [jselse];
	jselseif = "else"#?, "if"#?, "("#?, ?expr?, ")"#?, jsbody;
	jselse = "else"#?, jsbody;
	jswhile = "("#?, ?expr?, ")"#?, jsbody;
	jsfor = "("#?, exprgroup, ";"#?, exprgroup, ";"#?, exprgroup, ")"#?, jsbody;
	jsswitch = "("#?, ?expr?, ")"#?, "{"#?, {jscase}, [jsdefault], "}"#?;
	jscase = "case"#?, | "integer", "integer16", "float", "string" |, ":"#?, [{?expr?, ";"#?}];
	jsdefault = "default"#?, ":"#?, [{?expr?, ";"#?}];
	jstry = jsblock, [jscatch], [jsfinally];
	jscatch = "catch"#?, "("#?, "identifier", ")"#?, jsblock;
	jsfinally = "finally"#?, jsblock;
	jsdef = [dv, [{","#?, dv}]];
	jsreturn = [{?expr?}];
`;
// attr = "identifier", ["="?, |scriptvalue, tagscript2, value|];
// scriptvalue = "lstring", tagscript2, "rstring";
const cfgTpl = [
	// 表达式结束符
	{type: ',', rbp: -1},
	{type: ';', rbp: -1},
	{type: ')', rbp: -1},
	{type: ']', rbp: -1},
	{type: '}', rbp: -1},
	{type: '}}', rbp: -1},
	// 最低优先级运算符
	{type: 'string'},

	// 赋值运算符
	{type: '=', lbp: 10, rbp:9},
	{type: '+=', lbp: 10, rbp:9},
	{type: '-=', lbp: 10, rbp:9},
	{type: '*=', lbp: 10, rbp:9},
	{type: '/=', lbp: 10, rbp:9},
	{type: '%=', lbp: 10, rbp:9},
	{type: '<<=', lbp: 10, rbp:9},
	{type: '>>=', lbp: 10, rbp:9},
	{type: '>>>=', lbp: 10, rbp:9},
	{type: '&=', lbp: 10, rbp:9},
	{type: '|=', lbp: 10, rbp:9},
	{type: '^=', lbp: 10, rbp:9},
	// 条件运算符
	{type: '?', lbp: 20, rbp:19, led:'cond'},
	// 关系运算符
	{type: '||', lbp: 30, rbp:29}, // 短路逻辑运算符需要右结合，通过减少右约束力来实现的
	{type: '&&', lbp: 32, rbp:31},
	{type: '|', lbp: 35},
	{type: '^', lbp: 36},
	{type: '&', lbp: 37},
	// 布尔运算符
	{type: '===', lbp: 40},
	{type: '!==', lbp: 40},
	{type: '==', lbp: 40},
	{type: '!=', lbp: 40},
	{type: '<=', lbp: 45},
	{type: '>=', lbp: 45},
	{type: '<', lbp: 45},
	{type: '>', lbp: 45},
	{type: 'in', lbp: 45},
	{type: 'instanceof', lbp: 45},
	// 按位移动符
	{type: '<<', lbp: 50},
	{type: '>>', lbp: 50},
	{type: '>>>', lbp: 50},
	// 算数运算符
	{type: '+', lbp: 60},
	{type: '-', lbp: 60},
	{type: '*', lbp: 70},
	{type: '/', lbp: 70},
	{type: '%', lbp: 70},
	{type: '**', lbp: 70},

	// 前缀运算符
	{type: '!', rbp: 80 },
	{type: '~', rbp: 80 },
	{type: '+', rbp: 80 },
	{type: '-', rbp: 80 },
	{type: '++', rbp: 80 },
	{type: '--', rbp: 80 },
	{type: 'typeof', rbp: 80 },
	{type: 'void', rbp: 80 },
	{type: 'delete', rbp: 80 },

	// 后缀运算符
	{type: '++', lbp: 85, suf:true },
	{type: '--', lbp: 85, suf:true },

	// 域运算符
	{type: '.', lbp: 100, led:'field'},
	{type: '[', lbp: 100, led:'fielde'},

	// 函数调用
	{type: '(', rbp:90, led:'call'},
	{type: 'new', rbp:90, led:'new'},

	// 算数表达式
	{type: '(', lbp: 1000, nud:'bracket'},

	// 对象字面量
	{type: '{', nud:'obj'},
	{type: '[', nud:'arr'},
	
	// statement 语句
	{type: 'let', nud:'jsdef'},
	{type: 'var', nud:'jsdef'},
	{type: 'if', nud:'jsif'},
	{type: 'for', nud:'jsfor'},
	{type: 'while', nud:'jswhile'},
	{type: 'switch', nud:'jsswitch'},
	{type: 'try', nud:'jstry'},
	{type: 'function', nud:'jsfn'},
	{type: 'dv', nud:'dv'},
	{type: 'return', nud:'jsreturn'},
	
	// 忽略空白
	{type: 'whitespace', ignore : true},
	// 注释
	{type: 'commentBlock', note : 1}
];

// expr  +  expr  -  expr  *  expr  /   
