# 解释下变量提升？✨
JavaScript引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。这造成的结果，就是所有的变量的声明语句，都会被提升到代码的头部，这就叫做变量提升（hoisting）。

我们可以大致把JavaScript在浏览器中运行的过程分为两个阶段编译阶段（有人说准确的说法是应该是Parser，我们以预解释方便理解） 执行阶段,在JavaScript引擎对JavaScript代码进行执行之前,需要进行预先处理,然后再对处理后的代码进行执行。

javascript预解释正是创建函数的执行环境（又称“执行上下文”）,会创建一个变量对象

在有了这些基板概念之后我们可以梳理一下js引擎创建执行的过程:

创建阶段:
创建Scope chain
创建variableObject
设置this
执行阶段
变量的值、函数的引用
执行代码

而变量对象的创建细节如下:

1.根据函数的参数，创建并初始化arguments object
2.扫描函数内部代码，查找函数声明（Function declaration）
    对于所有找到的函数声明，将函数名和函数引用存入变量对象中
    如果变量对象中已经有同名的函数，那么就进行覆盖
3.扫描函数内部代码，查找变量声明（Variable declaration）
    对于所有找到的变量声明，将变量名存入变量对象中，并初始化为"undefined"
    如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

冲突处理：
1. 变量之间冲突，后声明变量值会覆盖前者的值。
2. 函数之间冲突，结果同变量冲突
3. 函数变量之间冲突
```
console.log(f);

function f() {
    console.log('f');
}
var f ='g';
```
结果如下,函数声明将覆盖变量声明
>[Function: f]

参考: https://www.cxymsg.com/guide/hoisting.html#avascript%E9%A2%84%E8%A7%A3%E9%87%8A


# 一段JavaScript代码是如何执行的？✨
    1. this是怎么被绑定的?
    在创建可执行上下文的时候，根据代码的执行条件，来判断分别进行默认绑定、隐式绑定、显示绑定等。

    2. 作用域链是怎么形成的？
    可执行上下文中的词法环境中含有外部词法环境的引用，我们可以通过这个引用获取外部词法环境的变量、声明等，这些引用串联起来一直指向全局的词法环境，因此形成了作用域链。

    3. 闭包是怎么形成的？
    可执行上下文中的词法环境中含有外部词法环境的引用，我们可以通过这个引用获取外部词法环境的变量、声明等，因此形成了闭包。


参考: https://www.cxymsg.com/guide/mechanism.html#javascript%E7%9A%84%E6%89%A7%E8%A1%8C%E7%8E%AF%E5%A2%83

# 理解闭包吗？✨
闭包就是一个绑定了执行环境的函数，与普通函数的区别就是它携带了执行环境。
执行环境包含三个部分: 作用域、this值、标识符列表(函数内用到，但是未声明的变量)。执行环境是函数被调用是决定的。

>闭包的作用
闭包最大的作用就是隐藏变量，闭包的一大特性就是内部函数总是可以访问其所在的外部函数中声明的参数和变量，即使在其外部函数被返回（寿命终结）了之后

```
function Person(){
    var name = 'cxk';
    this.getName = function(){
        return name;
    }
    this.setName = function(value){
        name = value;
    }
}

const cxk = new Person()

console.log(cxk.getName()) //cxk
cxk.setName('jntm')
console.log(cxk.getName()) //jntm
console.log(name) //name is not defined
```

# JavaScript的作用域链理解吗？✨


# ES6模块与CommonJS模块有什么区别？
1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
3. CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

参考：https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82


# js有哪些类型？
boolean null undefined string number symbol object

还有一个没有正式发布但即将被加入标准的原始类型BigInt。

# 为什么会有BigInt的提案？
JavaScript中Number.MAX_SAFE_INTEGER表示最大安全数字,计算结果是9007199254740991，即在这个数范围内不会出现精度丢失（小数除外）。

