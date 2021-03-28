# Node安装

1. 官网提供的安装包
2. Homebrew，命令行安装全局，手动管理
3. NVM ，推荐使用，管理版本，方便切换

Mac推荐NVM，windows下推荐第一种。

3m安装法

nvm（node version manager）【需要使用npm安装，替代品是yrm（支持yarn）】

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
nvm install --lts
```

nrm（node registry manager）【需要使用npm安装，替代品是yrm（支持yarn）】
npm（node packages manager）【内置，替代品是n或nvs（对win也支持）】


## Nodejs模块机制及包管理器

Nodejs模块机制
1. Node应用由模块组成，采用CJS／ESM模块组成
2. 每个文件就是一个模块，有自己的作用域
3. 在一个文件内定义的变量，函数，类，都是私有的，对其他文件不可见
4. 在Node中，模块加载时同步的
5. 模块可以多次加载，但是只会在第一次加载时运行，然后运行结果就被缓存了

Nodejs模块加载机制require/export
1. 缓存中存在了，直接返回
2. 内置模块，则直接加载
3. 根据找到的文件创建新模块并缓存

Nodejs包管理器 npm
1. npm代指Node的模块生态，又代指模块安装CLI工具
2. 通过package.json来描述项目的基本信息和依赖，组成树状结构
3. 使用nvm管理node版本，使用nrm管理npm源，使用npx执行命令

## Nodejs数据类型
Buffer
1. 流式数据（非一次性加载完成数据）由于产生和使用不一定同速，所以需要缓冲区
2. 存储需要临时占用大量数据，内存中开辟的一片区域，用于存放二进制数据
3. 流的生产者和消费者之间的速度通常是不一致的，因此需要buffer来暂存一些数据
4. buffer大小通过highWaterMark参数指定，默认情况下是16KB

多个data组成一个buffer，一个完整的buffer形成一个chunk，最后发送出去。

创建buffer
Buffer.from(buffer|array|string)  使用堆外内存新增Buffer  
Buffer.alloc(size)  指定一个大小的Buffer，默认为0
流式数据会自动创建Buffer，手动创建buffer需要谨慎
绕开V8回收机制，使用专用回收机制，提升性能和内存使用效率，但这种玩法会导致未初始化的数据块投入使用，造成内存泄漏风险
转换格式：Buffer.from(string), buf.toString(), buf.toJSON()

Stream
1. Stream模块提供的是抽象接口，有很多模块实现了这个接口
2. Stream就是解决生产者和消费者问题的一种方式，解决异步IO问题
3. Stream模块对于流的使用者而言无需关心 readableSrc.pipe(writableDest)

Event/EventEmitter

Error
1. 错误类型
2. 错误冒泡和捕获

URL
1. 弃用urlObject，改成WHATWG URL
2. 使用URLSearchParams操作参数

Nodejs全局变量－global
1. 存在模块的作用域中
__dirname, __filename, exports, module, require()
2. 从js继承而来的全局变量
console, timer全家桶, global(容器)
3. Nodejs特有的全局变量
Buffer, process, URL, WebAssembly

# Nodejs工具库-util
1. 风格转换
promisify <=> callbackify, TextEncoder <=> TextDecoter
2. 调试工具
debuglog, inspect, format, getSystemErrorName
3. 类型判断 
type.isDate(value)

querystring 官方提供的解析和格式化URL查询字符串的实用工具

参考: https://i5ting.github.io/How-to-learn-node-correctly/#1090201


