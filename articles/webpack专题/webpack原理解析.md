# webpack原理解析

Webpack是用什么打包的
Webpack依赖于Node的环境与文件操作系统
Webpack的打包过程，其实就是利用Node去读取文件，然后进行一些字符串处理后，再利用Node去写入文件

Webpack打包流程解析
读取配置文件
注册内部插件与配置插件
Loader编译
组织模块
生成最终文件导出

Loader的原理

Loader其实是一个方法：接受一个字符串，方法内部处理完后再返回字符串。
module.exports = function(source) {
	return source
}

结果文件分析

```
(function(modules) {
	function _webpack_require(moduleId){}
	return 
		__webpack.require(
			_-webpack_require__.s = '.app.js'
		)
})({
	'./app.js': (function(){}),
	'mode1.js': (function(){}),
	'mode2.js': (function(){}),
})
=> Module1.js  如果有Module2引入，也不会加载了
{
  "app.js": function(){},
  "module1.js": function(){}
}
"app.js": function(){}

=> Module2.js
{
  "app.js": function(){},
  "module2.js": function(){}
}
```

  
热更新原理

1. 开启一个服务
2. 建立一个websocket链接
3. 发生代码改变，服务通过websocket通知客户端
4. 客户端替换新代码

