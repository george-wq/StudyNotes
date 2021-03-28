# Nodejs常见Web框架

Express     简单，实用，路由中间件等五脏俱全    最著名的框架
Koa         专注于异步流程改进                下一代Web框架
Egg         基于Koa，在开发上有极大的便利       企业级Wwb框架
ThinkJs     面向新特性                      借鉴ThinkPHP，并慢慢走出自己的一条路，长于新特性支持，新版v3.0是基于Koa v2.0的作为内核

# koa简介
Express很简洁，Koa更简洁
Koa应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的
内置优雅的底层中间件处理内容协商，缓存清理，代理支持和重定向等常见任务的方法，开箱即用

# 洋葱模型

# Koa常用插件
koa-static  处理静态文件
koa-router  
koa-session     保持网络请求
koa-bodyparser  处理请求体
koa-compress    压缩响应数据
koa-logger
koa-error

# Koa 与 Express

Koa
更优雅的编程体验
核心轻量，插件生态庞大
内置异步流控制
与Express生态不兼容，有自己的开发生态
入手简单，便于企业级实践

Express
Nodejs至今最流行的框架
提供了Web中间件的标准
简单快捷可拓展
维护成本高，对系统设计能力要求高
学习成本低，入手简单

