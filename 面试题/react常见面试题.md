# 1. Virtual DOM
虚拟DOM本质上是javascript对象，这个对象就是更加轻量级的对dom的描述，就是一个js对象，包含tag，props，children三个属性

Virtual DOM的历史
    1. 字符串拼接时代 - 2004
    2. XHP 时代 - 2010 (XHP是对PHP的语法拓展)
    3. JSX - 2013
    4. React提出 发生前后状态变化时，React会自动更新UI，这个时候我只需要关系我的状态，以及UI长什么样，不再需要关系操作细节。
    5. 以上方法缺点是：很慢， 于是diff就出现了，diff的主要作用是DOM节点的复用。于是Virtual DOM出现了。

Virtual DOM和真实DOM的性能比较
    1. 虚拟 DOM 和 Diff 算法的出现是为了解决由命令式编程转变为声明式编程、数据驱动后所带来的性能问题的。换句话说，直接操作 DOM 的性能并不会低于虚拟 DOM 和 Diff 算法，甚至还会优于。
    2. React 厉害的地方并不是说它比 DOM 快，而是说不管你数据怎么变化，我都可以以最小的代价来进行更新 DOM。方法就是我在内存里面用新的数据刷新一个虚拟 DOM 树，然后新旧 DOM 进行比较，找出差异，再更新到 DOM 树上。
    3. 框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。

Virtual DOM优点
    1. Virtual DOM 在牺牲(牺牲很关键)部分性能的前提下，增加了可维护性，这也是很多框架的通性
    2. 实现了对 DOM 的集中化操作，在数据改变时先对虚拟 DOM 进行修改，再反映到真实的 DOM 中，用最小的代价来更新 DOM，提高效率(提升效率要想想是跟哪个阶段比提升了效率，别只记住了这一条)。
    3. 打开了函数式 UI 编程的大门。
    4. 可以渲染到 DOM 以外的端，使得框架跨平台，比如 ReactNative，React VR 等。
    5. 可以更好的实现 SSR，同构渲染等。这条其实是跟上面一条差不多的。
    6. 组件的高度抽象化。

Vue 2.0 引入 vdom 的主要原因是 vdom 把渲染过程抽象化了，从而使得组件的抽象能力也得到提升，并且可以适配 DOM 以外的渲染目标。

Virtual DOM缺点
    1. 首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比 innerHTML 插入慢。
    2. 虚拟 DOM 需要在内存中的维护一份 DOM 的副本(更上面一条其实也差不多，上面一条是从速度上，这条是空间上)。
    3. 如果虚拟 DOM 大量更改，这是合适的。但是单一的，频繁的更新的话，虚拟 DOM 将会花费更多的时间处理计算的工作。所以，如果你有一个 DOM 节点相对较少页面，用虚拟 DOM，它实际上有可能会更慢。但对于大多数单页面应用，这应该都会更快。


虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种 GUI。

参考： https://mp.weixin.qq.com/s/zCGQEpEGJYQWMMvZfyUYHg


# 生命周期
render 阶段可以理解为就是 Diff 的过程，得出 Change(Effect List)，会执行声明如下的声明周期方法：
    1.[UNSAFE_]componentWillMount（弃用）
    2.[UNSAFE_]componentWillReceiveProps（弃用）
    3.getDerivedStateFromProps
    4.shouldComponentUpdate
    5.[UNSAFE_]componentWillUpdate（弃用）
    6.render

由于 reconciliation 阶段是可中断的，一旦中断之后恢复的时候又会重新执行，所以很可能 reconciliation 阶段的生命周期方法会被多次调用，所以在 reconciliation 阶段的生命周期的方法是不稳定的，我想这也是 React 为什么要废弃 componentWillMount 和 componentWillReceiveProps方法而改为静态方法 getDerivedStateFromProps 的原因吧。

## 聊一聊 hooks 怎么处理生命周期
函数组件 的本质是函数，没有 state 的概念的，因此不存在生命周期一说，仅仅是一个 render 函数而已。

