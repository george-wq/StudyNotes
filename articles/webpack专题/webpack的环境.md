# webpack的环境

为什么要区分环境
因为在不同的场景下可能需要不同的配置，使用不同的功能，所以要区分环境

开发模式： 会额外用到一些调试的功能，比如 webpack-dev-server，但是为了加快调试速度，可能不会去压缩，tree-shaking之类的功能
生产模式： 为了减少代码的体积，会使用压缩，tree-shaking等功能，但是不要如webpack-dev-server或者eslint这样的调试工具


列举不同环境
1. production
2. 去除无用代码
3. 图片压缩，转码base64，雪碧图
4. 提取公共代码

development
1. Webpack-dev-server
2. Source-map
3. 代码风格检查


npm install webpack-merge --save-dev

webpack3  编写3个, webpack.dev.js webpack.pro.js webpack.common.js
package.json
"build": "webpack --env production --config webpack.common.js"
"dev": "webpack-dev-server --env development --config webpack.common.js"


webpack4理念： 干掉配置文件，让我们不适用配置文件更舒服的打包
```
webpack --mode production/development/none
```
