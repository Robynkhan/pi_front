/**
 * 
 */
import { createRuleReader } from '../../../compile/ebnf';
import { Parser } from '../../../compile/parser';
import { createByStr } from '../../../compile/reader';
import { Scanner } from '../../../compile/scanner';
import { Forelet } from '../../../widget/forelet';
import { Widget } from '../../../widget/widget';

const lex = `

	whitespace = {?whitespace?}?;
	(* comment *)
	commentLineOuter = "///" , [{?notbreakline?}] ;
	commentLineInner = "//!" , [{?notbreakline?}] ;
	commentLine = "//" , [{?notbreakline?}] ;
	commentBlockOuter = "/**" , [ { & !"*/"!, ?all? & } ], "*/" ;
	commentBlockInner = "/*!" , [ { & !"*/"!, ?all? & } ], "*/" ;
	commentBlock = "/*" , [ { & !"*/"!, ?all? & } ], "*/" ;


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
	bool = & "bool", identifier &;
	true = & "true", identifier &;
	false = & "false", identifier &;
	char = & "char", identifier &;
	i8 = & "i8", identifier &;
	i16 = & "i16", identifier &;
	i32 = & "i32", identifier &;
	i64 = & "i64", identifier &;
	u8 = & "u8", identifier &;
	u16 = & "u16", identifier &;
	u32 = & "u32", identifier &;
	u64 = & "u64", identifier &;
	isize = & "isize", identifier &;
	usize = & "usize", identifier &;
	f32 = & "f32", identifier &;
	f64 = & "f64", identifier &;
	isize = & "isize", identifier &;
	usize = & "usize", identifier &;
	(* keyword *)
	if = & "if", identifier &;
	else = & "else", identifier &;
	for = & "for", identifier &;
	while = & "while", identifier &;
	loop = & "loop", identifier &;
	for = & "for", identifier &;
	match = & "match", identifier &;
	let = & "let", identifier &;
	mut = & "mut", identifier &;
	fn = & "fn", identifier &;
	type = & "type", identifier &;
	new = & "new", identifier &;
	break = & "break", identifier &;
	continue = & "continue", identifier &;
	return = & "return", identifier &;
	const = & "const", identifier &;
	use = & "use", identifier &;
	enum = & "enum", identifier &;

	(*other only js *)
	switch = & "switch", identifier &;
	case = & "case", identifier &;
	default = & "default", identifier &;
	try = & "try", identifier &;
	catch = & "catch", identifier &;
	finally = & "finally", identifier &;
	instanceof = & "instanceof", identifier &;

	(* normal *)
	identifier = ?alphabetic? , [ { ? word ? } ] ;
	float = [integer], ".", { ? digit ? }, [floate] ;
	floate = "e", |"+", "-"|, { ? digit ? } ;
	integer16 = [ "-" ] , "0x" , { |? digit ?, 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f' | } ;
	integer = | "0", integer10 | ;
	integer10 = [ "-" ] , ? digit19 ? , [ { ? digit ? } ] ;
	string = '"', { | '\\"', & !'"'!, ?visible? & | }, '"' ;

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

const syntax = `
	cond = ?expr?, ":"?, ?expr?;
	field = "identifier";
	fielde = ?expr?, "]"?;
	bracket = ?expr?, ")"?;
	call = [?expr?, [{","?, ?expr?}]], ")"?;
	new = "identifier", ["("?, [?expr?, [{","?, ?expr?}]], ")"?];
	arr = [?expr?, [{","?, ?expr?}]], "]"?;
	kv = "identifier", ":"?, ?expr?;
	obj = [kv, [{","?, kv}]], "}"?;
	dv = "identifier", ["="?, ?expr?];
	def = [dv, [{","?, dv}]];
	fnargs = ["identifier", [{","?, "identifier"}]];
	stmt = ?expr?, ";"?;
	block = "{"?, [{?expr?, ";"?}], "}"?;
	body = | @"{"?, [{?expr?, ";"?}], "}"?@, @?expr?, ";"?@ |;
	fn = "("?, fnargs, ")"?, body;
	if = "if"?, "("?, ?expr?, ")"?, body, [{elseif}], [else];
	elseif = "else"?, "if"?, "("?, ?expr?, ")"?, body;
	else = "else"?, body;
	while = "("?, ?expr?, ")"?, body;
	for = "("?, ?expr?, ","?, ?expr?, ","?, ?expr?, ")"?, body;
	switch = "("?, ?expr?, ")"?, "{"?, {case}, [default], "}"?;
	case = "case"?, | "integer", "integer16", "float", "string" |, ":"?, [{?expr?, ";"?}];
	default = "default"?, ":"?, [{?expr?, ";"?}];
	try = block, [catch], [finally];
	catch = "catch"?, "("?, "identifier", ")"?, block;
	finally = "finally"?, block;