但是引入 Hooks 之后就变得不同了，它能让组件在不使用 class 的情况下拥有 state，所以就有了生命周期的概念，所谓的生命周期其实就是 useState、 useEffect() 和 useLayoutEffect()。

```
// componentDidMount
useEffect(()=>{
  // 需要在 componentDidMount 执行的内容
}, [])

useEffect(() => { 
  // 在 componentDidMount，以及 count 更改时 componentDidUpdate 执行的内容
  document.title = `You clicked ${count} times`; 
  return () => {
    // 需要在 count 更改时 componentDidUpdate（先于 document.title = ... 执行，遵守先清理后更新）
    // 以及 componentWillUnmount 执行的内容       
  } // 当函数中 Cleanup 函数会按照在代码中定义的顺序先后执行，与函数本身的特性无关
}, [count]); // 仅在 count 更改时更新


生命周期：

class 组件	                 Hooks 组件
constructor	                useState
getDerivedStateFromProps	useState 里面 update 函数
shouldComponentUpdate	    useMemo
render	                    函数本身
componentDidMount	        useEffect
componentDidUpdate	        useEffect
componentWillUnmount	    useEffect 里面返回的函数
componentDidCatch           无
getDerivedStateFromError	无

```

# React高阶组件
一个高阶组件只是一个包装了另外一个 React 组件的 React 组件。

前提概念，属性渲染：它在某种成都上解决了有状态组件的可复用性


参考： https://github.com/george-wq/StudyNotes/issues/14
      https://www.jianshu.com/p/0aae7d4d9bc1



# 深入 setState 机制
在React中， 如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用setState不会同步更新this.state，除此之外的setState调用会同步执行this.state 。所谓“除此之外”，指的是绕过React通过addEventListener直接添加的事件处理函数，还有通过setTimeout/setInterval产生的异步调用。

原因： 在React的setState函数实现中，会根据一个变量isBatchingUpdates判断是直接更新this.state还是放到 dirtyComponents 队列中回头再说，而isBatchingUpdates默认是false，也就表示setState会同步更新this.state，但是，有一个函数batchedUpdates，这个函数会把isBatchingUpdates修改为true，而当React在调用事件处理函数之前就会调用这个batchedUpdates，造成的后果，就是由React控制的事件处理过程setState不会同步更新this.state 。

## setState 循环调用风险
当调用 setState 时，实际上是会执行 enqueueSetState 方法，并会对 partialState 及 _pendingStateQueue 队列进行合并操作，最终通过 enqueueUpdate 执行 state 更新。

而 performUpdateIfNecessary 获取 _pendingElement、 _pendingStateQueue、_pendingForceUpdate，并调用 reaciveComponent 和 updateComponent 来进行组件更新。

如果在 shouldComponentUpdate 或 componentWillUpdate 方法中调用 this.setState 方法，就会造成崩溃。这是因为在 shouldComponentUpdate 或 componentWillUpdate 方法里调用 this.setState 时，this._pendingStateQueue!=null，则 performUpdateIfNecessary 方法就会调用 updateComponent 方法进行组件更新，而 updateComponent 方法又会调用 shouldComponentUpdate和componentWillUpdate 方法，因此造成循环调用，使得浏览器内存占满后崩溃。

参考：https://github.com/sisterAn/blog/issues/26




# 详解 React 16 的 React Fiber && Diff 策略

```
React核心思想： 内存中维护一颗虚拟DOM树，数据变化时（setState），自动更新虚拟 DOM，得到一颗新树，然后 Diff 新老虚拟 DOM 树，找到有变化的部分，得到一个 Change(Patch)，将这个 Patch 加入队列，最终批量更新这些 Patch 到 DOM 中。
```

首先我们了解一下 React 的工作过程，当我们通过render()和setState()进行组件渲染和更新的时候，React主要有两个阶段：
    1.调和阶段(Reconciler)：官方解释。React 会自顶向下通过递归，遍历新数据生成新的 Virtual DOM，然后通过 Diff 算法，找到需要变更的元素(Patch)，放到更新队列里面去。
    2.渲染阶段(Renderer)：遍历更新队列，通过调用宿主环境的API，实际更新渲染对应元素。宿主环境，比如 DOM、Native、WebGL 等。

