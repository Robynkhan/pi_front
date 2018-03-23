{{:it = it || {"cfg":{"clazz":"", "text":"1", leaf:false}, select:false} }}
<div w-class={{it.cfg.clazz}}>
{{if it.leaf}}
<div style="width:16px;display: inline-block;"> </div>
{{elseif it.select}}
<div style="width:16px;display: inline-block;">-</div>
{{else}}
<div style="width:16px;display: inline-block;">+</div>
{{end}}
{{it.cfg.text}}
</div>