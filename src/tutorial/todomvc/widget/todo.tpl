<div w-class="container">
	<h1 w-class="title">todos</h1>
	<div w-class="wrapper">
		
		{{% 选项输入框}}
		
		<div w-class="search">
			{{if it.items.length > 0}}
			{{% 如果当前是宣布选中，用active的class}}
			{{% w-class属性在组件对应的wcss文件里面定义}}
			<sapn w-class="arrow {{it.isAllCompleted?'active':'' }}" on-click="toggleCompleteAll">∨</span>
			{{end}}
			<input type="text" w-class="inner" style="outline: none;" placeholder="有哪些事情需要做的?" on-change="add" />
		</div>
		
		{{% todo列表}}
		
		<div>
			{{% 遍历todo列表，显示过滤好的选项}}
			{{for index, item of it.items}} {{if it.filter(item) }}
			<div w-class="content" class="content">
				<div w-class="circle {{item.isCompleted?'boxcompleted':'boxactive'}}" on-click="toggleComplete({{index}})">√</div>
				<span w-class="{{item.isCompleted?'itemcompleted':''}}">{{item.name}}</span>
				<span w-class="remove" class="remove" on-click="remove({{index}})">×</span>
			</div>
			{{end}} {{end}}
		</div>

		{{% 显示功能}}

		{{if it.items.length > 0}}
		<div w-class="options">
			{{let count = it.leftCount }}
			<div>{{count}}&nbsp;{{count > 1 ? 'items' : 'item'}}&nbsp;left</div>
			<div w-class="tab-2">
				<div w-class="item {{it.state==='all'?'select':''}}" on-click="showAll">所有</div>
				<div w-class="item {{it.state==='active'?'select':''}}" on-click="showActive">还没完成</div>
				<div w-class="item {{it.state==='completed'?'select':''}}" on-click="showCompleted">已完成</div>
			</div>

			<div w-class="tab-3">
				{{if count !== it.items.length}}
				<div class="underline" on-click="clearCompleted">清除已完成的选项</div>
				{{end}}
			</div>
		</div>
		{{end}}
	</div>

	{{% 底下背景}}
	<div w-class="footer-1"></div>
	<div w-class="footer-2"></div>
</div>