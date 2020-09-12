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
语法糖的loader，比如vue-loader ts-loader


# 常用的plugin
commonsChunkPlugin(提取公共模块)、uglifyjsWebpackPlugin(js体积压缩)、PurifyCSS(css体积优化)等优化文件体积的插件
HtmlWebpackPlugin(生成html并且打包结果自动引入html)、HotModuleReplacementPlugin等额外功能插件


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

