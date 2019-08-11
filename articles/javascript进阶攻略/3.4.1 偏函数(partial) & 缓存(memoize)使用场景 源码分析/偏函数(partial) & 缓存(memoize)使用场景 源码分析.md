# 偏函数(partial) & 缓存(memoize)使用场景 源码分析

偏函数(partial)

```
// partial的另外一种实现
function add(a, b) {
    return a + b;
}
var bindAdd = add.bind(this, 5);
console.log(bindAdd(2)); // 7

// underscore partial
var add = function(a, b) {
    return a + b;
}
var partialAdd = _.partial(add, 5);
console.log(partialAdd(2)); // 7
```

源码分析见解析

斐波那契数列 应该都很熟悉，如何能够快速求得斐波那契数列中某项的值呢？

我们来看看 underscore 对其的实现：

```
// Memoize an expensive function by storing its results.
//「记忆化」，存储中间运算结果，提高效率
// 参数 hasher 是个 function，用来计算 key
// 如果传入了 hasher，则用 hasher 来计算 key
// 否则用 key 参数直接当 key（即 memoize 方法传入的第一个参数）
// _.memoize(function, [hashFunction])
// 适用于需要大量重复求值的场景
// 比如递归求解菲波那切数
// @http://www.jameskrob.com/memoize.html
// create hash for storing "expensive" function outputs
// run expensive function
// check whether function has already been run with given arguments via hash lookup
// if false - run function, and store output in hash
// if true, return output stored in hash
_.memoize = function(func, hasher) {
  var memoize = function(key) {
    // 储存变量，方便使用
    var cache = memoize.cache;

    // 求 key
    // 如果传入了 hasher，则用 hasher 函数来计算 key
    // 否则用 参数 key（即 memoize 方法传入的第一个参数）当 key
    var address = '' + (hasher ? hasher.apply(this, arguments) : key);

    // 如果这个 key 还没被 hash 过（还没求过值）
    if (!_.has(cache, address))
      cache[address] = func.apply(this, arguments);

    // 返回
    return cache[address];
  };

  // cache 对象被当做 key-value 键值对缓存中间运算结果
  memoize.cache = {};

  // 返回一个函数（经典闭包）
  return memoize;
};
```

实现原理和 memoize 差不多，underscore 将缓存中间结果的 cache 对象绑在了闭包返回的函数上（当做函数的属性），同时增加了一个 hasher 函数选项，如果函数有好几个参数，那么我们可以传入这个 hasher 函数来计算 key 值，从而来 hash。



