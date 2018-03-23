<span>
{{if it.cdInfo}}
{{let show = it.cdInfo.date +"天 " + it.cdInfo.hour +"时 " + it.cdInfo.minute +"分 " + it.cdInfo.second + "秒 " }}
<imgtext$>{"textCfg":{"text":"1234567890:时分秒毫天 ", "font":"20px 宋体", "color":"#636363","show":{{show}} } }</imgtext$>
{{end}}
</span>