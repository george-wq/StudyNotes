# webpack的核心概念

##配置文件的重要性

1. 配置文件是webpack八宝的依据，webpack如何打包，打包成什么样，全都由配置文件来指定。
2. 对于webpack，我们的主要工作也是编写、修改webpack的配置文件。

##核心概念
1. Entry、output
2. loader
3. plugin

###Entry是webpack的的打包入口:
1. 代码从这开始编译
2. 程序开始的起点

```
module.exports = {
  // entry: './app.js' => 单入口
  // entry: ['./app.js', './app2.js'] => 指定app和app2同时为我们的入口文件
  entry: { 可配置一个或者多个(多个于上面数组的区别是上面还是打包成一个文件，下面是多页面的入口方式)
    app: './app.js',
    app2: './app2.js'
  }
}
```

output是webpack的打包出口：
	1. 最终打包结果会根据output的定义输出
	2. 会影响到资源的路径

```
module.exports = {
  entery: {
    app: './app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist')  => 绝对路径
    // path: __dirname + '/src/mybundle', => 绝对路径 src/mybundle下
    filename: '[name].[hash:4][id].js'  => 文件名定义(也可以配置'js/[name]...',相当于dist文件夹下的js文件夹)
  }
}
```

###loader

loader是webpack的编译方法
webpack自身只能处理javascript，所以对于别的资源需要loader
webpack自身只能负责打包，相关的编译等操作，需要loader
loader本质是一个方法，使用时大多需要额外安装

```
module: {
  rules: [
    {
      test: /\.js$/, 
      use: 'babel-loader'
    }
  ]
}
```

常用loader：
css-loader style-loader css处理loader
url-loader image-loader 等图片字体文件等资源处理loader
less-loader sass-loader babel-less-loader等编译loader
语法糖的loader，比如vue-loader ts-loader

###plugin

plugin是webpack的额外扩展:
一些插件式的额外功能由plugin定义，帮助webpack优化代码，提供功能
plugin由的是webpack自带的，也有需要额外安装的

```
plugins: [
  new webpack.HotModuleReplacementPlugin()
]
```

常用的plugin:
commonsChunkPlugin(提取公共模块)、uglifyjsWebpackPlugin(js体积压缩)、PurifyCSS(css体积优化)等优化文件体积的插件
HtmlWebpackPlugin(生成html并且打包结果自动引入html)、HotModuleReplacementPlugin等额外功能插件




