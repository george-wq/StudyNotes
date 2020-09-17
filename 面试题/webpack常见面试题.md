# webpack的核心概念
1. Entry: 入口，webpack执行构建的第一步将从Entry开始，可抽象成输入。
2. Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
3. Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
4. Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
5. Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
6. Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。

Webpack 启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的 Loader 去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。


# 常用的loader
css-loader style-loader css处理loader
file-loader url-loader image-loader 等图片字体文件等资源处理loader
less-loader sass-loader babel-less-loader等编译loader
语法糖的loader，比如vue-loader ts-loader, eslint-loader


# 常用的plugin
DllPlugin, cleanWebpackPlugin, commonsChunkPlugin(提取公共模块)、MiniCssExtractOlugin, uglifyjsWebpackPlugin(js体积压缩)、PurifyCSS(css体积优化)等优化文件体积的插件
HotModuleReplacementPlugin等额外功能插件
HtmlWebpackPlugin(生成html并且打包结果自动引入打包完的bunder.js, 多页面中要配置多个HtmlWebpackPlugin)





# 如果现在需要引入一种文件，比如.wy类型的文件，那么应该配置loader还是plugins？请说明理由。
使用loader,因为loader是将不同的文件加载到js文件中

```
module: {
    rules: [
      {
        test: /\.wy$/,
        use: {loader: 'wy-loader'}
      }
    ]
  }
```


# 通过npm run build命令打包和直接输入webpack命令打包，有什么区别？
运行npm run build命令，优先使用局部的webpack进行打包，如果没有安装局部的webpack，则会使用全局webpack打包。
直接运行webpack命令，使用的是全局webpack进行打包。

# 请说明Babel-loader，babel-core和babel-preset之间是什么关系？
编译需要用到的loader, babel-loader只能编译es6的语法，但是对es6的方法它是无能为力，后面介绍处理方法。

```
npm install babel-loader @babel/core --save -dev    => @babel/core是babel-loader的编译核心, babel-loader利用@babel/core去编译的

npm install @babel/preset-env --save-dev  => babel-preset是存储javascript不同标准的插件，通过使用正确的presets,告诉babel按照哪个规范编译
```

可以将对es6的配置都放到.babelrc的文件中

```
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": [">1%"]
      }
    }]
  ],
  "plugins": [
    ["@babel/transform-runtime"]
  ]
}
```

babel-preset常见规范:
	1. es2015
	2. es2016
	3. es2017
	4. env (通常采用)
	5. babel-preset-stage

target是preset的核心配置，告诉preset编译的具体目标
target可以配置: 
1. 以browsers为目标 (通常情况)
2. 以node的版本为目标
3. 以特定的浏览器为目标


编译es6的具体方法
1. babel-polyfill
2. babel-plugin-transform-runtime  babel-runtime

babel-polyfill的生效方法
1. 生成一个全局对象(全局垫片)
2. 一般用于项目开发

使用方法:
1. 在使用的js中 import 'babel-polyfill'

```
import 'babel-polyfill';
import bar from './bar';
new Promise(setTimeout(()=> {
  console.log('timeout');
}, 100));
bar();
```

2. 在webpack.config.js中
```
entry: {
  // app: './src/index.js'
  app: ['babel-polyfill', './src/index.js']
},
```

此方法文件的体积会变大，因为它将所有的es6的方法重新以es5的形式又实现了一遍


# 请写一个通用的.babelrc配置，要求能够兼容到ie8
可以将对es6的配置都放到.babelrc的文件中

```
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "ie": 8
      }
    }]
  ],
  "plugins": [
    ["@babel/transform-runtime"]
  ]
}
```

# 请列举编译css所需要用到的loader和它们的顺序。

css可以通过js文件引入，但必须使用相应的loader
1. CSS-loader，让css可以被js正确的引入
2. style-loader，让css被引入后可以被正确的以一个style标签插入页面
3. 两者的顺序很重要，要先经过css-loader处理，再由style-loader处理。

# 尝试写一个具有404页面的webpack-dev-server
webpack-dev-server提供的额外功能
1. 路径重定向
2. 浏览器中显示编译错误
3. 接口代理  解决跨域问题
4. 热更新

常用配置
inline： 服务的开启模式
port: 端口
historyApiFallback： 路径重定向
Hot： 热更新 改变css，页面在不刷新的情况下显示（js也可以做到,但是最好不要，因为页面代码逻辑改变了）
lazy： 懒编译
overlay： 错误遮罩  显示在浏览器页面还是console中
proxy： 代理请求  可以解决开发中接口调用的跨域问题

