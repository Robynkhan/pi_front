<div w-class="container">
	<button on-click="showModel" w-class="btn">Show Model</button>

	<div class="box {{it.show ? 'active' : 'hide'}}">
		<div w-class="alert">
			<h3 w-class="custom">custom header</h3>
			<div w-class="default">default header</div>
			<div w-class="default">default footer</div>
			<button on-click="closeModel" w-class="check">OK</button>
		</div>
	</div>
</div>
