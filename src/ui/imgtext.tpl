{{let textCfg = it.textCfg }}
{{let zoomfactor = textCfg.zoomfactor}}
{{if textCfg.isCommon}}
{{if !textCfg.charUV}}
<span></span>
{{else}}
{{let arr = it.show.split("")}}
{{let uv = {} }}
<span>
    {{for i, v of arr}}{{: uv = textCfg.charUV[v]}}
    <span style="display:inline-block;overflow:hidden;background-image:url({{textCfg.url}});background-repeat:no-repeat;background-size:{{textCfg.width/zoomfactor}}px {{textCfg.height/zoomfactor}}px;background-position:-{{uv.u1/zoomfactor}}px -{{uv.v1/zoomfactor}}px;width:{{(uv.u2-uv.u1)/zoomfactor}}px;height:{{(uv.v2-uv.v1)/zoomfactor}}px;{{if it.space}}margin:0px {{it.space}}px;{{end}}"></span>
    {{end}}
</span>
{{end}}
{{else}}
<img style="width:{{textCfg.width/zoomfactor}}px; height:{{textCfg.height/zoomfactor}}px" src={{textCfg.url || ''}} />
{{end}}
