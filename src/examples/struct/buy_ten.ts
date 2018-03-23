
import { partWrite, allWrite } from "struct/util";
import { BinBuffer, BinCode, ReadNext, WriteNext } from "util/bin";
import { addToMeta, removeFromMeta, Struct, notifyModify, StructMgr } from "struct/struct_mgr";

import { Component } from "../../ecs/world";


export class Tansfrom extends Component {
	position: Vector;
	rotation: Vector;
	scale: Vector;
	

	// 添加
	addMeta(mgr: StructMgr){
		if(this._$meta)
			return;
		this.position && this.position.addMeta(mgr);
		
		this.rotation && this.rotation.addMeta(mgr);
		
		this.scale && this.scale.addMeta(mgr);
		
		addToMeta(mgr, this);
	}

	// 移除
	removeMeta(){
		removeFromMeta(this);
		this.position && this.position.removeMeta();
		
		this.rotation && this.rotation.removeMeta();
		
		this.scale && this.scale.removeMeta();
		
	}

	//set 设置
	setPosition (value: Vector){	
		
		let old = this.position;
		this.position = value;
		if(this._$meta){
			if(old)
				old.removeMeta();
			value.addMeta(this._$meta.mgr);
			
		}
	}
	setRotation (value: Vector){	
		
		let old = this.rotation;
		this.rotation = value;
		if(this._$meta){
			if(old)
				old.removeMeta();
			value.addMeta(this._$meta.mgr);
			
		}
	}
	setScale (value: Vector){	
		
		let old = this.scale;
		this.scale = value;
		if(this._$meta){
			if(old)
				old.removeMeta();
			value.addMeta(this._$meta.mgr);
			
		}
	}


	copy(o: Tansfrom) : Tansfrom {
		
		this.position = o.position.clone();
		
		this.rotation = o.rotation.clone();
		
		this.scale = o.scale.clone();
		
		return this;
	}

	clone() : Tansfrom {
		return new Tansfrom().copy(this);
	}
	

	binDecode(bb:BinBuffer, next: Function) {
		this.position = bb.read(next(this._$meta.mgr)) as Vector;
		
		this.rotation = bb.read(next(this._$meta.mgr)) as Vector;
		
		this.scale = bb.read(next(this._$meta.mgr)) as Vector;
		
	}

	binEncode(bb:BinBuffer, next: WriteNext) {
		let temp: any;
		if(this.position === null || this.position === undefined)
			bb.writeNil();
		else{
			
			bb.writeCt(this.position, next);
			
		}						
		if(this.rotation === null || this.rotation === undefined)
			bb.writeNil();
		else{
			
			bb.writeCt(this.rotation, next);
			
		}						
		if(this.scale === null || this.scale === undefined)
			bb.writeNil();
		else{
			
			bb.writeCt(this.scale, next);
			
		}						
	}
}

(<any>Tansfrom)._$info = {
	nameHash:2275292305,
	
	annotate:{"extends":"Component"},
	
	fields:{ position:{"name":"position","type":{"type":"Vector"}},rotation:{"name":"rotation","type":{"type":"Vector"}},scale:{"name":"scale","type":{"type":"Vector"}} }
}


export class Vector extends Struct {
	value: [number,number,number];
	

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
	setValue_0 (value: number){
		!this.value && (this.value = [] as [number,number,number]);
		
		let old = this.value[0];
		this.value[0] = value;
		
	}
	setValue_1 (value: number){
		!this.value && (this.value = [] as [number,number,number]);
		
		let old = this.value[1];
		this.value[1] = value;
		
	}
	setValue_2 (value: number){
		!this.value && (this.value = [] as [number,number,number]);
		
		let old = this.value[2];
		this.value[2] = value;
		
	}

	encodeValue_0(bb:BinBuffer){
		if(this.value === null || this.value === undefined){
			bb.writeNil();
		}else{	
			
			bb.writeF32(this.value[0]);
			
		}				
	}
	encodeValue_1(bb:BinBuffer){
		if(this.value === null || this.value === undefined){
			bb.writeNil();
		}else{	
			
			bb.writeF32(this.value[1]);
			
		}				
	}
	encodeValue_2(bb:BinBuffer){
		if(this.value === null || this.value === undefined){
			bb.writeNil();
		}else{	
			
			bb.writeF32(this.value[2]);
			
		}				
	}


	copy(o: Vector) : Vector {
		
		this.value = [] as [number,number,number];
		
		this.value[0] = o.value[0];
		
		this.value[1] = o.value[1];
		
		this.value[2] = o.value[2];
		
		return this;
	}

	clone() : Vector {
		return new Vector().copy(this);
	}
	

	binDecode(bb:BinBuffer, next: Function) {
		this.value = [] as [number,number,number];
		
		this.value.push(bb.read() as number);
		
		this.value.push(bb.read() as number);
		
		this.value.push(bb.read() as number);
		
	}

	binEncode(bb:BinBuffer, next: WriteNext) {
		let temp: any;
		if(this.value === null || this.value === undefined)
			bb.writeNil();
		else{
			
			if(this.value[0] === null || this.value[0] === undefined)
				bb.writeNil();
			else{
			
			bb.writeF32(this.value[0]);
			
			}		
			if(this.value[1] === null || this.value[1] === undefined)
				bb.writeNil();
			else{
			
			bb.writeF32(this.value[1]);
			
			}		
			if(this.value[2] === null || this.value[2] === undefined)
				bb.writeNil();
			else{
			
			bb.writeF32(this.value[2]);
			
			}		
		}						
	}
}

(<any>Vector)._$info = {
	nameHash:4286986296,
	
	fields:{ value:{"name":"value","type":{"type":"Tuple","genType":[{"type":"f32"},{"type":"f32"},{"type":"f32"}]}} }
}

