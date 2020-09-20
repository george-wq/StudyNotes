# Redux的三大原则
1. 单一数据源，整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。
2. State 是只读的， 唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。
3. 使用纯函数来执行修改，为了描述 action 如何改变 state tree ，你需要编写 reducers。

# Redux的原理

Redux是什么
>Redux 是 JavaScript 状态容器,提供可预测化的状态管理。我的理解是，redux是为了解决react组件间通信和组件间状态共享而提出的一种解决方案，主要包括3个部分，（store + action + reducer）
>很多人认为redux必须要结合React使用，其实并不是的，Redux 是 JavaScript 状态容器，只要你的项目中使用到了状态，并且状态十分复杂，那么你就可以使用Redux管理你的项目状态，它可以使用在react中，也可以使用中在Vue中，当然也适用其他的框架。

>react-redux则是用来连接这个状态容器与react组件。


redux核心概念
1.Action, Action是把数据从应用传到 store 的有效载荷。它是 store 数据的唯一来源。一般来说你会通过 store.dispatch() 将 action 传到 store。
2.Reducer, 指定了应用状态的变化如何响应 actions 并发送到 store 的，记住 actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新 state。一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做纯函数
3.Store, redux唯一的数据源。
Store 就是把它们联系到一起的对象。Store 有以下职责：
维持应用的state；
提供 getState() 方法获取 state；
提供 dispatch(action) 方法更新 state；
通过 subscribe(listener) 注册监听器;
通过 subscribe(listener) 返回的函数注销监听器。

核心源码: 
## createStore.js
函数createStore接受三个参数（reducer、preloadedState、enhancer），reducer和enhancer我们用的比较多，preloadedState用的比较少。第一个reducer很好理解，这里就不过多解释了，第二个preloadedState，它代表着初始状态，我们平时在项目里也很少用到它，主要说一下enhancer，中文名叫增强器，顾名思义就是来增强redux的，它的类型的是Function

函数最后放回
```
return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
}
```
### dispatch
函数dispatch在函数体一开始就进行了三次条件判断，分别是以下三个：
判断action是否为简单对象
判断action.type是否存在
判断当前是否有执行其他的reducer操作

### getState
getState相比较dispatch要简单许多,返回currentState即可。
store通过getState得出的state是可以直接被更改的，但是redux不允许这么做，因为这样不会通知订阅者更新数据。

### subscribe
在注册订阅者之前，做了两个条件判断：
判断监听者是否为函数
是否有reducer正在进行数据修改（保证数据的一致性）

通过条件判断之后，讲该订阅者从nextListeners中删除。看到这里可能有小伙伴们对currentListeners和nextListeners有这么一个疑问？函数dispatch里面将二者合并成一个引用，为啥这里有啥给他俩分开？直接用currentListeners不可以吗？这里这样做其实也是为了数据的一致性，因为有这么一种的情况存在。当redux在通知所有订阅者的时候，此时又有一个新的订阅者加进来了。如果只用currentListeners的话，当新的订阅者插进来的时候，就会打乱原有的顺序，从而引发一些严重的问题。

## combineReducers.js
这个js对应着redux里的combineReducers方法，主要作用就是合并多个reducer。

## compose.js
这个函数主要作用就是将多个函数连接起来，将一个函数的返回值作为另一个函数的传参进行计算，得出最终的返回值。

