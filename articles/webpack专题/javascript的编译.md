# javascript的编译

###编译es6的语法

编译需要用到的loader, babel-loader只能编译es6的语法，但是对es6的方法它是无能为力，后面介绍处理方法。

```
npm install babel-loader @babel/core --save -dev    => @babel/core是babel-loader的编译核心, babel-loader利用@babel/core去编译的

npm install @babel/preset-env --save-dev  => babel-preset是存储javascript不同标准的插件，通过使用正确的presets,告诉babel按照哪个规范编译
```

babel-preset常见规范:
	1. es2015
	2. es2016
	3. es2017
	4. env (通常采用)
	5. babel-preset-stage

```
module: {
  rules: [
    {
      test: /\.js$/, 
      // use: 'babel-loader'
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {  // target是preset的核心配置，告诉preset编译的具体目标
                browsers: ['>1%']
              }
            }]
          ]
        }
      }
    }
  ]
},
```
target是preset的核心配置，告诉preset编译的具体目标
target可以配置: 
1. 以browsers为目标 (通常情况)
2. 以node的版本为目标
3. 以特定的浏览器为目标


###编译es6的具体方法

1. babel-polyfill
2. babel-plugin-transform-runtime  babel-runtime


###babel-polyfill的生效方法
1. 生成一个全局对象(全局垫片)
2. 一般用于项目开发

使用方法:
1. 在使用的js中 import 'babel-polyfill'

```
import 'babel-polyfill';
import bar from './bar';
new Promise(setTimeout(()=> {
  console.log('timeout');
}, 100));
bar();
```

2. 在webpack.config.js中
```
entry: {
  // app: './src/index.js'
  app: ['babel-polyfill', './src/index.js']
},
```

此方法文件的体积会变大，因为它将所有的es6的方法重新以es5的形式又实现了一遍


###babel-plugin-transform-runtime

webpack4中@babel/plugin-transform-runtime  @babel/runtime

1. 生成一个局部对象
2. 一般用户框架开发


可以将对es6的配置都放到.babelrc的文件中

```
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": [">1%"]
      }
    }]
  ],
  "plugins": [
    ["@babel/transform-runtime"]
  ]
}
```

###语法糖的编译

如何编译typescript

1. 安装loader  安装typescript和ts-loader
2. 写入配置文件  在webpack.config.js中写入ts-loader
3. 编写tsconfig.json 类似于.babelrc, ts-loader的额外配置

```
// tsconfig.json

{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5"
  },
  "exclude": ["./node_modules"]
}

```