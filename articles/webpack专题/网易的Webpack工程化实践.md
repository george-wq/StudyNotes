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

# 创建Plugin
暴露出去类 =>  配置文件实例化 => 收集插件注册 => 调用里面的apply ＝》设置生命周期里的监听

node 建立在一个监听下

打包完成，即将输出
compiler.hooks.emit

done已经输出为dist目录
compiler.hooks.done

class myPlugin {
    construtor(options){
        this.options = options || {
            // 默认配置
        }
    }

    apply(complier) {
        // complier.options  config配置
        // complier.context  项目的绝对路径
        complier.hooks.emit.tap('myplugins', function(compilation) {
            // 每一个周期的compilation都不一样
        })
    }
}