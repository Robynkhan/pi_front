
import { partWrite, allWrite } from "struct/util";
import { BinBuffer, BinCode, ReadNext, WriteNext } from "util/bin";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr } from "struct/struct_mgr";


export class getName extends Struct {
	id: number;
	

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
	setId (value: number){	
		
		let old = this.id;
		this.id = value;
		
	}

	encodeId(bb:BinBuffer){
		if(this.id === null || this.id === undefined){
			bb.writeNil();
		}else{
			
		}				
	}

	copy(o: getName) : getName {
		
		return this;
	}

	clone() : getName {
		return new getName().copy(this);
	}
	

	binDecode(bb:BinBuffer, next: Function) {
		this.id = bb.read() as number;
		
	}

	binEncode(bb:BinBuffer, next: WriteNext) {
		let temp: any;
		if(this.id === null || this.id === undefined)
			bb.writeNil();
		else{
			bb.writeInt(this.id);
		}						
	}
}

(<any>getName)._$info = {
	nameHash:1915946709,
	
	annotate:{"type":"rpc"},
	
	fields:{ id:{"name":"id","type":{"type":"i16"}} }
}


export class setName extends Struct {
	id: number;
	name: string;
	

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
	setId (value: number){	
		
		let old = this.id;
		this.id = value;
		
	}
	setName (value: string){	
		
		let old = this.name;
		this.name = value;
		
	}

	encodeId(bb:BinBuffer){
		if(this.id === null || this.id === undefined){
			bb.writeNil();
		}else{
			
		}				
	}
	encodeName(bb:BinBuffer){
		if(this.name === null || this.name === undefined){
			bb.writeNil();
		}else{
			
			bb.writeUtf8(this.name);
			
		}				
	}

	copy(o: setName) : setName {
		
		return this;
	}

	clone() : setName {
		return new setName().copy(this);
	}
	

	binDecode(bb:BinBuffer, next: Function) {
		this.id = bb.read() as number;
		
		this.name = bb.read() as string;
		
	}

	binEncode(bb:BinBuffer, next: WriteNext) {
		let temp: any;
		if(this.id === null || this.id === undefined)
			bb.writeNil();
		else{
			bb.writeInt(this.id);
		}						
		if(this.name === null || this.name === undefined)
			bb.writeNil();
		else{
			bb.writeUtf8(this.name);
		}						
	}
}

(<any>setName)._$info = {
	nameHash:517748473,
	
	annotate:{"type":"rpc"},
	
	fields:{ id:{"name":"id","type":{"type":"i16"}},name:{"name":"name","type":{"type":"str"}} }
}

