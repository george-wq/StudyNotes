# 函数式编程 Underscore源码分析-练习题

以下代码最终会在控制台输出什么？
```
var length = 10;
function fn(){
    console.log(this.length);
}
var obj = {
    length: 5,
    method: function (fn1) {
        arguments[0]();     
    }
};
obj.method(fn, 123);

// 我们知道取对象属于除了点操作符还可以用中括号，所以第二次执行时相当于arguments调用方法，this指向arguments，而这里传了两个参数，故输出arguments长度为2
```

```
var a = 111111111111111110000,   
   b = 2222;   
   a + b;

// 又是一道考查JavaScript数字的题，与第七题考察点相似。由于JavaScript实际上只有一种数字形式IEEE 754标准的64位双精度浮点数，其所能表示的整数范围为-2^53~2^53(包括边界值)。这里的111111111111111110000已经超过了2^53次方，所以会发生精度丢失的情况
```



