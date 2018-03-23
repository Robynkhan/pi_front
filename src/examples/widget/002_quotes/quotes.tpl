{{: it = {"name":"aaa"} }}
<div>		
	<widget w-tag="child$">{"child":"tangmin{{it.name.replace('aaa','bbb')}}"}</widget>
	<div style= "background-color:{{it.name === 'aaa' ? 'blue' : 'red'}}; ">xxxx</div>
</div>