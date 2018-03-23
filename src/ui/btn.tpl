{{:it = it || {"cfg":{"clazz":"", "text":"1"} } }}
{{% common = true, text = "!#$%'()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~" }}
<div>
<div w-class ={{it.cfg.clazz}} on-tap="tap">
    {{if it.cfg.text}}
    <imgtext$>{"textCfg":{"text":{{it.cfg.text}}, "font":"20px 宋体", "color":"#636363" }}</imgtext$>
    {{end}}
</div>
</div>