```
devServer: {
    historyApiFallback: {
      rewrites: [
        from: /.*/g,
        to: '/page/404.html'
      ]
    }
  }
```
### Dev-server利用express和一个中间件webpack－dev－middleware来开启服务，然后开启的server会执行打包出来的代码。


# webpack工作原理
Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
3. 确定入口：根据配置中的 entry 找出所有的入口文件；
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

# 编写loader
Loader的原理：Loader其实是一个方法, 接受一个字符串，方法内部处理完后再返回字符串。

```
module.exports = function(source) {
	return source
}
```

一个 Loader 的职责是单一的，只需要完成一种转换。 如果一个源文件需要经历多步转换才能正常使用，就通过多个 Loader 去转换。 在调用多个 Loader 去转换一个文件时，每个 Loader 会链式的顺序执行， 第一个 Loader 将会拿到需处理的原内容，上一个 Loader 处理后的结果会传给下一个接着处理，最后的 Loader 将处理后的最终结果返回给 Webpack。

# 雪碧图的处理
postcss本身并不具有什么功能，但是有丰富的插件系统支持完成各种功能
1. postcss-sprites，属于postcss-loader的插件，会自动把css文件中引入背景图合成雪碧图，并修改css文件。

```
{
  test:/\.css$/,
  use:extractTextCss.extract({
  fallback:{
      loader:'style-loader',
      options:{
      //insertInto:"#mydiv",
      //transform:"./transform.js"
      }
    },
  use:[
    {
      loader:'css-loader',
      options:{
        /* modules:{
        localIdentName:'[path][name]_[local]_[hash:4]'
        }   */                 
      } 
    },
    {
    loader:"postcss-loader",
    options:{
      plugins:[
        /* require('postcss-sprites')({
          spirtePath:"./dist/assets/sprite"
        })*/
      ]
    }
    }
  ]
  })
},
```

缺点：全程自动定位，1:1定位，但是大部分项目中的图片并不是1:1的，所以定位会不准确。

2. webpack-spritesmith, 属于一个独立的插件，会按照指定的路径的指定图片，生成一个雪碧图和一个雪碧图相关的css，不会修改原css。

```
new webpackSpriteSmith({
  src:{
    //图片来源文件夹
    cwd:path.join(__dirname,"src/assets/img"),
    //处理什么图片
    glob:"*.jpg"
  },
  target:{
    //打包到哪
    image:path.join(__dirname,'dist/sprites/sprite.png'),
    css:path.join(__dirname,'dist/sprites/sprite.css'),
  },
  apiOptions:{
    cssImageRef:"./sprites/sprite.png"
  }
  })
```

# 多入口的实现，区分何时用但入口或者多入口

```
// 多入口的实现, 配置多个HtmlWebpackPlugin，生成多个html并分别引入各自依赖的bunder.js

new HtmlWebpackPlugin({
  filename: 'index.html',
  template: './src/index.html',
  chunks: ['app']
})
new HtmlWebpackPlugin({
  filename: 'index2.html',
  template: './src/index.html',
  chunks: ['app2']
})
```
主要判断项目是需要多html还是单html的来区分。
1. SPA => 单入口
2. MVC, SSR => 多入口


# 如何用webpack来优化前端性能?
用webpack优化前端性能是指优化webpack的输出结果，让打包的最终结果在浏览器运行快速高效。
最主要的核心方案： 代码分割 和 体积优化

1. 代码分割
> 1. 减少加载代码大小
> 2. 提取公共资源，减少加载次数 (从缓存中拿)

### 多页面应用：
提取公共依赖
把几个页面之中都用到的依赖给打包为一个单独文件，以便于第二次加载从缓存中拿。

### 单页面应用：
减少文件体积，拆分应用
把需要异步加载改成异步加载 （动态路由，异步组件） ？？？

### 为了业务代码纯净, 方便对第三方模块的保存
有的时候我们不希望业务代码里混入了第三方代码，或者webpack配置代码
把第三方的代码和webpack配置代码拆分为单独文件 (app.js、vendor.js、manifest.js)

所以一般打包

多页面应用
主业务代码(app.js) + 公共依赖 + 第三方包(vendor.js) + webpack运行代码(manifest.js)

单页面应用
主业务代码(app.js) + 异步模块 + 第三方包(vendor.js) + webpack运行代码(manifest.js)

webpack3: commonChunksPlugin
webpack4: SplitChunksPlugin

