# underscore rest参数 & underscore创建对象方式

underscore中 _.restArguments 用法:

```
var raceResults = _.restArguments(function(gold, silver, bronze, everyoneElse) {
  console.log(everyoneElse);
});

raceResults("Dopey", "Grumpy", "Happy", "Sneezy", "Bashful", "Sleepy", "Doc");
```

### underscore创建对象方式

_.create

_.create 方法非常简单，根据你给的原型（prototype），以及一些 own properties，构造新的对象返回。

举个简单的例子：

```
var Person = function() {};

Person.prototype = {
  show: function() {
    alert(this.name);
  }
};

var me = _.create(Person.prototype, {name: 'hanzichi'});

console.log(me);
```

undercore 的实现思路也大抵如此。




