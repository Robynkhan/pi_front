{{: it = it || {sign:1, text:"", readOnly:true, focus:true, id:1} }}
{{% 必须保证div下可以递归找到input }}
<div>
<input on-blur="onBlur" on-focus="onFocus" value=""/>
<div on-tap="submit">提交</div>
</div>
