{{% 要求it为节点显示树}}

{{:it = it || {tag:"btn", show:{"cfg":{"clazz":"", "text":"1", leaf:false}, select:false}, cmd:"", arr:[]} }}
<div>
	{{if it.tag}}
    <widget w-tag={{it.tag}} w-class="item" on-tap="change('{{it.cmd}}')">{{it.show}}</widget>
    {{end}}
    {{if it.arr && it.show.select}}
        <div w-class="tree">
        {{for i, v of it.arr}}
            <treememu$>{{parseInt(i)}}</treememu$>
        {{end}}
        </div>
    {{end}}
</div>
