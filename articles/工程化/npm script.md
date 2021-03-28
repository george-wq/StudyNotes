# 内部变量

问题：输出 the package is xxx@x.x.x
$npm_packahe_*

# 参数

如何对npm scripts二次包装过的命令传参

```
{
    "scripts": {
        "server": "server ./build",
        "server:prod": "npm run server -- -l 80"
    }
}
```

思考：

1. 脚本第一行为什么余姚有 #/usr/bin/env node ?

2. 如果想在一条script里顺序执行两个命令，应该怎么写？

3. 如果想在一条script里并行执行两个命令，应该怎么写？