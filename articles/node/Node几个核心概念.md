# Nodejs的模块机制－CommonJs
模块的引用
通过require(module)来引用module

模块的定义
通过挂载在module.exports对象上实现定义

模块的标识
通过路径标识引入的是哪个模块

require需要以下几步
路径分析    =>  文件定位   =>   编译执行    =>  加入缓存

## 路径分析
+ 内置模块
在Node进程开始的时候就预加载了
加载的是二进制文件，无需定位和编译

+ 文件模块
通过NPM安装的第三方模块
本地模块

+ 模块内容
函数，对象，属性，如函数，数组活着任意类型的JS对象


## 模块加载优先级
已缓存模块   ＝>   内置模块  =>  文件模块  =>  文件目录模块  =>  node_modules模块

## 模块文件定位
拓展名判断  (.js文件 .json文件  .node文件)   
解析package.json  (解析为对象，读取main指定的路径)  
查找入口文件   (将index作为默认值, 查看index.js, index.json, index.node)
进入下一个模块路径  (在父目录中重复以上逻辑, 轮询后依旧失败则报错)

## 模块编译执行
+ .js
通过fs模块同步读取后编译执行，未识别类型也会当做js处理

+ .json
通过fs模块同步读取后，用JSON.parse()解析并返回结果

+ .node
这是用C/C++写的拓展文件，通过process.dllopen()方法加载最后编译生成的


## 模块js文件的编译
+ 注入全局变量
以参数形式，注入module/exports/require方法
同时注入路径解析时得到的__firename/__dirname

+ 构造上下文执行环境
闭包产生作用域，通过runInThisContext()执行
将function对象挂载到exports对象上，并导出

## 加入缓存以及清除缓存

核心模块
登记在NativeModule._cache上

文件模块
封装后的方法以字符串形式存储，等待调用

清除缓存
通过delete require.cache[require.resolve(module)]

## require & import

+ require
commonJS规范
动态加载模块
调用的时候加载源码
加载全部代码

+ import
ES6的规范
静态加载模块
编译的时候执行代码
缓存执行结果
按需引入,节省内存

## 多进程 vs 多线程

纬度            多进程              
数据共享        数据共享需要IPC，数据分开的同步简单
资源利用        占用没存多，切换复杂
性能开销
编码实践
可靠性
分布式支持

参考： https://juejin.cn/post/6844903908385488903