optimization 能进行代码 分割，压缩，uglifty
```
optimization: {
  splitChunks: {
    chunks: 'initial', // initial（只对入口文件进行处理）、all(所有模块依赖分析)、async异步
    minSize: 30000, // 大小控制 默认30000 ＝ 30kb， 默认大于30kb的文件进行提取，公共模块大一点提取才有意义，因为会多一个http请求
    
    // 单独指定分割部分代码
    cacheGroups: {
      vendor: {
        test: /([\\/]node_moudles[\\/])/,
        name: 'vendor',
        chunks: 'all'
      }
    },
  },

  runtimeChunk: true  // webpack运行代码 => manifest.js
}
```
2. 体积优化，压缩代码
  webpack3: optimize.UglifyJsPlugin
  webpack4: optimization.minimize => 等同于 mode为production，默认压缩
3. 体积优化, Tree Shaking: 将代码中永远不会走到的片段删除掉
  webpack3: optimize.UglifyJsPlugin
  webpack4: optimization.minimize 指定为 Uglify => 等同于 mode为production，自动tree-shaking
4. 提取公共多个css文件中依赖的css
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

moudle: {
  rules: [
    {
      test: /\.css$/
      use: [
        {
          loader: MiniCssExtractPlugin.loader   // 必须把style-loader替换成 MiniCssExtractPlugin
        },
        {
          loader: 'css-loader',
          options: {}
        }
      ]
    }
  ]
},

plugins: [
  new MiniCssExtractPlugin({
    filename: '[name].css' // 静态的打包名
  })
]
```
5. 利用CDN加速: 在构建过程中，将引用的静态资源路径修改为CDN上对应的路径。 

# Tree Shaking原理
将代码中永远不会走到的片段删除掉

```
import { moudle } from './modulea.js';
 
exports moudle {

}

检测模块a是否使用，没有的话才进行tree shaking

1. 必须建立在模块化的基础之上，jquery，underscore这些自执行函数都没有用。
2. Vue2是不支持Tree－shaking的，Vue3重构后支持了。
```

# 如何提高webpack的打包速度?

一、测量构建时间
优化 webpack 构建速度的第一步是知道将精力集中在哪里。我们可以通过 speed-measure-webpack-plugin 测量你的 webpack 构建期间各个阶段花费的时间：

```
步骤一：安装 speed-measure-webpack-plugin
npm install speed-measure-webpack-plugin --save-dev

复制代码步骤二：配置
// 分析打包时间
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
// ...
module.exports = smp.wrap(prodWebpackConfig)

它能够：
分析整个打包总耗时;
每个插件和 loader 的耗时情况；
```

## 可视化结果： 
官方版本:
Mac： webpack --profile --json > stats.json
Window: webpack --profile --json | Out-file 'stats.json' -Encoding OEM

把json文件上传至下面网址可看到具体分析
http://webpack.github.io/analyse/

社区版本:
webpack－bundle－analyzer
```
const wba = import('webpack-bundle-analyzer').BundleAnalyzerPlugin;

new wba();
```
打包完成后弹出一个分析页面，以chunks来分析。

可参考以下指标：
1）看提取的模块的信息是否正确
2）模块的大小，看是否可以优化
3）打包的速度

项目本身
1. 减少依赖嵌套深度  => 为了减少webpack递归便利处理文件的时间
2. 使用尽可能少的处理 => 为了减少webpack递归便利处理文件的时间

webpack层面
1. Dll处理(通过提取公共依赖)
```
// webpack.dll.js
const webpack=require('webpack');
module.exports={
  entry:{
  	jquery:["jquery"],
  	loadsh:["loadsh"]
  },
  output:{
    path:__dirname+"/src/dll",
    filename:"./[name].js",
    //引用名
    library:'[name]'
  },
  plugins:[
     new webpack.DllPlugin({
      path:__dirname+"/src/dll/[name].json",
      name:"[name]"
     })
  ]  
}

// webpack.config.js
new webpack.DllReferencePlugin({
  manifest:require('./src/dll/jquery.json')
}),
new webpack.DllReferencePlugin({
  manifest:require('./src/dll/loadsh.json')
})

