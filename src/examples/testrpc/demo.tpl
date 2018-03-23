{{: it=it || {r:"", name:"chuanyanaaaaaaaaa"} }}
<div>
    <h2>测试rpc， 测试主题根：examples/testrpc/player</h2>
    <input tag="nameinput" style="height:30px; width:400px;" value="{{it.name}}"/>
    <div style="height:30px; width:100px;text-align:center; background-color:darkgreen;margin-top:4px;border:1px solid rgb(13, 13, 14)" on-tap="setName">setName</div>
    <div style="height:30px; width:100px;text-align:center;background-color:darkgreen;margin-top:4px;border:1px solid rgb(13, 13, 14)" on-tap="getName">getName</div>
    <div style="height:500px;width:100%">{{it.r}}</div>
</div>