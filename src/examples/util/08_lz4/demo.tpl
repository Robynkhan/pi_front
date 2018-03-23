<div style="position:absolute;top:50px;">
    <button on-tap="test" style="background-color:#FFFFFF">LZ4测试</button>
    <br></br>
    <br></br>
    <br></br>
    
    {{if it.status }}

    <div style="color:#FFFFFF">{{it.status}}</div>
    <br></br>
    <div style="color:#FFFFFF">{{it.count}}次，大小：{{it.size}}</div>
    <br></br>
    <div style="color:#FFFFFF">{{it.compressTime.toFixed(2)}}毫秒，平均：{{it.avgCompressTime}}毫秒</div>
    <br></br>
    <div style="color:#FFFFFF">解压时间：{{it.decompressTime.toFixed(2)}}毫秒，平均：{{it.avgDecompressTime}}毫秒</div>

    {{end}}
</div>