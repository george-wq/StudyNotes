# webpack的核心概念

1. Entry: 入口，webpack执行构建的第一步将从Entry开始，可抽象成输入。
2. Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
3. Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
4. Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
5. Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
6. Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。

Webpack 启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module。 每找到一个 Module， 就会根据配置的 Loader 去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。最后 Webpack 会把所有 Chunk 转换成文件输出。 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。


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

# 常用的loader

css-loader style-loader css处理loader
url-loader image-loader 等图片字体文件等资源处理loader
less-loader sass-loader babel-less-loader等编译loader
语法糖的loader，比如vue-loader ts-loader

# 常用的plugin

commonsChunkPlugin(提取公共模块)、uglifyjsWebpackPlugin(js体积压缩)、PurifyCSS(css体积优化)等优化文件体积的插件
HtmlWebpackPlugin(生成html并且打包结果自动引入html)、HotModuleReplacementPlugin等额外功能插件