### React 16 之前不足
在协调阶段阶段，由于是采用的递归的遍历方式，这种也被成为 Stack Reconciler，主要是为了区别 Fiber Reconciler 取的一个名字。这种方式有一个特点：一旦任务开始进行，就无法中断，那么 js 将一直占用主线程， 一直要等到整棵 Virtual DOM 树计算完成之后，才能把执行权交给渲染引擎，那么这就会导致一些用户交互、动画等任务无法立即得到处理，就会有卡顿，非常的影响用户体验。

## 什么是Fiber
Fiber 本质上是一个虚拟的堆栈帧，也可以说是一种解决可中断的调用任务的一种解决方案，它的特性就是时间分片(time slicing)和暂停(supense)。
Fiber 本质上是一个虚拟的堆栈帧，新的调度器会按照优先级自由调度这些帧，从而将之前的同步渲染改成了异步渲染，在不影响体验的情况下去分段计算更新。

## React 如何实现调度
    1.计算任务的 expriationTime
    2.实现 requestIdleCallback 的 polyfill 版本

###  expriationTime
当前时间 ＋ 一个常量(根据优先级改变，1，2，3，4，5)

### requestIdleCallback
实现 requestIdleCallback 函数的核心只有一点，如何多次在浏览器空闲时且是渲染后才调用回调方法, 使用requestAnimationFrame设置定时器，在每次重绘前执行。
这部分代码核心就是得出每一帧所耗时间及下一帧的时间。简单来说就是假设当前时间为 5000，浏览器支持 60 帧，那么 1 帧近似 16 毫秒，那么就会计算出下一帧时间为 5016。

## 调度的流程
1. 首先每个任务都会有各自的优先级，通过当前时间加上优先级所对应的常量我们可以计算出expriationTime，高优先级的任务会打断低优先级任务
2. 在调度之前，判断当前任务是否过期，过期的话无须调度，直接调用 port.postMessage(undefined)，这样就能在渲染后马上执行过期任务了
3. 如果任务没有过期，就通过 requestAnimationFrame 启动定时器，在重绘前调用回调方法
4. 在回调方法中我们首先需要计算每一帧的时间以及下一帧的时间，然后执行 port.postMessage(undefined)
5. channel.port1.onmessage 会在渲染后被调用，在这个过程中我们首先需要去判断当前时间是否小于下一帧时间。如果小于的话就代表我们尚有空余时间去执行任务；如果大于的话就代表当前帧已经没有空闲时间了，这时候我们需要去判断是否有任务过期，过期的话不管三七二十一还是得去执行这个任务。如果没有过期的话，那就只能把这个任务丢到下一帧看能不能执行了
6. 得出下一帧时间以后，我们只需对比当前时间是否小于下一帧时间即可，这样就能清楚地知道是否还有空闲时间去执行任务。

## 浏览器一帧内的工作
    1.处理用户的交互
    2.JS 解析执行
    3.帧开始。窗口尺寸变更，页面滚去等的处理
    4.rAF(requestAnimationFrame)
    5.布局
    6.绘制

## Fiber是如何工作的
    1.ReactDOM.render() 和 setState 的时候开始创建更新。
    2.将创建的更新加入任务队列，等待调度。
    3.在 requestIdleCallback 空闲时执行任务。
    4.从根节点开始遍历 Fiber Node，并且构建 WokeInProgress Tree。
    5.生成 effectList。
    6.根据 EffectList 更新 DOM。

## Diff
React 现在将整体的数据结构从树改为了链表结构，Diff的本质就是复用节点。

老的 Diff 算法提出了三个策略来保证整体界面构建的性能，具体是：
    1.Web UI中的DOM节点跨层级的移动特别少，可以忽略不计。
    2.拥有相同类的两个组件会生成相似的树结构，不同的两个组件生成不同的树形结构。
    3.对于统一层级的一组子节点，它们可以通过唯一id进行区分。

