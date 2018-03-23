<div ev-child-click="countClick">
    {{for key, value of it.arr}}
    <button on-click="childClick({{key}})">{{value}}</button> 
    {{end}}
</div>