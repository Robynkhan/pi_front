
import { partWrite, allWrite } from "struct/util";
import { BinBuffer, BinCode, ReadNext, WriteNext } from "util/bin";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr } from "struct/struct_mgr";


export class OK extends Struct {
	

	// 添加
	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	// 移除
	removeMeta(){
		removeFromMeta(this);
	}

	//set 设置


	copy(o: OK) : OK {
		
		return this;
	}

	clone() : OK {
		return new OK().copy(this);
	}
	

	binDecode(bb:BinBuffer, next: Function) {
	}

	binEncode(bb:BinBuffer, next: WriteNext) {
		let temp: any;
	}
}

(<any>OK)._$info = {
	nameHash:2129592974,
	
	annotate:{"type":"rpc"},
	
	fields:{  }
}


export class OK_I extends Struct {
	value: number;
	

	// 添加
	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	// 移除
	removeMeta(){
		removeFromMeta(this);
	}

	//set 设置
	setValue (value: number){	
		
		let old = this.value;
		this.value = value;
		
	}

	encodeValue(bb:BinBuffer){
		if(this.value === null || this.value === undefined){
			bb.writeNil();
		}else{
			
		}				
	}

	copy(o: OK_I) : OK_I {
		
		return this;
	}

	clone() : OK_I {
		return new OK_I().copy(this);
	}
	

	binDecode(bb:BinBuffer, next: Function) {
		this.value = bb.read() as number;
		
	}

	binEncode(bb:BinBuffer, next: WriteNext) {
		let temp: any;
		if(this.value === null || this.value === undefined)
			bb.writeNil();
		else{
			bb.writeInt(this.value);
		}						
	}
}

(<any>OK_I)._$info = {
	nameHash:3575551304,
	
	annotate:{"type":"rpc"},
	
	fields:{ value:{"name":"value","type":{"type":"i32"}} }
}


export class OK_S extends Struct {
	value: string;
	

	// 添加
	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	// 移除
	removeMeta(){
		removeFromMeta(this);
	}

	//set 设置
	setValue (value: string){	
		
		let old = this.value;
		this.value = value;
		
	}

	encodeValue(bb:BinBuffer){
		if(this.value === null || this.value === undefined){
			bb.writeNil();
		}else{
			
			bb.writeUtf8(this.value);
			
		}				
	}

	copy(o: OK_S) : OK_S {
		
		return this;
	}

	clone() : OK_S {
		return new OK_S().copy(this);
	}
	

	binDecode(bb:BinBuffer, next: Function) {
		this.value = bb.read() as string;
		
	}

	binEncode(bb:BinBuffer, next: WriteNext) {
		let temp: any;
		if(this.value === null || this.value === undefined)
			bb.writeNil();
		else{
			bb.writeUtf8(this.value);
		}						
	}
}

(<any>OK_S)._$info = {
	nameHash:3865260179,
	
	annotate:{"type":"rpc"},
	
	fields:{ value:{"name":"value","type":{"type":"str"}} }
}


export class Error extends Struct {
	code: number;
	info: string;
	

	// 添加
	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	// 移除
	removeMeta(){
		removeFromMeta(this);
	}

	//set 设置
	setCode (value: number){	
		
		let old = this.code;
		this.code = value;
		
	}
	setInfo (value: string){	
		
		let old = this.info;
		this.info = value;
		
	}

	encodeCode(bb:BinBuffer){
		if(this.code === null || this.code === undefined){
			bb.writeNil();
		}else{
			
		}				
	}
	encodeInfo(bb:BinBuffer){
		if(this.info === null || this.info === undefined){
			bb.writeNil();
		}else{
			
			bb.writeUtf8(this.info);
			
		}				
	}

	copy(o: Error) : Error {
		
		return this;
	}

	clone() : Error {
		return new Error().copy(this);
	}
	

	binDecode(bb:BinBuffer, next: Function) {
		this.code = bb.read() as number;
		
		this.info = bb.read() as string;
		
	}

	binEncode(bb:BinBuffer, next: WriteNext) {
		let temp: any;
		if(this.code === null || this.code === undefined)
			bb.writeNil();
		else{
			bb.writeInt(this.code);
		}						
		if(this.info === null || this.info === undefined)
			bb.writeNil();
		else{
			bb.writeUtf8(this.info);
		}						
	}
}

(<any>Error)._$info = {
	nameHash:529878099,
	
	annotate:{"type":"rpc"},
	
	fields:{ code:{"name":"code","type":{"type":"i32"}},info:{"name":"info","type":{"type":"str"}} }
}


export class Req extends Struct {
	path: string;
	

	// 添加
	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		addToMeta(mgr, this);
	}

	// 移除
	removeMeta(){
		removeFromMeta(this);
	}

	//set 设置
	setPath (value: string){	
		
		let old = this.path;
		this.path = value;
		
	}

	encodePath(bb:BinBuffer){
		if(this.path === null || this.path === undefined){
			bb.writeNil();
		}else{
			
			bb.writeUtf8(this.path);
			
		}				
	}

	copy(o: Req) : Req {
		
		return this;
	}

	clone() : Req {
		return new Req().copy(this);
	}
	

	binDecode(bb:BinBuffer, next: Function) {
		this.path = bb.read() as string;
		
	}

	binEncode(bb:BinBuffer, next: WriteNext) {
		let temp: any;
		if(this.path === null || this.path === undefined)
			bb.writeNil();
		else{
			bb.writeUtf8(this.path);
		}						
	}
}

(<any>Req)._$info = {
	nameHash:1506418717,
	
	annotate:{"type":"rpc"},
	
	fields:{ path:{"name":"path","type":{"type":"str"}} }
}

