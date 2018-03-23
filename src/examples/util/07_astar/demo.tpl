<div>
	<button on-tap="clearWall">清空墙壁</button>
	<button on-tap="randomWall">随机构建墙壁</button>
	<button on-tap="searchPath">开始寻路</button>
	
	<div style="background-color:yellow">寻路时间：{{it.time !== 0 ? it.time : 0}}ms </div>
	
	<div style="width:{{it.width}}px; height:{{it.height}}px">
		{{ for index, v of it.items }}
			{{ let i = index % it.w }}
			{{ let j = Math.floor(index / it.w) }}
			<div class="cell" on-mousedown="mousedown({{i}}, {{j}})" on-mousemove="mousemove(e, {{i}}, {{j}})" style="width:{{100/it.w}}%; height:{{100/it.h}}%; background-color: {{v.usage}};"></div>
		{{ end }}
	</div>

</div>