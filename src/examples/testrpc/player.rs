
//取到名字
 #[type=rpc]
struct getName {
	id: i16,
}

//设置名字
#[type=rpc]
struct setName {
	id: i16,
	name:str,
}



