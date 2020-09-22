参考: https://www.cxymsg.com/guide/jsBasic.html

# CSS选择器的优先级是怎样的？✨

CSS选择器的优先级是：内联 > ID选择器 > 类选择器 > 标签选择器

到具体的计算层面，优先级是由 A 、B、C、D 的值来决定的，其中它们的值计算规则如下：

A 的值等于 1 的前提是存在内联样式, 否则 A = 0;
B 的值等于 ID选择器 出现的次数;
C 的值等于 类选择器 和 属性选择器 和 伪类 出现的总次数;
D 的值等于 标签选择器 和 伪元素 出现的总次数 。


# link和@import的区别？

一：建议使用link，慎用@import
二：区别
从属关系
1.1 link：link是HTML提供的标签，不仅可以加载CSS，还可以定义rel等属性
1.2 @import：@import是css提供的语法，只有导入样式表的作用

加载顺序
2.1  link：link在页面加载时CSS同时被加载
2.2 @import：引入的CSS要等页面加载完毕后再加载

兼容性问题
3.1 link是HTML提供的语法，不存在兼容性问题
3.2 @import是css2.1提供的语法，ie5以上才兼容

DOM可控性
js控制DOM时，可以通过插入link标签来改变样式，不能通过@import改变

权重问题（有争议）
link标签引入的样式权重大于@import标签

>ps: Link中rel属性的 "stylesheet" 值得到了所有浏览器的支持。其他值只得到了部分地支持。

# 有哪些方式（CSS）可以隐藏页面元素？

opacity:0：本质上是将元素的透明度将为0，就看起来隐藏了，但是依然占据空间且可以交互
visibility:hidden: 与上一个方法类似的效果，占据空间，但是不可以交互了
overflow:hidden: 这个只隐藏元素溢出的部分，但是占据空间且不可交互
display:none: 这个是彻底隐藏了元素，元素从文档流中消失，既不占据空间也不交互，也不影响布局
z-index:-9999: 原理是将层级放到底部，这样就被覆盖了，看起来隐藏了
transform: scale(0,0): 平面变换，将元素缩放为0，但是依然占据空间，但不可交互


# em\px\rem区别？

px：绝对单位，页面按精确像素展示。

em：相对单位，基准点为父节点字体的大小，如果自身定义了font-size按自身来计算（浏览器默认字体是16px），整个页面内1em不是一个固定的值。例如，父级元素字体大小为13px,10em将等同于130px,即13x10 = 130px。

rem：相对单位，可理解为”root em”, 相对根节点html的字体大小来计算，CSS3新加属性，chrome/firefox/IE9+支持。例如，根元素的字体大小 16px，10rem 将等同于 160px，即 10 x 16 = 160。


# 块级元素水平居中的方法？

1. margin: 0 auto;

```
.center{
    height: 200px;
    width:200px;
    margin:0 auto;
    border:1px solid red;
}
<div class="center">水平居中</div>
```

2. flex布局，目前主流方法

```
.center{
    display:flex;
    justify-content:center;
}
<div class="center">
    <div class="flex-div">1</div>
    <div class="flex-div">2</div>
</div>
```

3. CSS3中新增的transform 
```
.son{
    position:absolute;
    left:50%;
    transform:translate(-50%,0);
}
```

4. 使用绝对定位方式
```
.son{
    position:absolute;
    width:固定;
    left:50%;
    margin-left:-0.5宽度;
}
```

参考: https://louiszhai.github.io/2016/03/12/css-center/

# 块级元素，行内块级元素，内联元素？