执行命令: webpack --config webpack.dll.js
```
2. 通过include减少loader搜索范围
3. HappyPack 开启多进程去打包,但是如果打包文件不多，可能会适得其反，因为开启多线程也会有消耗
4. uglifty优化 开启压缩缓存，webpack4中已经被移除
5. 减少resolve（解析路径也要耗时间），sourcemap（等级调高会慢），cache-loader（对loader进行缓存），用新版本的 node 和 webpack 对优化作用不是很大
6. 合理利用缓存（缩短连续构建时间，增加初始构建时间）
使用 webpack 缓存的方法有几种，例如使用 cache-loader，HardSourceWebpackPlugin 或 babel-loader 的 cacheDirectory 标志。 所有这些缓存方法都有启动的开销。 重新运行期间在本地节省的时间很大，但是初始（冷）运行实际上会更慢。
如果你的项目生产版本每次都必须进行初始构建的话，缓存会增加构建时间，减慢你的速度。如果不是，那它们就会大大缩减你二次构建的时间。
```
// cache-loader
cache-loader 和 thread-loader 一样，使用起来也很简单，仅仅需要在一些性能开销较大的 loader 之前添加此 loader，以将结果缓存到磁盘里，显著提升二次构建速度。

module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src'),
      },
    ],
  },
};

⚠️ 请注意，保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader。

// HardSourceWebpackPlugin
第一次构建将花费正常的时间
第二次构建将显着加快（大概提升90%的构建速度）。

```

7. 长缓存优化
长缓存是指浏览器对图片、js、css进行一个缓存,第一次请求了，下次就不会请求了,所以hash值至关重要。
output中filename中一般使用hash值，主要是供浏览器识别，为了刷新缓存

解决方案
vendor, 公共依赖插件模块 不需要更改hash，只有app更改时只要改app的hash。
1. 把hash改为chunkhash, output中filename hash改为chunkhash, chunk代表一个module，只有module内容改变了才会改变

2. 引入NamedChunksPlugin和NamedMoudlesPlugin插件, 把根据chunk的id改成name, 因为有可能在文件中改变了chunk(module)的引入顺序也会改变chunk的id,但是name不会变

3. mini-css-extract-plugin, 因为extract-css-plugin不支持hash命名,而上面css插件支持, 可在mini-css-extract-plugin插件参数filename中使用hash

参考： https://juejin.im/post/6844904056985485320

# webpack与grunt、gulp的不同？
Grunt、Gulp是基于任务运行的工具：
它们会自动执行指定的任务，就像流水线，把资源放上去然后通过不同插件进行加工，它们包含活跃的社区，丰富的插件，能方便的打造各种工作流。
Webpack是基于模块化打包的工具:
自动化处理模块,webpack把一切当成模块，当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
因此这是完全不同的两类工具,而现在主流的方式是用npm script代替Grunt、Gulp,npm script同样可以打造任务流.

# 创建Plugin
1. 暴露出去一个类
2. 配置文件实例化 
3. 收集插件注册 
4. 调用里面的apply
5. 监听生命周期里的函数

Compiler 和 Compilation
在开发 Plugin 时最常用的两个对象就是 Compiler 和 Compilation，它们是 Plugin 和 Webpack 之间的桥梁。 Compiler 和 Compilation 的含义如下：

Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；

Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。
Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

// 开始读取 records 之前，钩入(hook into) compiler。
compiler.hooks.run

// 编译(compilation)创建之后，执行插件。
compiler.hooks.compilation

// 打包完成，即将输出
compiler.hooks.emit

// 编译(compilation)完成。
compiler.hooks.done

// output 目录之前这两个时间节点，afterPlugin是在emit之前被触发的，所以输出顺序更靠前
compiler.hooks.afterPlugin

class myPlugin {
    construtor(options){
        this.options = options || {
            // 默认配置
        }
    }

    apply(complier) {
        // complier.options  config配置
        // complier.context  项目的绝对路径
        complier.hooks.emit.tap('myPlugins', function(compilation) {
            // 每一个周期的compilation都不一样
        })
    }
}

# 开启模块热替换
模块热替换技术的优势有：
1).实时预览反应更快，等待时间更短。
2).不刷新浏览器能保留当前网页的运行状态，例如在使用Redux来管理数据的应用中搭配模块热替换能做到代码更新时 Redux 中的数据还保持不变。

1. DevServer 默认不会开启模块热替换模式，要开启该模式，只需在启动时带上参数 --hot，完整命令是 webpack-dev-server --hot。
2. 通过接入Plugin实现, new HotModuleReplacementPlugin()， 设置devServer选项中的hot字段为true
 
 热更新原理
1. webpack-dev-server,通过express和webpack－dev－middleware开启一个服务，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。
2. 通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端。
3. 发生代码改变，服务通过websocket通知客户端
4. 客户端替换新代码


# webpack是如何实现动态导入的
参考： https://juejin.im/post/6844903888319954952


