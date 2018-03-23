<div>
	<div style="position:absolute;width:40px;height:4%;text-align:center;color:yellow;opacity:0.5;z-index:1;" on-tap="showMenu">	
		menu
	</div>
	<div style="position: absolute; width:240px; height:96%;top:4%;border-right: 1px solid #000; overflow-x: hidden; overflow-y: auto;display:{{it.show?'block':'none'}}">
	
		<ui-treememu$$ style="width:100%" ev-tm-open="open">{{it.tree}}</ui-treememu$$>
	</div>
	<div style="position: absolute; left:{{it.show?240:0}}px; right:0px; height:100%;">
	{{if it.widget}}
	<widget w-tag={{it.widget}}></widget>
	{{end}}
	</div>
</div>

