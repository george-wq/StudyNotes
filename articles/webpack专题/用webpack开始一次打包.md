#用webpack开始一次打包

###不利用配置文件打包

```
webpack-cli --entry <entry> --output <output>
```

打包过程： 将所有的依赖都合并成一个打包结果js


###利用配置文件打包

```
// webpack.config.js
const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // path: __dirname + '/src/mybundle',
    filename: 'js/[name].[hash:4].js'
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/, 
      //   use: 'babel-loader'
      // }
    ]
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin()
  ]
};
```

```
webpack
```
直接以当前目录下的名为webpack.config.js文件作为配置文件进行打包


```
webpack --config configfile
```
指定一个文件作为配置文件打包


直接在命令行中使用webpack打包是使用全局webpack打包
在package.json文件中进行配置是优先局部webpack打包，如若没有则使用全局webpack
