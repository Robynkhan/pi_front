## 介绍  

### pi_front是什么

pi_front是

### hello_world

以下是hello_world

### 条件与循环

    # tpl
    {{:let arr=[4,5,6]}}
    {{for i,v of arr}}
        {{v}}
            {{if v<5}}<5
            {{elseif v===5}}=5
            {{else}}>5
            {{end}}
        <br>
    {{end}}

    # 结果
    4<5
    5=5
    6>5

以上即是一个简单的循环、条件、显示的应用，我们在所有需要处理的显示对象外层嵌套处理逻辑，不破坏原有代码结构，尽量保证布局的原始性，但又实现了需求

循环：以for-end配对处理，可实现循环显示

条件：以if(-elseif-else)-end配对处理，elseif与else可不处理，可实现按条件显示

{{v}}-显示：可直接将对应数据

{{:arr=[4,5,6]}}--赋值：对变量赋值

### 事件监听    

- 我们的事件监听是在原生事件的基础上封装完成的，所以支持类似原生dom处理

        <button class="btn" on-tap="ok('ok')">确认</button>
        点击确定按钮

- 我们也对事件进行了扩展处理，支持了自定义事件的监听，你可以简单的将事件手动抛出，在其直系父节点上再监听该事件，从而实现数据的传递。这种处理在组件系统中被广泛使用

        # js抛出
        notify(this.parentNode, 'ev-emit-click', { index: this.props.index });
        # tpl抛出
        <button on-tap='$notify("ev-emit-click", { "id":{{v.id}}, })'>"g2"</button>
        # tpl接收
        <section ev-emit-click="clickCardPond"></section>
        
        以上两种情况都能做到抛出事件，最后由其直系父节点接收到该事件

- 目前支持以下事件
    + on-move:移动，滑动
    + on-tap:点击
    + on-dbltap:双击
    + on-longtap:长按
    + on-down:点下
    + on-up:弹起
    + on-rotsal:旋转缩放--自定义扩展，仅移动端有效，效果是两个手指缩放或旋转时触发


### 组件化

目前我们所有的界面都是以组件化的形式组成的,这样能通过将通用组件抽离，时界面表现更简洁

    {{% 对手玩家}}
    <children-playerarea-playerarea$>{"isOpponent":true,player:{{it1.oppo}}}</children-playerarea-playerarea$>
    {{% 中立地带}}
    <children-neutralarea-neutralarea$>{shared:{{it1.shared}}}</children-neutralarea-neutralarea$>
    {{% 我方玩家}}
    <children-playerarea-playerarea$>{"isOpponent":false,player:{{it1.me}}}</children-playerarea-playerarea$>

    以上实例即实现了创建出3块战斗区域,其中playerarea与neutralarea就是单独抽离出的组件，具体组件相关知识，将在接下来详细解说

组件化之后有以下优点

- 提高代码的复用,减少重复工作
    + 组件级别的复用(提供通用组件)
    + 脚本的复用
    + 模板的复用
    + 样式的复用(提供了常用的样式库/动画库)

- 提高编码效率
    + 提供了样式的局部作用域
    + 提供可编程模板
    + 数据和显示的分离=>更好的前端分工，写逻辑的人只关心数据变化，不管关心界面变化
    + 无需手动操作DOM=>代码更简介，不要关注烦人的dom操作

- 提高显示效果
    + 高效的帧管理，要么全部更新，要么不更新，保证画面不会闪烁
    + 精确的DOM更新，保证只刷新真正需要刷新的部分

## 组件系统

- 创建组件
    - 默认组件(js/wcss/tpl/config)

        一个简单的组件，一般需要一个tpl文件，用于定义该组件的布局结构，是组件的主题表现；
        
        在此基础上，可配置同名的js文件，用于对其逻辑数据进行处理；
        
        在此基础上，可配置同名的wcss文件，用于对其样式进行处理，详见下方样式处理

        在此基础上，可配置同名的config文件，用于对组件进行完善，常用属性如下
        - group:该组件显示某个主层级中
        - 也可以在对应的组件的create函数中定义

                create(){        
                    super.create();
                    this.config = {value:{group:"cover"}}
                }

    - .widget组件(wcss/tpl/forelet/widget/config)

        这是一种可实现通过配置，实现tpl、wcss、js、config不同的组装，构建出新的一个组件，从而实现复用

    - 如何创建一个组件
        + 通过在tpl中直接定义，可直接创建组件

                <children-playerarea-playerarea$>{"isOpponent":false,player:{{it1.me}}}</children-playerarea-playerarea$>

                常用的格式还有以下几种
                <role_show$ style=""></role_show$>表示本目录下的role_show组件，
                <role_show$$ style=""></role_show$$>表示父目录下的role_show组件，
                <role_show-zb_show$$ style=""></role_show-zb_show$$>表示父目录下role_show目录下的zb_show组件
                <app-base-btn style=""></app-base-btn>表示根目录开始，app/base目录下的btn组件
        + 通过调用pi.ui.root模块中pop或popNew函数，弹出新的组件界面

                import { popNew } from '../../pi/ui/root';

                popNew(foreletName, foreletParams, (ok:string) => {
                    //todo 这里处理触发ok函数时的回调
                }, (cancel:string) => {
                    //todo 这里处理触发cancel函数时的回调
                });
        + 通过第二种方式弹出组件界面时，可在foreletParams中定义另一个组件名，已widget做键，可同时再创建新的一个组件。(?显示方式)

                import { popNew } from '../../pi/ui/root';

                foreletParams.widget = newForeletName;

                popNew(foreletName, foreletParams, (ok:string) => {
                    //todo 这里处理触发ok函数时的回调
                }, (cancel:string) => {
                    //todo 这里处理触发cancel函数时的回调
                });

