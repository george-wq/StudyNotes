var _ = {};

_.now = Date.now;

_.debounce = function(func, wait, immediate) {
    var lastTime, timer, args;

    var later = function() {
        var last = _.now() - lastTime;
        console.log(last);
        // 调用间隔小于wait
        if (last < wait) {
            // console.log(wait - last);
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