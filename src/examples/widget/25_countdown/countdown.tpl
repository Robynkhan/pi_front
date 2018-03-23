{{if it.isend}}
<div>
    倒计时结束
</div>
{{else}}
<div ev-countdownend="end">
    <ui-countdown>{"cd_time":{{new Date().getTime() + 100000}},"cd_interval":1000}</ui-countdown>
</div>
{{end}}