```
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

## applyMiddleware.js
applyMiddleware的作用就是将这些enhancer格式化成符合redux要求的enhancer。
常见的enhancer就是redux-thunk以及redux-saga，一般都会配合applyMiddleware一起使用。

```
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```

我们发现函数applyMiddleware的返回就是一个enhancer，下面我们再看其具体实现逻辑：
1. 通过createStore方法创建出一个store
2. 定一个dispatch，如果在中间件构造过程中调用，抛出错误提示
3. 定义middlewareAPI，有两个方法，一个是getState，另一个是dispatch，将其作为中间件调用的store的桥接
4. middlewares调用Array.prototype.map进行改造，存放在chain
5. 用compose整合chain数组，并赋值给dispatch
6. 将新的dispatch替换原先的store.dispatch


参考： https://segmentfault.com/a/1190000016460366
      https://segmentfault.com/a/1190000019849834?utm_source=tag-newest
      [redux中的观察者模式]https://www.dazhuanlan.com/2019/10/11/5d9f9a072f607/?__cf_chl_jschl_tk__=5a52b60ab527f02698d0e37244fafa3bf9f9dfa4-1600509636-0-AZ7CRxwcGfZpv3TISAC4z-EjSbHiXdJWoyfAFSOhPc9dyGDu62hysvPMZBakQoFdyUj49FmsMThEdtfkVbZOGjzWqASwOkZh-5NetVwO3lIBRMX6XqOiGwb6rWXRGhz6kodK3x4E5s6kRIdTMHTO7taFOAV0wFbgZhN7UotutBIRIQft3FTtQqjZ8YFd4AqSIXFvSZKyh52nACZCBb8tpWP3Bi661eDjcEM9R97ho0zuFy_R0Za65WxRRVIJtiMSVeWbb7GnQ9Qqq2jQe7LSDY4lxb1Y6W0jxHMubn2BUsIHWENvwDR58s0K36cL8xsmYg


# redux 做状态管理和发布订阅模式有什么区别   ???? 

redux 其实也是一个发布订阅，但是 redux 可以做到数据的可预测和可回溯.
那什么是可以预测化，我的理解就是根据一个固定的输入，必然会得到一个固定的结果。


参考：[redux中的观察者模式]https://www.dazhuanlan.com/2019/10/11/5d9f9a072f607/?__cf_chl_jschl_tk__=5a52b60ab527f02698d0e37244fafa3bf9f9dfa4-1600509636-0-AZ7CRxwcGfZpv3TISAC4z-EjSbHiXdJWoyfAFSOhPc9dyGDu62hysvPMZBakQoFdyUj49FmsMThEdtfkVbZOGjzWqASwOkZh-5NetVwO3lIBRMX6XqOiGwb6rWXRGhz6kodK3x4E5s6kRIdTMHTO7taFOAV0wFbgZhN7UotutBIRIQft3FTtQqjZ8YFd4AqSIXFvSZKyh52nACZCBb8tpWP3Bi661eDjcEM9R97ho0zuFy_R0Za65WxRRVIJtiMSVeWbb7GnQ9Qqq2jQe7LSDY4lxb1Y6W0jxHMubn2BUsIHWENvwDR58s0K36cL8xsmYg


# react-redux 的原理，是怎么跟 react 关联起来的
react-redux 的核心组件只有两个，Provider 和 connect。

Provider 其实就只是一个外层容器，它的作用就是通过配合 connect 来达到跨层级传递数据。使用时只需将Provider定义为整个项目最外层的组件，并设置好store。那么整个项目都可以直接获取这个store。它的原理其实是通过React中的Context来实现的。

connect 的作用是连接React组件与 Redux store，它包在我们的容器组件的外一层，它接收上面 Provider 提供的 store 里面的 state 和 dispatch，传给一个构造函数，返回一个对象，以属性形式传给我们的容器组件。

它共有四个参数mapStateToProps, mapDispatchToProps, mergeProps以及options。

mapStateToProps 的作用是将store里的state（数据源）绑定到指定组件的props中
mapDispatchToProps 的作用是将store里的action（操作数据的方法）绑定到指定组件的props中

参考：https://www.jianshu.com/p/1519690fce26

# redux为什么要把reducer设计成纯函数

redux的设计思想就是不产生副作用，数据更改的状态可回溯，所以redux中处处都是纯函数

然后说一下为什么reducer最好是纯函数，首先你得看看文档怎么说reducer的作用的，‘接收旧的 state 和 action，返回新的 state’，您可得瞧好咯，他就是起一个对数据做简单处理后返回state的作用，为什么只起这个作用，这时用设计这个词回答这个问题才恰当，因为redux把reducer设计成只负责这个作用。很白痴的问答对吧，所以题目的答案也就简单了，reducer的职责不允许有副作用，副作用简单来说就是不确定性，如果reducer有副作用，那么返回的state就不确定，举个例子，你的reducer就做了一个value = value + 1这个逻辑，然后返回state为{value}，ok，这个过程太jr纯了，然后你可能觉得要加个请求来取得value后再加1，那么你的逻辑就是value = getValue() + 1, getValue是个请求函数，返回一个值，这种情况，退一万步讲，如果你的网络请求这次出错，那么getValue就返回的不是一个数值，value就不确定了，所以return的state你也不确定了，前端UI拿到的数据也不确定了，所以就是这个环节引入了副作用，他娘的redux设计好的规范就被你破坏了，redux就没卵用了。到此为止这个问题回答完了，我没有说什么上面几个jr说的教科书的理论，甚至还加了些脏话。请原谅，这只是戏剧需要。


# redux和context的区别
# react 16.3的 context API能否完全取代Redux ？

参考：https://segmentfault.com/a/1190000017758300