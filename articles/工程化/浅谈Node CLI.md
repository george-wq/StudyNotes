# 浅谈Node CLI

移动 & 复制
```
mv ./source/a.txt ./target  # 移动
cp ./source/a.txt ./target  ＃ 复制
```

查看log

```
cat         # 查看文件
head -n 10  # 前10行
tail -n 10  # 后10行
```


进程

```
ps # 查看当前用户进程
ps -ax # 查看所有进程

lsof    # 查看打开的网络相关文件   
losof -p 2333   # 查看pid=2333的进程打开的文件

```

kill 
Kill命令实际上并不是在'kill', 本质上是向进程发送信号，例如：kill －s SIGUSRI 34534 实际上可以调试Nodejs应用，因为Nodejs会在收到SIGUSRI时进入调试
优雅退出的原理就是监听SIGTERM信号，并递归地退出子进程。

grep 筛选



