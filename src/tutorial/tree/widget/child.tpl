<div>
	<li>
	<div on-click="slideDown" style="font-weight: 800">{{it.data.name}}
		{{if it.open}}
			<span>{{"[－]"}}</span>
		{{else}}
			<span>{{"[＋]"}}</span>
		{{end}}
	</div>
	<ul w-class="{{if it.open}}show{{else}}hide{{end}}">
		{{for i, v of it.data.children}}
			{{if v.children}}
				<li><child$>{data:{{v}},open: {{it.folderOpen}}}</child$></li>
			{{else}}
				<li on-dblclick="addFolder({{i}})">{{v.name}}</li>
			{{end}}
		{{end}}
		<li on-click="addChild">+</li>
	</ul>
	</li>
</div>