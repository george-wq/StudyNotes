# webpack-dev-server

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

source-map为了方便调试,我需要知道打包后的代码对应原文件的位置

```
devtool: "eval-source-map"
```

开发模式
eval
eval-source-map
cheap-eval-source-map
cheap-module-source-map

生产模式
source-map
hidden-source-map
nosource-source-map

Dev-server利用express和一个中间件webpack-dev-middleware来开启服务，然后开启的server会执行打包出来的代码。
