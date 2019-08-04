# underscore中 throttle && debounce 概念解析与源码解析

只要在涉及到连续事件或频率控制相关的应用都可以考虑到这两个函数,比如:
+ 游戏射击，keydown事件
+ 文本输入、自动完成、keyup事件
+ 鼠标移动、mousemove事件
+ DOM元素定位，window对象的 resize 和 scroll 事件

前两者 throttle 和 debounce 都可以按需求使用; 后两者肯定是用throttle的了。


节流(throttle)是创建并返回一个像节流阀一样的函数，当重复调用函数的时候，至少每隔 wait毫秒调用一次该函数。对于想控制一些触发频率较高的事件有帮助

节流(throttle)特点和使用方法: 

1. 一次触发function会调用2次 (立即执行、wait之后调用)

2. 调用两次: 首次执行 和 等待wait秒后再次执行时, 其中如果是连续执行并不会都是执行两次 

3. _.throttle(function, wait, [options])

4. function 处理函数、wait 等待的时间、options 配置

5. options: {leading: false} 禁用 第一次执行

6. options: {trailing: false} 禁用 wait之后执行

```
// html
<div style="height:500px"></div>

var throttled = _.throttle(function() {
    console.log('hello throttle !');
}, 1500);

window.onscroll = throttled;
```

```
// throttle.js

var _ = {};

_.now = Data.now;

_.throttle = function(func, wait, options) {
    var args, now, lastTime = 0, timer = null;
    // 如果options没传 赋值为{}
    if(!options) options = {};
    // 延迟函数
    var later = function() {
        // 判断是否 leading === false
        lastTime = options.leading === false ? 0 : _.now();
        timer = null;
        func.apply(null, args);
    }

    return function() {
        args = arguments;
        now  = _.now();
        
        // 首次执行 !lastTime === true && options.leading定义为false时
        if (!lastTime && options.leading === false) {
            lastTime = now;
        }
        // remaining  wait固定值 - (now 变化的当前时间 - lastTime)
        var remaining = wait - (now - lastTime);
        console.log(remaining); // remaining 依次变大
        if (remaining <= 0) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            // 重置lastTime, 使remaining持续wait时间的正数
            lastTime = now;
            func.apply(null, args);
        } else if (!timer && options.trailing !== false) {
            timer = setTimeout(later, remaining);
        }
    }
}

```

防抖(debounce)是返回 function 函数的防反跳版本, 将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后. 对于必须在一些输入（多是一些用户操作）停止到达之后执行的行为有帮助。 例如: 渲染一个Markdown格式的评论预览, 当窗口停止改变大小之后重新计算布局, 等等.

防抖(debounce)特点和使用方法: 

1. 两次调用函数之间间隔小于wait,不会执行

2. _.debounce(function, wait, [immediate]) 

3. function 处理函数、wait 等待的时间、immediate 参数

4. immediate: true 立即调用处理函数

5. immediate: false 等待wait后执行处理函数

```
// html
<div style="height:500px"></div>

var debounced = _.debounce(function() {
    console.log('hello debounce !');
}, 1500);

window.onscroll = debounced;
```

```
// debounce.js

var _ = {};

_.now = Date.now;

_.debounce = function(func, wait, immediate) {
    var lastTime, timer, args;

    var later = function() {
        var last = _.now() - lastTime;
        console.log(last);
        // 调用间隔小于wait
        if (last < wait) {
            timer = setTimeout(later, wait - last);
        } else {
            // 间隔大于wait
            timer = null;
            if (!immediate) {
                func.apply(null, args);
            }
        } 
    }
    return function() {
        // 调用时间执行
        lastTime = _.now();
        args = arguments;
        // callNow 是否立即执行
        var callNow = immediate && !timer;
        // 首次进来、later中func执行完后再次调用也会执行
        if (!timer) {
            timer = setTimeout(later, wait);
        }
        // 立即执行
        if (callNow) {
            func.apply(null, args);
        }
    }
}
```

总结: 
1. 节流: remaining 逐步增大, 首次执行和等待wait秒后再次执行时, 其中如果是连续执行并不会都是执行两次, 例如: 固定间隔wait后调用函数 wait = 1500ms

```
时间戳    0  1500  3000  4500  6000
函数调用  1  2     3     4     5
```

2. 防抖: 两次调用函数之间间隔了wait, 然后调用函数, 例如: wait = 1500ms

```
时间戳       0                 500                   1200                3000              3500 
用户调用函数  1                 2                     3                   4                 5   
函数调用     500 < 1500(不调用)    700 < 1500(不调用)    1800 > 1500(调用)     500 < 1500(不调用)   
```

