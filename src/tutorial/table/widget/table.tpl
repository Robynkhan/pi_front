<div w-class="mytable">
    <div w-class="search">
        <label>search</label>
        <input type="text" on-keyup="search"/>
    </div>
    <table w-class="table">
        <thead>
            <tr>
                <th w-class="th {{if it.nameActive}}active{{end}}" on-click="sortByName">Name<span w-class="arrow {{if !it.nameStu}}asc{{else}}dsc{{end}} {{if it.nameActive}}selected{{end}}"></span></th>
                <th w-class="th {{if it.powerActive}}active{{end}}"  on-click="sortByPower">Power<span w-class="arrow  {{if !it.powerStu}}asc{{else}}dsc{{end}} {{if it.powerActive}}selected{{end}}"></span></th>
            </tr>
        </thead>
        <tbody>
            {{for index,item of it.showData}}
            <tr>
                <td w-class="td">{{item.name}}</td>
                <td w-class="td">{{item.power}}</td>
            </tr>
            {{end}}
        </tbody>
    </table>
</div>

