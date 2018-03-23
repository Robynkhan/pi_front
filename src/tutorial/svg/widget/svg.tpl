<div w-class="svgGraph">
    <widget w-tag="ui-html">{{it.innerHTML}}</widget>
    <div w-class="body">
        {{for index, item of it.data}}
        <div>
            <label w-class="lable">{{item.label}}</label>
            <input type="range" max="100" min="0" value="{{item.value}}" on-input="change(e,{{index}})"
            />
            <span w-class="number">{{item.value}}</span>
            <button w-class="close" on-click="delete({{index}})">X</button>
        </div>
        {{end}}
        <div>
            <input type="text" w-class="add" value="{{it.newLab}}" on-keyup="inputChange" />
            <button on-click="add">Add a Stat</button>
        </div>
    </div>
</div>