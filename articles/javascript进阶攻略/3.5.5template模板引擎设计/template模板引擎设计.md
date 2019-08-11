# underscore template模板引擎设计

underscore中使用的template模板引擎设计,我们需要先了解几个相关知识

### new Function()的应用

这时一个很少被用到的新建函数的方法，但是有时候不得不用到它。

语法：

```
// name、age... 是形参 
// alert(name) 是函数体内容(最后一个参数)
var fn = new Function('name', 'age', 'alert(name)');

fn('george'); // 弹出框显示'george'

```

### with的应用

扩展一个语句的作用域链.

>不推荐使用with，在 ECMAScript 5 严格模式中该标签已被禁止。推荐的替代方案是声明一个临时变量来承载你所需要的属性。

Vue.js 2.x 模板编译为什么要使用了with(this)的语法?
>因为没有什么太明显的坏处（经测试性能影响几乎可以忽略）但是 with 的作用域和模板的作用域正好契合，可以极大地简化模板编译过程。
用 with 的主要副作用是生成的代码不能在 strict mode / ES module 中运行，但直接在浏览器里编译的时候因为用了 new Function()，等同于 eval，不受这一点影响。


```
with(obj) { // obj.name 作用域链 执行阶段
    name // 变量 引用关系变得不可分析
}
```

>js会有一个预编译的过程，又叫预加载。是指js在词法分析的时候会给我们定义的变量、函数设置一个标识符(物理的内存地址),这时一种优化的手段，而我们使用了with,如上面例子，with中的name 预编译时无法解析name, 那么将变成一个变量，只能在执行阶段通过作用域链的方式去查找他它，这才是使用with性能"不好"，这是指执行效率上的“不好”, 而并不是我们所谓的性能"不好"。 性能一定是我们用户所反馈的性能，页面的加载、动画与操作的流畅度、内存和变量的消耗。所以与其纠结 哪种循环好、哪种循环快、with/eval该不该用，只会让我们编写的代码更纠结，更我们实际所说的性能关系不大。

### underscore中template模板引擎设计

从官方文档中最简单的例子说起

```
var compiled = _.template("hello: <%= name %>");
var html = compiled({name: 'george'}); // hello: george
```

仔细想想，其实就是对模板字符串进行了正则解析，将需要填入数据的位置预留出来，拼接成一个字符串，用 new Function 构造一个方法（动态执行 JavaScript 字符串），方法中有大量的字符串拼接过程，然后将数据代入这个方法，返回我们需要的 HTML 字符串。


#### 三种模板

_.template 支持以下三种模板

```
1. <%  %> - // 执行javascript代码
2. <%= %> - // 变量 
3. <%- %> - // HTML 实体编码，防止 XSS 攻击
```

举个例子:

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<style>
    .last-item {
        color: red;
    }
</style>
<body>
    <div id="box"></div>
    <script src="templateUnderscore.js"></script>
    <script type="text/template" id="tpl">
		<ul class="list">
          <%obj.forEach(function(e, i, a){%>
           <% if(i === 0 ){%>
            <li class="last-item"><%=e.name%></li>
           <% } else if ( i === 1 ) { %>
            <li><%- e.name %>
           <% } else { %>
            <li><%=e.name%></li>
			<%}})%>
		</ul>
  	</script>
    <script>
        var data = [{
			name: "max"
		}, {
			name: "remi"
		}, {
			name: "long"
		}];
        var templateString = document.getElementById("tpl").innerHTML;
		var compiled = _.template(templateString);   //解析
		var renderString = compiled(data);   //数据的交互   render 渲染
		document.querySelector("div").innerHTML = renderString;
    </script>
</body>
</html>
```

将数据用 li 标签循环展示，并且将第一个值实体编码了。

#### 其他功能

_.template 最基础的应用就是这样。

如果你不喜欢它默认的模板风格，也可以自己定义，注意 key 必须和源码中的 key 保持一致，才能覆盖。

_.templateSettings = {
  // 三种渲染模板
  evaluate    : /<%([\s\S]+?)%>/g,
  interpolate : /<%=([\s\S]+?)%>/g,
  escape      : /<%-([\s\S]+?)%>/g
};

比较好的方法是作为 _.template 的第二个参数 settings 传入：

```
var settings = {
  interpolate: /\{\{(.+?)\}\}/g	 // 覆盖 _.templateSettings.interpolate
};

var template = _.template("Hello {{ name }}!", settings);
var ans = template({name: "Mustache"});
console.log(ans); // Hello Mustache!
```

### 预编译

模板引擎一般都带有预编译功能，_.template 也不例外。

什么是预编译？有什么用？

上面的代码有两个痛点：

1. 性能：模板引擎渲染的时候依赖 Function 构造器实现，Function 与 eval、setTimeout、setInterval 一样，提供了使用文本访问 javascript 解析引擎的方法，但这样执行 javascript 的性能非常低下。

2. 调试：由于是动态执行字符串，若遇到错误调试器无法捕获错误源，导致模板 BUG 调试变得异常痛苦。在没有进行容错的引擎中，局部模板若因为数据异常甚至可以导致整个应用崩溃，随着模板的数目增加，维护成本将剧增。

如果我们 JavaScript 代码中直接保存 _.template 的结果，那么以上两个问题就不复存在。而 _.template(jstText).source 则保存了 _.template(jstText) 返回的方法字符串。















