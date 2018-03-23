{{% 要求it可选提供当前选中的卡片位置，默认为{cur:0}}}
{{% 要求_cfg提供卡片数组}}

{{:it = it || {cur:0} }}

<div style="width:100%;height:100%">

<div w-class="tabs" on-move="moveTab" on-touchstart="poiseStart" on-touchend="poiseEnd">
<div container="" style="width:100%;height:100%;transform:translateX({{-100*it.cur}}%);">
{{for i, v of _cfg.arr}}
    <widget w-tag={{v.tab}} style="position: absolute;left:{{100*i}}%;width:100%;height:100%;background-color: {{v.color}};"></widget>
{{end}}
</div>
</div>

<div btns="" w-class="btns" ev-btn="change">
{{for i, v of _cfg.arr}}
    <widget w-tag={{ _cfg.btn}} style="display: inline-block;">{"cfg":{{v.btn}}, "e":{"cmd": {{i}} }, "select":{{i == it.cur}} }</widget>
{{end}}
</div>

</div>