但是一旦超过这个范围，js就会出现计算不准确的情况，这在大数计算的时候不得不依靠一些第三方库进行解决，因此官方提出了BigInt来解决此问题。


# null与undefined的区别是什么？
null表示为空，代表此处不应该有值的存在，一个对象可以是null，代表是个空对象，而null本身也是对象。

undefined表示『不存在』，JavaScript是一门动态类型语言，成员除了表示存在的空值外，还有可能根本就不存在（因为存不存在只在运行期才知道），这就是undefined的意义所在。


# 0.1+0.2为什么不等于0.3？✨？？？
parseFloat() 函数可解析一个字符串，并返回一个浮点数。
toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。

>parseFloat((0.1 + 0.2).toFixed(10))

# 类型转换的规则有哪些？
在if语句、逻辑语句、数学运算逻辑、==等情况下都可能出现隐士类型转换。

# 类型转换的原理是什么？✨

```
1.toString() // Invalid or unexpected token   

数字的直接量可以是十进制 带小数点的，可以省略前面｜对面，但是不能同时省略。(1. | .1)

解决方法 => (1).toString()
```

1. 数字直接量
装箱操作: 每一个基本类型Number，String，BooleanBoolean在对象中都有对应的类（产生一个临时对象）
(1).toString()

拆箱操作: 把对象转换成原始类型的值的时会进行拆箱操作
toprimitive(input, preferedType?)
input           输入   =>   对象
preferedType    输出   =>   字符串 || 数字

1.输入原始值 直接返回
2.输入对象 调用input.valueOf() 原始值 直接返回
3.调用input.toString() 原始值 直接返回
4.报错

>如果输入对象是string，那么 2 和 3 会交换。

[] + []  =>  “”
[] + {}  =>  “” ＋ “[object Object]”  =>  "[object Object]"
// {} object对象的字面量 || 代码块
{} + []  => +[] => 0
{} + {}  => "[object Object][object Object]"


# 谈谈你对原型链的理解？✨

参考：https://www.cxymsg.com/guide/jsBasic.html#%E8%B0%88%E8%B0%88%E4%BD%A0%E5%AF%B9%E5%8E%9F%E5%9E%8B%E9%93%BE%E7%9A%84%E7%90%86%E8%A7%A3%EF%BC%9F%E2%9C%A8


# 如何判断是否是数组？
1. Array.isArray
2. Object.toString.call(arr) === '[Object Array]'


# 谈一谈你对this的了解？✨
四种类型

绑定优先级: new绑定 > 显式绑定 >隐式绑定 >默认绑定


# 那么箭头函数的this指向哪里？✨
箭头函数的this定义：箭头函数的this是在定义函数时绑定的，不是在执行过程中绑定的。简单的说，函数在定义时，this就继承了定义函数的对象。

箭头函数不同于传统JavaScript中的函数,箭头函数并没有属于自己的this,它的所谓的this是捕获其所在上下文的 this 值，作为自己的 this 值,并且由于没有属于自己的this,而箭头函数是不会被new调用的，这个所谓的this也不会被改变.

我们可以用Babel理解一下箭头函数:

```
// ES6
const obj = {
    getArrow() {
        return () => {
            console.log(this === obj);
        };
    }
}
```

转化后

```
// ES5，由 Babel 转译
var obj = {
    getArrow: function getArrow() {
        var _this = this;
        return function () {
            console.log(_this === obj);
        };
    }
};
```

# 箭头函数与普通函数（function）的区别是什么？构造函数（function）可以使用 new 生成实例，那么箭头函数可以吗？为什么？
箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：

1、函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。

2、不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

3、不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

4、不可以使用 new 命令，因为：
没有自己的 this，无法调用 call，apply。
没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 __proto__

# async/await是什么？
async 函数，就是 Generator 函数的语法糖，它建立在Promises上，并且与所有现有的基于Promise的API兼容。

