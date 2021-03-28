# Web Server的构成

## Web Server的构成
+ 处理HTTP
+ 路由处理
+ 静态资源托管: 对网络请求资源进行响应或使用模版动态响应请求
+ 文件数据存储: 将请求携带的数据存储到文件或者数据库中

## Web Server的基本架构
Client  =>  Web Server  =>  Database

Client  =>  Web Server  =>  Application Servers(微服务) => Database

## Nodejs作为 Web Server 优势
+ 并发性能优异: 基于事件驱动的服务在响应请求的场景中有极高的并发性能表现
+ javaScript同构: 减少学习成本，使用最流行的JavaScript或其他可编译／转换为JavaScript的语言均可实现
+ 生态活跃完善: npm提供了数十万个可重用的工具包，还提供了一流的依赖解决方案，可实现自动化工具链构建
+ 代码可移植: 兼容各种操作系统运行环境，一份代码可以运行在多种环境中
+ 框架的高度包容: Node及Node的Web框架都拥有天然的包括性，易于拓展和维护
+ 友好的社区氛围: 丰富的生态诞生了大量的开源社区，聚集了众多的优秀开发人员