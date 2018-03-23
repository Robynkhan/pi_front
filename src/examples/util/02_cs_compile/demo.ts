/**
 * 
 */
import { Forelet } from '../../../widget/forelet';
import { Widget } from '../../../widget/widget';

import { createRuleReader } from '../../../compile/ebnf';
import { Parser } from '../../../compile/parser';
import { createByStr } from '../../../compile/reader';
import { Scanner } from '../../../compile/scanner';

// C#的词法规则
const lex = `
	(* comment *)
	commentLine = "//", [{?notbreakline?}] ;
	commentBlock = "/*", [ { & !"*/"!, ?all? & } ], "*/" ;
	commentRegion = "#region", [ { & !"#endregion"!, ?all? & } ], "#endregion" ;
	commentUsing = "using", [{?notbreakline?}] ;

	(* type keyword *)
	bool = & "bool", identifier &;
	byte = & "byte", identifier &;
	char = & "char", identifier &;
	class = & "class", identifier &;
	decimal = & "decimal", identifier &;
	double = & "double", identifier &;
	enum = & "enum", identifier &;
	false = & "false", identifier &;
	float = & "float", identifier &;
	int = & "int", identifier &;
	long = & "long", identifier &;
	namespace = & "namespace", identifier &;
	null = & "null", identifier &;
	object = & "object", identifier &;
	ref = & "ref", identifier &;
	sbyte = & "sbyte", identifier &;
	short = & "short", identifier &;
	string = & "string", identifier &;
	struct = & "struct", identifier &;
	uint = & "uint", identifier &;
	ulong = & "ulong", identifier &;
	ushort = & "ushort", identifier &;
	
	(* keyword *)
	abstract = & "abstract", identifier &;
	as = & "as", identifier &;
	base = & "base", identifier &;
	break = & "break", identifier &;
	case = & "case", identifier &;
	catch = & "catch", identifier &;
	checked = & "checked", identifier &;
	const = & "const", identifier &;
	continue = & "continue", identifier &;
	default = & "default", identifier &;
	delegate = & "delegate", identifier &;
	do = & "do", identifier &;
	else = & "else", identifier &;
	event = & "event", identifier &;
	explicit = & "explicit", identifier &;
	extern = & "extern", identifier &;
	finally = & "finally", identifier &;
	fixed = & "fixed", identifier &;
	for = & "for", identifier &;
	foreach = & "foreach", identifier &;
	goto = & "goto", identifier &;
	if = & "if", identifier &;
	implicit = & "implicit", identifier &;
	in = & "in", identifier &;
	interface = & "interface", identifier &;
	internal = & "internal", identifier &;
	is = & "is", identifier &;
	lock = & "lock", identifier &;
	new = & "new", identifier &;
	operator = & "operator", identifier &;
	out = & "out", identifier &;
	override = & "override", identifier &;
	params = & "params", identifier &;
	private = & "private", identifier &;
	protected = & "protected", identifier &;
	public = & "public", identifier &;
	readonly = & "readonly", identifier &;
	return = & "return", identifier &;
	sealed = & "sealed", identifier &;
	sizeof = & "sizeof", identifier &;
	stackalloc = & "stackalloc", identifier &;
	static = & "static", identifier &;
	switch = & "switch", identifier &;
	this = & "this", identifier &;
	throw = & "throw", identifier &;
	true = & "true", identifier &;
	try = & "try", identifier &;
	typeof = & "typeof", identifier &;
	unchecked = & "unchecked", identifier &;
	unsafe = & "unsafe", identifier &;
	using = & "using", identifier &;
	virtual = & "virtual", identifier &;
	void = & "void", identifier &;
	volatile = & "volatile", identifier &;
	while = & "while", identifier &;
	
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
	"#" = "#";

	(* normal *)
	identifier = ?alphabetic? , [ { ? word ? } ] ;
	float = [integer], ".", { ? digit ? }, [floate] ;
	floate = "e", |"+", "-"|, { ? digit ? } ;
	integer16 = [ "-" ] , "0x" , { |? digit ?, 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f' | } ;
	integer = | "0", integer10 | ;
	integer10 = [ "-" ] , ? digit19 ? , [ { ? digit ? } ] ;
	nonnegative = |"0", @? digit19 ? , [ { ? digit ? } ]@ |;
	string = '"', { | '\\"', & !'"'!, ?visible? & | }, '"' ;
	whitespace = {?whitespace?}?;

`;

// C#的语法规则
const syntax = `

	namespace = "namespace"?, qualified_identifier, namespace_body, [";"?];
	
	qualified_identifier = "identifier", [{"."?, "identifier"}];

	namespace_body = "{"?, [{|namespace, enum|}], "}"?;

	enum = enum_modifiers, "enum"?, "identifier", enum_base, enum_body, [";"?] ;

	enum_modifiers = [{|"new", "public", "protected", "internal", "private"|}] ;

	enum_body = "{", enum_members, "}" ;
	enum_members = enum_member, [{",", enum_member}];
	enum_member = "identifier", ["=", "nonnegative"] ;
	
	enum_base = [integral_type] ;
	integral_type = |"sbyte", "byte", "short", "ushort", "int", "uint", "long", "ulong", "char"| ;
 
`;

// C#的算符优先级及绑定函数
const cfgs = [

	// 忽略空白
	{ type: 'whitespace', ignore: true },

	// 注释
	{ type: 'commentBlock', comment: 1 },
	{ type: 'commentLine', comment: 2 },
	{ type: 'commentRegion', comment: 2 },
	{ type: 'commentUsing', comment: 2 },

	{ type: '{', nud: 'object' },
	{ type: '[', nud: 'array' }
];

const parserRun = () => {
	const scanner: Scanner = new Scanner();
	scanner.setRule(lex);

	const parser: Parser = new Parser();
	parser.setRule(syntax, cfgs);

	const source = `
		namespace A {

		};

		namespace B {

		};
	`;

	const reader = createByStr(source);
	scanner.initReader(reader);

	parser.initScanner(scanner);
	const r = parser.parseRule('namespace, enum');
	console.log('parse rule, ', r);

};

export const forelet = new Forelet();
forelet.listener = (cmd: string, w: Widget): void => {
	if (cmd === 'firstPaint') {
		setTimeout(parserRun, 1);
	}
};