<div> 
    
    <button on-tap="test" style="position:absolute;top:50px;background-color:#FFFFFF">测试</button>
    {{let str = "" }}
    {{for i, v of it}}
        {{: str += " " + v }}
    {{end}}
    <div style="background-color:white">{{str}}</div>
</div>