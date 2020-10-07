# doctype的作用是什么？✨

1.文档类型定义
DOCTYPE是html5标准网页声明，且必须声明在HTML文档的第一行。来告知浏览器的解析器用什么文档标准解析这个文档，不同的渲染模式会影响到浏览器对于 CSS 代码甚至 JavaScript 脚本的解析

2、两种呈现模式：标准模式和怪异模式
文档解析类型有：
BackCompat：怪异模式，浏览器使用自己的怪异模式解析渲染页面。（如果没有声明DOCTYPE，默认就是这个模式）
CSS1Compat：标准模式，浏览器使用W3C的标准解析渲染页面。

两种产生的原因是因为各个浏览器对页面的渲染上存在差异，甚至在同一浏览器不同版本中，对页面的渲染也不相同，在w3c标准出台之前，浏览器对页面的渲染上没有统一规范，产生了差异(quirks mode)，在w3c标准推出后，浏览器渲染页面有了统一的标准（strict mode），这是两者最基本的区别。
火狐一直是标准模式，所以呈现效果差别不大，但在ie（6,7,8）中，标准模式和混杂模式的差别很大，主要体现在对盒模型的解释上。


# HTML、XHTML、XML有什么区别?
HTML(超文本标记语言): 在html4.0之前HTML先有实现再有标准，导致HTML非常混乱和松散

XML(可扩展标记语言): 主要用于存储数据和结构，可扩展，大家熟悉的JSON也是相似的作用，但是更加轻量高效，所以XML现在市场越来越小了

XHTML(可扩展超文本标记语言): 基于上面两者而来，W3C为了解决HTML混乱问题而生，并基于此诞生了HTML5，开头加入<!DOCTYPE html>的做法因此而来，如果不加就是兼容混乱的HTML，加了就是标准模式。
1. XHTML 元素必须被正确地嵌套。
2. XHTML 元素必须被关闭。
3. 标签名必须用小写字母。
4. XHTML 文档必须拥有根元素。


# 浏览器乱码的原因是什么？如何解决？
乱码产生的根本原因是保存的编码格式和浏览器解析时的解码格式不匹配导致的。
解决方式： 写代码的时候在html 的 <head>里添加<meta charset='xxx'>并且保存的时候仍选择同样的编码方式。

# 常见的浏览器有哪些？什么内核？
Internet explorer 使用的是Trident
Firefox使用的是Gecko。
opera之前使用的是Presto，后来用Blink
苹果的Safari，谷歌的Chrome使用的是WebKit，还有国产的大部分双核浏览器其中一核就是WebKit。

 
# 什么是data-属性？
HTML的数据属性，用于将数据储存于标准的HTML元素中作为额外信息,我们可以通过js访问并操作它，来达到操作数据的目的。

```
<article
  id="electriccars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
...
</article>
```

# 你对HTML语义化的理解？✨
语义化是指使用恰当语义的html标签，让页面具有良好的结构与含义，比如<p>标签就代表段落，<article>代表正文内容等等。

语义化的好处主要有两点：
1. 开发者友好：使用语义类标签增强了可读性，开发者也能够清晰地看出网页的结构，也更为便于团队的开发和维护
2. 机器友好：带有语义的文字表现力丰富，更适合搜索引擎的爬虫爬取有效信息，语义类还可以支持读屏软件，根据文章可以自动生成目录


# HTML5与HTML4的不同之处?
文件类型声明（<!DOCTYPE>）仅有一型：<!DOCTYPE HTML>。
新的解析顺序：不再基于SGML。
新的元素：section, video, progress, nav, meter, time, aside, canvas, command, datalist, details, embed, figcaption, figure, footer, header, hgroup, keygen, mark, output, rp, rt, ruby, source, summary, wbr。
input元素的新类型：date, email, url等等。
新的属性：ping（用于a与area）, charset（用于meta）, async（用于script）。
全域属性：id, tabindex, repeat。
新的全域属性：contenteditable, contextmenu, draggable, dropzone, hidden, spellcheck。
移除元素：acronym, applet, basefont, big, center, dir, font, frame, frameset, isindex, noframes, strike, tt


# 有哪些常用的meta标签？
meta标签由name和content两个属性来定义，来描述一个HTML网页文档的元信息，例如作者、日期和时间、网页描述、关键词、页面刷新等，除了一些http标准规定了一些name作为大家使用的共识，开发者也可以自定义name。

charset，用于描述HTML文档的编码形式
><meta charset="UTF-8" >

http-equiv，顾名思义，相当于http的文件头作用,比如下面的代码就可以设置http的缓存过期日期
>＜meta http-equiv="expires" content="Wed, 20 Jun 2019 22:33:00 GMT"＞

