

<div>
    <test2$>
        {
        {{let b = /b/}}
        {{let a = 0}}

        {{for k, v of [1,2,3,4]}}
        {{: a = v}}
        {{end}}

        {{if a === 4}}
        {{a = true}}
        {{end}}
        
        "a":{{a}},
        "b":1
        }
    </test2$>
</div>
