参考: https://www.cxymsg.com/guide/jsBasic.html

# CSS选择器的优先级是怎样的？✨

CSS选择器的优先级是：内联 > ID选择器 > 类选择器 > 标签选择器

到具体的计算层面，优先级是由 A 、B、C、D 的值来决定的，其中它们的值计算规则如下：

A 的值等于 1 的前提是存在内联样式, 否则 A = 0;
B 的值等于 ID选择器 出现的次数;
C 的值等于 类选择器 和 属性选择器 和 伪类 出现的总次数;
D 的值等于 标签选择器 和 伪元素 出现的总次数 。

参考: https://www.cxymsg.com/guide/jsBasic.html

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

参考: https://www.cxymsg.com/guide/jsBasic.html

# 有哪些方式（CSS）可以隐藏页面元素？

opacity:0：本质上是将元素的透明度将为0，就看起来隐藏了，但是依然占据空间且可以交互
visibility:hidden: 与上一个方法类似的效果，占据空间，但是不可以交互了
overflow:hidden: 这个只隐藏元素溢出的部分，但是占据空间且不可交互
display:none: 这个是彻底隐藏了元素，元素从文档流中消失，既不占据空间也不交互，也不影响布局
z-index:-9999: 原理是将层级放到底部，这样就被覆盖了，看起来隐藏了
transform: scale(0,0): 平面变换，将元素缩放为0，但是依然占据空间，但不可交互

参考: https://www.cxymsg.com/guide/jsBasic.html

# em\px\rem区别？

px：绝对单位，页面按精确像素展示。

em：相对单位，基准点为父节点字体的大小，如果自身定义了font-size按自身来计算（浏览器默认字体是16px），整个页面内1em不是一个固定的值。例如，父级元素字体大小为13px,10em将等同于130px,即13x10 = 130px。

rem：相对单位，可理解为”root em”, 相对根节点html的字体大小来计算，CSS3新加属性，chrome/firefox/IE9+支持。例如，根元素的字体大小 16px，10rem 将等同于 160px，即 10 x 16 = 160。

参考: https://www.cxymsg.com/guide/jsBasic.html

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
1、display：block将元素显示为块级元素，从而可以更好地操控元素的宽高，以及内外边距，每一个块级元素都是从新的一行开始。

2、display : inline将元素显示为行内元素，高度，行高以及底边距不可改变，高度就是内容文字或者图片的宽度，不可以改变。多个相邻的行内元素排在同一行里，知道页面一行排列不下，才会换新的一行。

3、display：inline-block看上去值名inline-block是一个混合产物，实际上确是如此，将元素显示为行内块状元素，设置该属性后，其他的行内块级元素会排列在同一行。比如我们li元素一个inline-block，使其既有block的宽度高度特性，又有inline的同行特性，在同一行内有不同高度内容的元素时，通常要设置对齐方式如vertical-align: top;来使元素顶部对齐。

# CSS有几种定位方式 (position) ？

tatic: 正常文档流定位，此时 top, right, bottom, left 和 z-index 属性无效，块级元素从上往下纵向排布，行级元素从左向右排列。

relative：相对定位，此时的『相对』是相对于正常文档流的位置。

absolute：相对于最近的非 static 定位祖先元素的偏移，来确定元素位置，比如一个绝对定位元素它的父级、和祖父级元素都为relative，它会相对他的父级而产生偏移。

fixed：指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变，比如那种回到顶部的按钮一般都是用此定位方式。

sticky：粘性定位，特性近似于relative和fixed的合体，其在实际应用中的近似效果就是IOS通讯录滚动的时候的『顶屁股』。

参考: https://louiszhai.github.io/2016/03/12/css-center/


# 如何理解z-index？✨

CSS 中的z-index属性控制重叠元素的垂直叠加顺序，默认元素的z-index为0，我们可以修改z-index来控制元素的图层位置，而且z-index只能影响设置了position值的元素。


# 如何理解层叠上下文？✨

层叠上下文(stacking context)，是HTML中一个三维的概念。在CSS2.1规范中，每个盒模型的位置是三维的，分别是平面画布上的X轴，Y轴以及表示层叠的Z轴。一般情况下，元素在页面上沿X轴Y轴平铺，我们察觉不到它们在Z轴上的层叠关系。而一旦元素发生堆叠，这时就能发现某个元素可能覆盖了另一个元素或者被另一个元素覆盖。

如果一个元素含有层叠上下文，(也就是说它是层叠上下文元素)，我们可以理解为这个元素在Z轴上就“高人一等”，最终表现就是它离屏幕观察者更近。

>具象的比喻：你可以把层叠上下文元素理解为理解为该元素当了官，而其他非层叠上下文元素则可以理解为普通群众。凡是“当了官的元素”就比普通元素等级要高，也就是说元素在Z轴上更靠上，更靠近观察者

层叠等级
在同一个层叠上下文中，它描述定义的是该层叠上下文中的层叠上下文元素在Z轴上的上下顺序。
在其他普通元素中，它描述定义的是这些普通元素在Z轴上的上下顺序。

再类比回“层叠上下文”和“层叠等级”，就得出一个结论：

普通元素的层叠等级优先由其所在的层叠上下文决定。
层叠等级的比较只有在当前层叠上下文元素中才有意义。不同层叠上下文中比较层叠等级是没有意义的。

如何产生“层叠上下文”
1. HTML中的根元素<html></html>本身j就具有层叠上下文，称为“根层叠上下文”。
2. 普通元素设置position属性为非static值并设置z-index属性为具体数值，产生层叠上下文。
3. CSS3中的新属性也可以产生层叠上下文。

CSS3中的属性对层叠上下文的影响
1. 父元素的display属性值为flex|inline-flex，子元素z-index属性值不为auto的时候，子元素为层叠上下文元素；
2. 元素的opacity属性值不是1；
3. 元素的transform属性值不是none；
4. 元素mix-blend-mode属性值不是normal`；
5. 元素的filter属性值不是none；
6. 元素的isolation属性值是isolate；
7. will-change指定的属性值为上面任意一个；
8. 元素的-webkit-overflow-scrolling属性值设置为touch

什么是“层叠顺序”
“层叠顺序”(stacking order)表示元素发生层叠时按照特定的顺序规则在Z轴上垂直显示。由此可见，前面所说的“层叠上下文”和“层叠等级”是一种概念，而这里的“层叠顺序”是一种规则。

总结:
1、首先先看要比较的两个元素是否处于同一个层叠上下文中：       
    1.1如果是，谁的层叠等级大，谁在上面（怎么判断层叠等级大小呢？——看“层叠顺序”图）。       
    1.2如果两个元素不在统一层叠上下文中，请先比较他们所处的层叠上下文的层叠等级。 

2、当两个元素层叠等级相同、层叠顺序相同时，在DOM结构中后面的元素层叠等级在前面元素之上。


参考： https://blog.csdn.net/llll789789/article/details/97562099