`;

const cfgs = [
	// 表达式结束符
	{type: ',', rbp: -1},
	{type: ';', rbp: -1},
	{type: ')', rbp: -1},
	{type: ']', rbp: -1},
	{type: '}', rbp: -1},
	// 最低优先级运算符
	{type: 'string'},

	// 返回运算符
	{type: 'return', rbp:1},
	{type: 'throw', rbp:1},

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
	{type: '++', lbp: 85 },
	{type: '--', lbp: 85 },

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

	// 函数定义
	{type: 'fn', nud:'fn'},

	// statement 语句
	{type: 'let', nud:'def'},
	{type: 'var', nud:'def'},
	{type: 'if', nud:'if'},
	{type: 'for', nud:'for'},
	{type: 'while', nud:'while'},
	{type: 'switch', nud:'switch'},
	{type: 'try', nud:'try'},

	// 忽略空白
	{type: 'whitespace', ignore : true},
	// 注释
	{type: 'commentBlockOuter', comment : 1},
	{type: 'commentBlockInner', comment : 1},
	{type: 'commentBlock', comment : 1},
	{type: 'commentLineOuter', comment : 2},
	{type: 'commentLineInner', comment : 2},
	{type: 'commentLine', comment : 2}
];

export const ebnfTest = () => {
	/* tslint:disable:no-debugger */
	debugger;
	const reader = createRuleReader(syntax);
	let r = reader();
	while (r) {
		console.log('ebnf, ', r);
		r = reader();
	}
};
// 测试初始化
export const scannerTest = () => {
	debugger;
	const ss = `
	// a
	//! 	a
	/** a */
	/** a* */
	let bbb = "bbb";
	let aaa = {a: 1};
	for1(let i: i32 = 0; i < 6; i++) {
		aaa.a = aaa.a + 2 + 25 * 6;
	}
	`;
	const reader = createByStr(ss);
	const scanner = new Scanner();
	scanner.setRule(lex);
	scanner.initReader(reader);
	let t = {type:null, value:null, index:0, line:0, column:0};
	let r = scanner.scan(t);
	while (r) {
		console.log('scan, ', t);
		t = {type:null, value:null, index:0, line:0, column:0};
		r = scanner.scan(t);
	}
};
// 测试初始化
export const parserTest = () => {
	debugger;
	// 5+(3 + 2 - 25) * 6
	// x += y ? dd.xxx(1+2, a) : 1;
	// let d, a = "ssss", x = fn(arr){ let i, len = arr.length; };
	// let a = [-b, 2+2, "dd", dd.e()];
	// let a = {b:2+1, c:dd.e()};
	// let a = ++(b++);
	// if(1)a++;else if(b){b = c; return true;}else if(x--){b = c;}else --dd;
	// try{a++; return a;}catch(b){b = c;}finally{return;}
	const ss1 = `
		///同时
		if(1)a++;else if(b){ //注释1 
		b = c; return true;}else if(x--){b = c;}else --dd;
	`;
	const ss = `a=b=10`;
	const reader = createByStr(ss1);
	const scanner = new Scanner();
	scanner.setRule(lex);
	scanner.initReader(reader);
	const parser = new Parser();
	parser.setRule(syntax, cfgs);
	parser.initScanner(scanner);
	let r = parser.parseRule('if');
	while (r) {
		console.log('parse, ', r);
		r = parser.parseExpr();
	}
};

const lexScript = `

	whitespace = {?whitespace?}?;
	(* comment *)
	commentLineOuter = "///" , [{?notbreakline?}] ;
	commentLineInner = "//!" , [{?notbreakline?}] ;
	commentLine = "//" , [{?notbreakline?}] ;
	commentBlockOuter = "/**" , [ { & !"*/"!, ?all? & } ], "*/" ;
	commentBlockInner = "/*!" , [ { & !"*/"!, ?all? & } ], "*/" ;
	commentBlock = "/*" , [ { & !"*/"!, ?all? & } ], "*/" ;

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
	function = & "function", identifier &;
	break = & "break", identifier &;
	continue = & "continue", identifier &;

	(* normal *)
	identifier = ?alphabetic? , [ { ? word ? } ] ;
	float = [integer], ".", { ? digit ? }, [floate] ;
	floate = "e", |"+", "-"|, { ? digit ? } ;
	integer16 = [ "-" ] , "0x" , { |? digit ?, 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f' | } ;
	integer = | "0", integer10 | ;
	integer10 = [ "-" ] , ? digit19 ? , [ { ? digit ? } ] ;
	string = '"', { | '\\"', & !'"'!, ?visible? & | }, '"' ;

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
const lexHtml = `
	whitespace = {?whitespace?}?;
	(* normal *)
	identifier = ?alphabetic? , [ { ? word ? } ] ;
	string1 = '"', { | '\\"', & !'"'!, ?visible? & | }, '"' ;
	string2 = "'", { | "\\'", & !"'"!, ?visible? & | }, "'" ;
	close = "/", identifier, ">";
	(* separator *)
	">" = ">";
	"=" = "=";
	"{{" = "{{";
`;
const lexText = `
	text = { | & ! | "<", "{", "[" | !, ?all? & | } ;
	"{{" = "{{";
	"{" = "{";
	"[" = "[";
	"<" = "<";
`;

const syntaxTpl = `
	script = "{{"?1, | if |;
	html = "<"?2, | el |;
	jobj = "{"?3, | el |;
	jarr = "["?3, | el |;
	value = |"string1", "string2", "identifier", "", ""|;
	attrs = [{"identifier", "="?, value}];
	el = "identifier", attrs, ">"?back, body, "<"?2, "close"?back;
	if = "if"?, ?expr?, "}}"?back, body, [{elseif}], [else], "{{"?1, "end"?, "}}"?back;
	elseif = "{{"?1, "elseif"?, ?expr?, "}}"?back, body;
	else = "{{"?1, "else"?, "}}"?back, body;
	body = [{|"text", jobj, jarr, html, script|}];

	cond = ?expr?, ":"?, ?expr?;
	field = "identifier";
	fielde = ?expr?, "]"?;
	bracket = ?expr?, ")"?;
	call = [?expr?, [{","?, ?expr?}]], ")"?;
	new = "identifier", ["("?, [?expr?, [{","?, ?expr?}]], ")"?];
	arr = [?expr?, [{","?, ?expr?}]], "]"?;
	kv = "identifier", ":"?, ?expr?;
	obj = [kv, [{","?, kv}]], "}"?;

`;
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
	{type: '++', lbp: 85 },
	{type: '--', lbp: 85 },

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

	// 忽略空白
	{type: 'whitespace', ignore : true},
	// 注释
	{type: 'commentBlockOuter', comment : 1},
	{type: 'commentBlockInner', comment : 1},
	{type: 'commentBlock', comment : 1},
	{type: 'commentLineOuter', comment : 2},
	{type: 'commentLineInner', comment : 2},
	{type: 'commentLine', comment : 2}
];

// 测试初始化
export const parserTpl = () => {
	debugger;
	const ss = `
	///同时
	{{if --(it.isOK++)}}
		<div a="1{{}}">@xx dd</div>
	{{elseif it.size + 1 > x}}
	{{else}}
	{{end}}

	`;
	const reader = createByStr(ss);
	const scanner = new Scanner();
	scanner.setRule(lexText, '0');
	scanner.setRule(lexScript, '1');
	scanner.setRule(lexHtml, '2');
	scanner.initReader(reader);
	const parser = new Parser();
	parser.setRule(syntaxTpl, cfgTpl);
	parser.initScanner(scanner);
	let r = parser.parseRule('body');
	while (r) {
		console.log('parse, ', r);
		r = parser.parseExpr();
	}
};

export const forelet = new Forelet();
forelet.listener = (cmd: string, w: Widget): void => {
	if (cmd === 'firstPaint') {
		console.log('ok', w.name);
		// setTimeout(ebnfTest, 1);
		// setTimeout(scannerTest, 1);
		setTimeout(parserTpl, 1);
	}
};

forelet.addHandler('Click', () => {

	return 0;
});
// expr  +  expr  -  expr  *  expr  /   