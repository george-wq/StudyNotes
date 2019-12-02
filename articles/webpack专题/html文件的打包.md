# html文件的打包

html生成
```
npm install html-webpack-plugin --save-dev
```

相关配置：
filename 打包生成后的html文件的名字
template 制定一个html文件模板
minify 压缩html
inject 是否把js，css文件插入到html，插入到哪
chunks 多入口时，指定引入chunks，（多入口时在html中，引入这里配置的js和css）

使用方法:
```
// webpack.config.js

new htmlWebpackPlugin({
  filename: 'index.html',
  template: './index.html'
})
```
