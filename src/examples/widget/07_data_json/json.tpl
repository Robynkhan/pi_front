<div>
    <div>
        boss is : {{it.data.boss}}
    </div>
    <div>
        company name is : {{it.data.cpy.name}}
    </div>
    <div>
        company address is : {{it.data.cpy.addr}}
    </div>
    {{for index,staff of it.data.staff}}
        <div>
            staff is : {{staff}}
        </div>
    {{end}}
</div>