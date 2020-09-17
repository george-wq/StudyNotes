# webpack打包速度优化

## 打包结果优化

### Chunks与Module

chunks: 即代码块，即webpack把js分割成了几块代码
module：模块，每个文件，即一个模块

### 如何获取可视化的打包结果分析

官方版本

将打包完的json文件放入http://webpack.github.io/analyse/

```
Mac: webpack --profile --json > state.json
Windows: webpack --profile --json | Out-file 'state.json' -Encoding OEM
```

社区版本

webpack-bundle-analyzer


### 有哪些可以优化的点

项目本身

1. 减少依赖嵌套深度
2. 使用尽可能少的处理

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
2. 通过include减少loader范围
3. HappyPack
开启多进程去打包,但是如果打包文件不多，可能会适得其反，因为开启多线程也会有消耗
4. uglifty优化
开启压缩缓存，webpack4中已经被移除
5. 减少resolve，sourcemap，cache-loader，用新版本的node和webpack
对优化作用不是很大


### 长缓存优化

长缓存是指浏览器对图片、js、css进行一个缓存,第一次请求了，下次就不会请求了,所以hash值至关重要。
output中filename中一般使用hash值，主要是供浏览器识别，为了刷新缓存

解决方案

1. 把hash改为chunkhash:
output中filename hash改为chunkhash, chunk代表一个module，只有module内容改变了才会改变
2. 引入NamedChunksPlugin和NamedMoudlesPlugin插件
把根据chunk的id改成name, 因为有可能在文件中改变了chunk(module)的引入顺序也会改变chunk的id,但是name不会变
3. mini-css-extract-plugin
因为extract-css-plugin不支持hash命名,而上面css插件支持, 可在mini-css-extract-plugin插件参数filename中使用hash