1. Async—声明一个异步函数(async function someName(){...})
自动将常规函数转换成Promise，返回值也是一个Promise对象
只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数
异步函数内部可以使用await

2. Await—暂停异步的功能执行(var result = await someAsyncCall()😉
放置在Promise调用之前，await强制其他代码等待，直到Promise完成并返回结果
只能与Promise一起使用，不适用与回调
只能在async函数内部使用

# async/await相比于Promise的优势？
1. 代码读起来更加同步，Promise虽然摆脱了回调地狱，但是then的链式调用也会带来额外的阅读负担
2. Promise传递中间值非常麻烦，而async/await几乎是同步的写法，非常优雅
3. 错误处理友好，async/await可以用成熟的try/catch，Promise的错误捕获非常冗余
4. 调试友好，Promise的调试很差，由于没有代码块，你不能在一个返回表达式的箭头函数中设置断点，如果你在一个.then代码块中使用调试器的步进(step-over)功能，调试器并不会进入后续的.then代码块，因为调试器只能跟踪同步代码的『每一步』。


# JavaScript的参数是按照什么方式传递的？✨
1. 基本类型传递方式
2. 复杂类型按共享传递

我们将外部a作为一个对象传入test函数.
```
var a = {
  a: 1,
  b: 2
};
function test(x) {
  x.a = 10;
  console.log(x);
}
test(a); // { a: 10, b: 2 }
console.log(a); // { a: 10, b: 2 }
```
可以看到,在函数体内被修改的a对象也同时影响到了外部的a对象,可见复杂类型是按引用传递的.

可是如果再做一个实验:

```
var a = {
  a: 1,
  b: 2
};
function test(x) {
  x = 10;
  console.log(x);
}
test(a); // 10
console.log(a); // { a: 1, b: 2 }

```
外部的a并没有被修改,如果是按引用传递的话,由于共享同一个堆内存,a在外部也会表现为10才对. 此时的复杂类型同时表现出了按值传递和按引用传递的特性.

复杂类型之所以会产生这种特性,原因就是在传递过程中,对象a先产生了一个副本a,这个副本a并不是深克隆得到的副本a,副本a地址同样指向对象a指向的堆内存.

参考：https://www.cxymsg.com/guide/jsBasic.html#javascript%E7%9A%84%E5%8F%82%E6%95%B0%E6%98%AF%E6%8C%89%E7%85%A7%E4%BB%80%E4%B9%88%E6%96%B9%E5%BC%8F%E4%BC%A0%E9%80%92%E7%9A%84%EF%BC%9F


# 聊一聊如何在JavaScript中实现不可变对象？
实现不可变数据有三种主流的方法

1. 深克隆，但是深克隆的性能非常差，不适合大规模使用
2. Immutable.js，Immutable.js是自成一体的一套数据结构，性能良好，但是需要学习额外的API
3. immer，利用Proxy特性，无需学习额外的api，性能良好


# JavaScript的基本类型和复杂类型是储存在哪里的？
基本类型储存在栈中，但是一旦被闭包引用则成为常住内存，会储存在内存堆中。

复杂类型会储存在内存堆中


# 讲讲JavaScript垃圾回收是怎么做的？

# for in 和for of的区别
for in遍历的是数组的索引（即键名）
for of遍历的是数组元素值

+ for..of适用遍历数/数组对象/字符串/map/set等拥有迭代器对象的集合.但是不能遍历对象,因为没有迭代器对象.与forEach()不同的是，它可以正确响应break、continue和return语句
+ for-of循环不支持普通对象，但如果你想迭代一个对象的属性，你可以用for-in循环（这也是它的本职工作）或内建的Object.keys()方法
+ 遍历map对象时适合用解构
+ 当你为对象添加myObject.toString()方法后，就可以将对象转化为字符串，同样地，当你向任意对象添加myObjectSymbol.iterator方法，就可以遍历这个对象了。
