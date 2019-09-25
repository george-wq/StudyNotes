# React基础知识

### React介绍与React代码规范

【题目1】请说明vue和React两者的区别和共同点。

【题目2】

### 虚拟DOM和JSX

【题目1】什么是JSX,为什么浏览器无法读取JSX？
>JSX就是Javascript和XML结合的一种格式。React发明了JSX，从本质上讲，JSX 只是为 React.createElement(component, props, ...children)函数提供的语法糖.

【题目2】你是如何理解Virtual DOM的原理的？
```
数据变化过程
['a', 'b', 'c'] => ['b', 'c', 'd']

第一步 a 删除
第二步 b, c更新
第三步 d 创建

// 待看源码
```
【题目3】React中key是做什么的？
```
react利用key来识别组件，它是一种身份标识标识。有了key属性后，就可以与组件建立了一种对应关系，react根据key来决定是销毁重新创建组件还是更新组件
1. key相同，若组件属性有所变化，则react只更新组件对应的属性；没有变化则不更新。
2. key值不同，则react先销毁该组件(有状态组件的componentWillUnmount会执行)，然后重新创建该组件（有状态组件的constructor和componentWillUnmount都会执行)

// 待看源码
```

### 生命周期与数据操作

【题目1】你是如何理解 React 组件的生命周期的？
```
[详解React生命周期](https://github.com/george-wq/StudyNotes/issues/12)

待看源码：fiber、16.4后新生命周期
```
【题目2】什么是Props?
```
组件从概念上看就是一个函数，可以接受一个参数作为输入值，这个参数就是props，所以可以把props理解为从外部传入组件内部的数据。由于React是单向数据流，所以props基本上也就是从服父级组件向子组件传递的数据。

props经常被用作渲染组件和初始化状态，当一个组件被实例化之后，它的props是只读的，不可改变的。如果props在渲染过程中可以被改变，会导致这个组件显示的形态变得不可预测。只有通过父组件重新渲染的方式才可以把新的props传入组件中。

props是一个从外部传进组件的参数，主要作为就是从父组件向子组件传递数据，它具有可读性和不变性，只能通过外部组件主动传入新的props来重新渲染子组件，否则子组件的props以及展现形式不会改变。

一个组件的显示形态可以由数据状态和外部参数所决定，外部参数也就是props，而数据状态就是state。

state的主要作用是用于组件保存、控制以及修改自己的状态，它只能在constructor中初始化，它算是组件的私有属性，不可通过外部访问和修改，只能通过组件内部的this.setState来修改，修改state属性会导致组件的重新渲染。
```

【题目3】React中的状态是什么？它是如何使用的？
```
状态(State)和属性(Props)

具体看上题
```

【题目4】调用setState之后发生了什么？
```
this.setState修改，修改state属性会导致组件的重新渲染。
```

【题目5】父子组件嵌套后的生命周期是怎样的？（要求打印出执行顺序）
> + in parent componentWillMount 
> + in parent render
> + in son componentWillMount
> + in son render
> + in son componentDidMount
> + in parent componentDidMount

### ReactDOM与表单

【题目1】请说出你对受控组件与非受控组件的理解。
>受控组件就是为某个form表单组件添加value属性；非受控组件就是没有添加value属性的组件;

### React与es6

【题目1】与ES5相比，React的ES6语法有何不同？


### 高阶组件
【题目1】什么是高阶组件？它有哪些优缺点？