- 样式处理
    - wcss

        wcss样式文件是我们自定义的用于处理样式的文件，通过定义`w-class="my-money"`实现对其引用。其格式与原生css结构一致，因其原理限制，暂不支持伪类( :hover)、伪对象( :first-child)和关键帧动画( animation keyframes)

    - wcss处理原理

        我们会将所有的wcss中定义的属性改为内联样式添加到对应都没节点上，但其优先级会略低于直接定义的内联样式。
        
        因其最终表现为内联样式，就有了上述说的某些不支持的情况。

        由于引用wcss文件不占有原生引用css文件位置，那么一个dom节点上能同时再引入全局css文件进行处理

    - 样式的优先级(innerstyle>wcss>css--参见css例子)

            # tpl文件
            <section w-class="my-money" class="center" style="color:red;">$999</section>

            # wcss文件
            .my-money {
                position: absolute;
                bottom:0;
                left:0;
                width:30%;
                height:25px;
                border-radius:0px 150px 0px 0px;
                background-color:rgba(0, 255, 128, 0.3);
            }

            # 全局css文件
            .center {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        
        上述就是一个简单的样式应用

- 数据传递

    组件间的数据传递，将孤立的组件串联起来，构成一个整体

    + 子组件=>父组件
        - 通过子组件抛出事件，父组件监听事件的形式实现数据传递
    + 父组件=>子组件
        
        在创建组件时传入参数

            <role_show$ style="">这里可传入参数</role_show$>

            popNew(foreletName, foreletParams);
            foreletParams:传递的参数

    + 简单数据传递
    + 含有变量的数据传递
    + 多层数据传递
- 事件处理
    + 自定义事件

        自定义事件被广泛应用于组件间的数据传递，直系父子间都能通过自定义的事件来完成

    + 系统事件
        - 可直接绑定7种我们支持的系统事件，在事件监听中有具体的定义
        - cap---代表传递方式为捕获
        - on---代表传递方式为冒泡
- 生命周期
    + 帧调度
    + widget
        + 什么是widget

            负责显示逻辑，是数据和原始dom间的桥梁

        + widget属性

                public name: string = null; // 组件的名称
                public tpl: Tpl = null; // 组件的模板
                public sheet: {value: Sheet} = null; // 组件的样式
                public config: {value: Json} = null; // 所对应的配置
                public forelet: Forelet = null; // 所对应的forelet
                public props: Json = null; // 由父组件设置的组件属性
                public state: Json = null; // 由forelet设置的组件状态
                public tree: VWNode = null; // 组件所对应的节点树
                public parentNode: VirtualWidgetNode = null; // 父节点，parentNode.link的对象就是widget
                public children: Widget[] = []; // 所有的子组件
                public inDomTree: boolean = false; // 是否在dom树中
                public resTab: ResTab = null; // 资源表
                public resTimeout: number = 3000; // 资源缓冲时间，默认3秒

        + widget生命周期钩子
        + widget生命周期图示
    + forelet
        + forelet作用

            负责进行业务逻辑处理，是数据库和显示组件间的桥梁

        + forelet生命周期

- 模板语法
    + 注释

        直接在模板中定义`{{% 我是注释...}}`实现添加注释

    + 插值(强调可以在任何地方插值)
        - 文本
        - css片段
        - js表达式
        
            因模板处理原理是对tpl中字符串进行解析处理，通过一定规范，重新转换为新的字符串，并解析为对于的节点树，所以我们可在任意地方进行插值，构建出想要的效果。

            常用的插值格式有以下几种

                调用函数:{{format(it.array[i], "mm:ss")}}
                判断赋值:{{(i > 0) ? 1 : 0 }}
                直接赋值：{{i + 1 }}
                默认值赋值：{{v || 'none' }}

    + 变量定义

        直接在模板中定义`{{let x = (date(it.name) +1) * 2}}`实现定义变量并赋值，也可以通过定义`{{: list[0] = 1}}`对数据进行修改

    + 函数声明
    + 内置变量
        - it--对应组件中props中的值，也就是父组件传递下来的数据
        - it1--对应组件中state中的值，也就是当前界面自己定义的数据
        - _cfg--对应组件中配置的额外参数，对应config文件中的配置

        我们在模板中，有以上几个内置变量可直接使用。

        警告：内置变量中的值不要在模板中修改

        
    + 条件渲染

        格式如下

            if条件判断
            {{if it.isOK}}
             else if条件判断
            {{elseif it.size + 1 > x}}
             else条件
            {{else}}
             条件结束
            {{end}}

    + 列表渲染
        + 普通列表渲染
        + 通过did进行优化


    
## 周边生态

- 加载系统
    + TODO
- 构建系统
    + TODO