构建整个 currentInWorkProgress，对于新的 children 会有四种情况:
    1.TextNode(包含字符串和数字)
    2.单个 React Element(通过该节点是否有 $$typeof 区分)
    3.数组
    4.可迭代的 children，跟数组的处理方式差不多

数组diff整个过程分为三个阶段：
1.第一遍历新数组，新老数组相同key进行对比，通过 updateSlot方法找到可以复用的节点，直到找到不可以复用的节点就退出循环。
2.第一遍历完之后，删除剩余的老节点，追加剩余的新节点的过程。如果是新节点已遍历完成，就将剩余的老节点批量删除；如果是老节点遍历完成仍有新节点剩余，则将新节点直接插入。
3.把所有老数组元素按 key 或 index 放 Map 里，然后遍历新数组，插入老数组的元素，这是移动的情况。


参考：https://mp.weixin.qq.com/s?__biz=MzI1ODk2Mjk0Nw==&mid=2247484469&idx=1&sn=f68d044f1b0e4e2eb981e3878427b75b&scene=21#wechat_redirect
     https://mp.weixin.qq.com/s/_jAW4Z3VR-uW0AEnjHgAEw
     https://segmentfault.com/a/1190000019900931



# React中的性能优化
在函数式组件里每次重新渲染，函数组件都会重头开始重新执行。

React 性能优化的理念的主要方向就是这两个：
    1.减少重新 render 的次数。因为在 React 里最重(花时间最长)的一块就是 reconction(简单的可以理解为 diff)，如果不 render，就不会 reconction。
    2.减少计算的量。主要是减少重复计算，对于函数式组件来说，每次 render 都会重新从头开始执行函数调用。

共同的方案：
    1.列表渲染key

类组件：
    1.shouldComponentUpdate， PureComponent，这2个都是为了减少重新render的次数。
    
函数式组件：
    1.React.memo，对标PureComponent，减少重新render的次数
    2.useCallback，解决在函数式组件里每次重新渲染，函数组件都会重头开始重新执行。减少重新render的次数
    3.useMemo，缓存计算量比较大的函数结果，可以避免不必要的重复计算

1. React 的优化方向：减少 render 的次数；减少重复计算。
2. 如何去找到 React 中导致性能问题的方法，见 useCallback 部分。
    1).要么是组件自己的状态改变
    2).要么是父组件重新渲染，导致子组件重新渲染，但是父组件的 props 没有改版
    3).要么是父组件重新渲染，导致子组件重新渲染，但是父组件传递的 props 改变
3. 合理的拆分组件其实也是可以做性能优化的，你这么想，如果你整个页面只有一个大的组件，那么当 props 或者 state 变更之后，需要 reconction 的是整个组件，其实你只是变了一个文字，如果你进行了合理的组件拆分，你就可以控制更小粒度的更新。

参考： https://mp.weixin.qq.com/s/mpL1MxLjBqSO49TRijeyeg



# React事件机制
react自身实现了一套自己的事件机制，包括事件注册、事件的合成、事件冒泡、事件派发等，虽然和原生的是两码事，但也是基于浏览器的事件机制下完成的。
react所有的事件并没有绑定到具体的dom节点上而是绑定到document上，然后由统一的事件处理程序来处理，同时也是基于浏览器的事件机制（冒泡），所有节点的事件都会在document上出发。

1. 合成事件
   1）对原生事件的封装
   2）对某些原生事件的升级和改造
   3）不同浏览器事件兼容的处理
2. 事件注册机制
   1）事件注册 － 组件挂载阶段，根据组件内的声明的事件类型 onClick，onChange等，给document上添加事件 addEventListener，并指定统一的事件处理程序dispathEvent
   2）事件存储 － 就是把 react 组件内的所有事件统一的存放到一个对象里，缓存起来，为了在触发事件的时候可以查找到对应的方法去执行。
3. 事件执行机制
   1）进入统一的事件分发函数(dispatchEvent）
   2）结合原生事件找到当前节点对应的ReactDOMComponent对象
   3）开始 事件的合成
   4）批量处理合成事件内的回调事件（事件触发完成 end）


参考：https://toutiao.io/posts/28of14w/preview



