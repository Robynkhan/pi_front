{{:it = it || {} }}
<div style="position:absolute;width:100%;height:30px;">
	<select style="position:absolute;width:200px; height: 30px;" allowDefault="true" value="{{it.name}}">
		{{if it.selects}}
		{{for i, v of it.selects}}
		<option value ="{{v}}" {{if it.name === v}}selected="selected"{{end}} on-tap="change(e)">{{v}}</option>
		{{end}}
		{{end}}
	</select>
</div>