viewport，移动前端最熟悉不过，Web开发人员可以控制视口的大小和比例
><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

apple-mobile-web-app-status-bar-style,开发过PWA应用的开发者应该很熟悉，为了自定义苹果工具栏的颜色。
><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">


# src和href的区别？
1. src是指向外部资源的位置，指向的内容会嵌入到文档中当前标签所在的位置，在请求src资源时会将其指向的资源下载并应用到文档内，如js脚本，img图片和frame等元素。当浏览器解析到该元素时，会暂停其他资源的下载和处理，知道将该资源加载、编译、执行完毕，所以一般js脚本会放在底部而不是头部。

2. href是指向网络资源所在位置（的超链接），用来建立和当前元素或文档之间的连接，当浏览器识别到它他指向的文件时，就会并行下载资源，不会停止对当前文档的处理。


# 知道img的srcset的作用是什么？（追问）
srcset 定义了我们允许浏览器选择的图像集，以及每个图像的大小。

sizes 定义了一组媒体条件（例如屏幕宽度）并且指明当某些媒体条件为真时，什么样的图片尺寸是最佳选择。

参考：https://www.cxymsg.com/guide/htmlBasic.html#src%E5%92%8Chref%E7%9A%84%E5%8C%BA%E5%88%AB%EF%BC%9F


# 还有哪一个标签能起到跟srcset相似作用？（追问）

<picture>元素通过包含零或多个 <source> 元素和一个 <img>元素来为不同的显示/设备场景提供图像版本。浏览器会选择最匹配的子 <source> 元素，如果没有匹配的，就选择 <img> 元素的 src 属性中的URL。然后，所选图像呈现在<img>元素占据的空间中


# script标签中defer和async的区别？✨
script标签存在两个属性，defer和async，因此script标签的使用分为三种情况：

1. <script src="example.js"></script>
没有defer或async属性，浏览器会立即加载并执行相应的脚本。也就是说在渲染script标签之后的文档之前，不等待后续加载的文档元素，读到就开始加载和执行，此举会阻塞后续文档的加载；

2. <script async src="example.js"></script>
有了async属性，表示后续文档的加载和渲染与js脚本的加载和执行是并行进行的，即异步执行；

3. <script defer src="example.js"></script>
有了defer属性，加载后续文档的过程和js脚本的加载(此时仅加载不执行)是并行进行的(异步)，js脚本的执行需要等到文档所有元素解析完成之后，DOMContentLoaded事件触发执行之前。


其中蓝色代表js脚本网络加载时间，红色代表js脚本执行时间，绿色代表html解析。

　　从图中我们可以明确一下几点：

　　1.defer和async在网络加载过程是一致的，都是异步执行的；

　　2.两者的区别在于脚本加载完成之后何时执行，可以看出defer更符合大多数场景对应用脚本加载和执行的要求；

　　3.如果存在多个有defer属性的脚本，那么它们是按照加载顺序执行脚本的；而对于async，它的加载和执行是紧紧挨着的，无论声明顺序如何，只要加载完成就立刻执行，它对于应用脚本用处不大，因为它完全不考虑依赖。

参考： https://www.cxymsg.com/guide/htmlBasic.html#script%E6%A0%87%E7%AD%BE%E4%B8%ADdefer%E5%92%8Casync%E7%9A%84%E5%8C%BA%E5%88%AB%EF%BC%9F%E2%9C%A8　　


# 有几种前端储存的方式？✨

cookies、localstorage、sessionstorage、Web SQL、IndexedDB



# 这些方式的区别是什么？（追问）✨
cookies： 在HTML5标准前本地储存的主要方式，优点是兼容性好，请求头自带cookie方便，缺点是大小只有4k，自动请求头加入cookie浪费流量，每个domain限制20个cookie，使用起来麻烦需要自行封装

localStorage：HTML5加入的以键值对(Key-Value)为标准的方式，优点是操作方便，永久性储存（除非手动删除），大小为5M，兼容IE8+

sessionStorage：与localStorage基本类似，区别是sessionStorage当页面关闭后会被清理，而且与cookie、localStorage不同，他不能在所有同源窗口中共享，是会话级别的储存方式

Web SQL：2010年被W3C废弃的本地数据库数据存储方案，但是主流浏览器（火狐除外）都已经有了相关的实现，web sql类似于SQLite，是真正意义上的关系型数据库，用sql进行操作，当我们用JavaScript时要进行转换，较为繁琐。

IndexedDB： 是被正式纳入HTML5标准的数据库储存方案，它是NoSQL数据库，用键值对进行储存，可以进行快速读取操作，非常适合web场景，同时用JavaScript进行操作会非常方便。
