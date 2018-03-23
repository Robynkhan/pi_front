{{:it=it||{} }}
<div style="position:absolute;width:100%; height:100%;" >
    <div style="position:absolute;width:100%;top:40px;bottom:0px;" on-mousedown="onMouseDown" on-mousemove="onMouseMove" on-mousewheel="onMouseWheel" on-tap="onRayCast"></div>
    <widget w-tag="select-select$" ev-select="rnChange(e)">{"name":{{it.name}}, "selects":{{it.selects}} }</widget>
    <div style="position:absolute;height:30px;left:300px;width:400px">
        cameraFactor:
        <input value="{{it.cameraFactor}}" style="position:absolute;height:30px;width:200px" allowDefault="true" on-blur="cfChange(e)"/>
    </div>
    
</div>