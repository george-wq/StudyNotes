# 网易的Webpack工程化实践

### plugins

webpack.DefinePlugin   定义全局变量
webpack.NoEmitOnErrorsPlugin 屏蔽错误
webpack.ProviderPlugin 提供全局的模块
copy-webpack-plugin 提供静态拷贝


### 项目问题解决

不要把webpack当成配置当配置，当成一个程序。

解决方案

如果对模块内容进行处理
Loader是第一解决方案

如果要增加一些特殊的功能
可以自定义增加插件

项目的打包简化，可变性配置等
通过编写相应的操作函数

