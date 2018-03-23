<div>
    <table style="width:100%;text-align:center;border-collapse:collapse;border-spacing:1;border-spacing:0">
        <tr>
            {{for key, title of it.itemsTitle}}
                <th style="word-break: break-all; word-wrap:break-word;border-right:1px solid #939598; border-bottom:1px solid #939598;font:500 14px Arial">{{title}}</th>
            {{end}}
        </tr>
        {{for key1, item of it.items}}
            <tr>
                {{for key2, attr of item}}
                    <td style="word-break: break-all; word-wrap:break-word;border-right:1px solid #939598; border-bottom:1px solid #939598;font:500 14px Arial">{{attr}}</td>
                {{end}}
            </tr>
         {{end}}
    </table>
</div>
