# React Hooks

>Hook 是 React 16.8 的新增特性。它是函数式组件，它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

在 react hook中我们需要理解它的数据(state、props)和生命周期。useState Hook && useEffect Hook

### 组件类的缺点

React 的核心是组件。v16.8 版本之前，组件的标准写法是类（class）。下面是一个简单的组件类。

```
import React, { Component } from "react";

export default class Button extends Component {
  constructor() {
    super();
    this.state = { buttonText: "Click me, please" };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(() => {
      return { buttonText: "Thanks, been clicked!" };
    });
  }
  render() {
    const { buttonText } = this.state;
    return <button onClick={this.handleClick}>{buttonText}</button>;
  }
}
```

这个组件类仅仅是一个按钮，但可以看到，它的代码已经很"重"了。真实的 React App 由多个类按照层级，一层层构成，复杂度成倍增长。再加入 Redux，就变得更复杂。

Redux 的作者 Dan Abramov 总结了组件类的几个缺点。

+ 大型组件很难拆分和重构，也很难测试。
+ 业务逻辑分散在组件的各个方法之中，导致重复逻辑或关联逻辑。
+ 组件类引入了复杂的编程模式，比如 render props 和高阶组件。


### 函数组件

React 团队希望，组件不要变成复杂的容器，最好只是数据流的管道。开发者根据需要，组合管道即可。 组件的最佳写法应该是函数，而不是类。

React 早就支持函数组件，下面就是一个例子。

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

但是，这种写法有重大限制，必须是纯函数，不能包含状态，也不支持生命周期方法，因此无法取代类。

React Hooks 的设计目的，就是加强版函数组件，完全不使用"类"，就能写出一个全功能的组件。

### Hook 的含义

Hook 这个单词的意思是"钩子"。

React Hooks 的意思是，组件尽量写成纯函数，如果需要外部功能和副作用，就用钩子把外部代码"钩"进来。 React Hooks 就是那些钩子。

你需要什么功能，就使用什么钩子。React 默认提供了一些常用钩子，你也可以封装自己的钩子。

所有的钩子都是为函数引入外部功能，所以 React 约定，钩子一律使用use前缀命名，便于识别。你要使用 xxx 功能，钩子就命名为 usexxx。

下面介绍 React 默认提供的四个最常用的钩子。

+ useState()
+ useContext()
+ useReducer()
+ useEffect()

### 在react hook中如何定义状态、修改状态、传入初始状态、生命周期

```
import React, { useState, useEffect } from 'react';

const App = () => {
  const [ value1, setvalue1 ] = useState(0);
  const [ value2, setvalue2 ] = useState(100);
  
  useEffect(() => { 
    // 类似于 componentDidMount && componentDidUpdate
    console.log('hello') 
    // 类似于 componentWillUnmount 
    return () => {
      console.log('hello world!');
    }
  });

  return (
    <div>
      <div>{value1}</div>
      <div>{value2}</div>
      <button onClick={(e) => setvalue1(value1 + 1)}>add</button>
      <button onClick={(e) => setvalue2(value2 - 1)}>remove</button>
    </div>
  )
}

export default App;
```

### useContext()：共享状态钩子 

如果需要在组件之间共享状态，可以使用useContext()

现在有两个组件 Navbar 和 Messages，我们希望它们之间共享状态。

第一步就是使用 React Context API，在组件外部建立一个 Context

```
const AppContext = React.createContext({});
```

组件封装代码如下

```
<AppContext.Provider value={{
  username: 'superawesome'
}}>
  <div className="App">
    <Navbar/>
    <Messages/>
  </div>
</AppContext.Provider>
```

上面代码中，AppContext.Provider提供了一个 Context 对象，这个对象可以被子组件共享。

```
const Navbar = () => {
  const { username } = useContext(AppContext);
  return (
    <div className="navbar">
      <p>AwesomeSite</p>
      <p>{username}</p>
    </div>
  );
}
```

上面代码中，useContext()钩子函数用来引入 Context 对象，从中获取username属性。

Message 组件的代码也类似。

```
const Messages = () => {
  const { username } = useContext(AppContext)

  return (
    <div className="messages">
      <h1>Messages</h1>
      <p>1 message for {username}</p>
      <p className="message">useContext is awesome!</p>
    </div>
  )
}
```

### useReducer()：action 钩子

React 本身不提供状态管理功能，通常需要使用外部库。这方面最常用的库是 Redux。

Redux 的核心概念是，组件发出 action 与状态管理器通信。状态管理器收到 action 以后，使用 Reducer 函数算出新的状态，Reducer 函数的形式是(state, action) => newState。

useReducers()钩子用来引入 Reducer 功能。

```
const [state, dispatch] = useReducer(reducer, initialState);
```

上面是useReducer()的基本用法，它接受 Reducer 函数和状态的初始值作为参数，返回一个数组。数组的第一个成员是状态的当前值，第二个成员是发送 action 的dispatch函数。

下面是一个计数器的例子。用于计算状态的 Reducer 函数如下。

```
const myReducer = (state, action) => {
  switch(action.type)  {
    case('countUp'):
      return  {
        ...state,
        count: state.count + 1
      }
    default:
      return  state;
  }
}
```

组件代码如下。

```
const App = () => {
  const [state, dispatch] = useReducer(myReducer, { count:   0 });
  return  (
    <div className="App">
      <button onClick={() => dispatch({ type: 'countUp' })}>
        +1
      </button>
      <p>Count: {state.count}</p>
    </div>
  );
}
```

由于 Hooks 可以提供共享状态和 Reducer 函数，所以它在这些方面可以取代 Redux。但是，它没法提供中间件（middleware）和时间旅行（time travel），如果你需要这两个功能，还是要用 Redux。

### 创建自己的 Hooks

上例的 Hooks 代码还可以封装起来，变成一个自定义的 Hook，便于共享。

```
const usePerson = (personId) => {
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState({});
  useEffect(() => {
    setLoading(true);
    fetch(`https://swapi.co/api/people/${personId}/`)
      .then(response => response.json())
      .then(data => {
        setPerson(data);
        setLoading(false);
      });
  }, [personId]);  
  return [loading, person];
};
```

上面代码中，usePerson()就是一个自定义的 Hook。

Person 组件就改用这个新的钩子，引入封装的逻辑。

```
const Person = ({ personId }) => {
  const [loading, person] = usePerson(personId);

  if (loading === true) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>You're viewing: {person.name}</p>
      <p>Height: {person.height}</p>
      <p>Mass: {person.mass}</p>
    </div>
  );
};
```

[React Hooks 教程](http://www.ruanyifeng.com/blog/2019/09/react-hooks.html) 
[React Hooks 原理](https://github.com/brickspert/blog/issues/26) 




