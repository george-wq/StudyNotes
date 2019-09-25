# React Hooks

>Hook 是 React 16.8 的新增特性。它是函数式组件，它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

在 react hook中我们需要理解它的数据(state、props)和生命周期。useState Hook && useEffect Hook

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