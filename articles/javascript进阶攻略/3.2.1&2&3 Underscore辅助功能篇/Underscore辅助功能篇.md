# Underscore辅助功能篇

### Map-reduce 真值检测函数

源码见详细内容

### indexOf lastIndexOf条件查询-背后索引查询器实现

二分法:

```
var arr = [1,2,3,4,5,6,7,8,9];

var fn = function (obj, value) {
    var low = 0, high = obj.length, mid;
    while(low < high) {
        mid = Math.floor((low + high) / 2);
        if (arr[mid] < value) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}

fn(arr, 8);

```

### 乱序数组 - 洗牌算法

洗牌算法又叫抽样函数 

_.sample

```
// 获取随机数
_.random = function(min, max) {
    if (max == null) {
    max = min;
    min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
};


_.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      // 互相交换值
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };
```







