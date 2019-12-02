# css的编译

Webpack是以js文件为入口打包的，那么项目中的css怎么办?如何引入css?

css可以通过js文件引入，但必须使用相应的loader
	1. CSS-loader，让css可以被js正确的引入
	2. style-loader，让css被引入后可以被正确的以一个style标签插入页面
	3. 两者的顺序很重要，要先经过css-loader处理，再由style-loader处理。

style-loader的核心配置

insertAt 	Style标签插入在哪个区域
insertInto	出入指定的dom
singleton	是否合并为一个style标签
transform	在浏览器环境下，插入style到页面前，用js对css进行操作

ps: 在最新的webpack版本中(4.41.2)已经改变了 api
injectType:
1. styleTag  // 默认，使用style标签
2. singletonStyleTag // 合成一个style标签
3. lazyStyleTag
4. lazySingletonStyleTag
5. linkTag


css-loader的核心配置

minimize 是否压缩css  webpack4中被移除
modules 是否使用css模块化
```
modules: {
  localIdentName: '[path][name]_[local]_[hash:4]'
}
``` 
alias css中全局别名 webpack4中被移除


### less,sass 

1. less，sass是css预处理语言，用来帮助我们更方便的写css。
2. less,sass浏览器是无法直接识别，需要变异成css才能被识别,所以我们用less，sass写的文件都要编译。

less
1. less
2. less-loader

sass
1. sass-loader
2. node-sass

注意：less-loader 和 sass-loader需要放在最后后面，顺序很重要

### 提取css代码
如何把css提取为单独的文件
	1. 安装对应的插件 extract-text-webpack-plugin
	2. 改造loader写法 把use改为使用extract-text-webpack-plugin
	3. 在plugin处添加 把extract-text-webpack-plugin加入到plugin里
	
在webpack4中 npm install extract-text-webpack-plugin@next --save
在webpack3中 npm install extract-text-webpack-plugin --save
此插件依赖局部的webpack 所以需要局部也安装webpack

postcss-loader