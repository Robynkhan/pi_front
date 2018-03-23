<div style="position: absolute; width:100%;height:100%;overflow:hidden">
{{let arr = []}}
{{while arr.length < 150}}
	{{: arr.push({"widget":"ui-input", "text":arr.length}) }}
{{end}}
<ui-progressive>{"initCount":60, "arr":{{arr}} }</ui-progressive>

</div>