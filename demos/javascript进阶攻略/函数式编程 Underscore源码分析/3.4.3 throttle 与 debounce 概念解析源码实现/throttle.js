var _ = {};

_.now = Data.now;

_.throttle = function(func, wait, options) {
    var args, now, lastTime = 0, timer = null;
    // 如果options没传 赋值为{}
    if(!options) options = {};

    var later = function() {
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
        // remaining  wait固定值 - (now变化的当前时间 - lastTime)
        var remaining = wait - (now - lastTime);
        console.log(remaining);
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