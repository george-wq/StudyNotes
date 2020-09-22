# React-router原理

背景：前后端分离式开发的流行，前端用自己的方式管理路由，前端有套完整的页面栈，前端路由就是做入栈出栈过程这件事的。   

前端路由实现起来其实很简单，本质就是监听 URL 的变化，然后匹配路由规则，显示相应的页面，并且无须刷新。目前单页面使用的路由就只有两种实现方式

1. hash 模式
2. history 模式

>www.test.com/##/ 就是 Hash URL，当 ## 后面的哈希值发生变化时，不会向服务器请求数据，可以通过 hashchange 事件来监听到 URL 的变化，从而进行跳转页面。

1. www.test.com/##/yck => 点击跳转或者浏览器历史跳转 ＝> 触发hashchange事件 => 解析url => 匹配到对应的路由，跳转到yck页面 => DOM替换方式更改页面内容
2. www.test.com/##/yck => 手动刷新 ＝> 不会向服务端发送请求，但是也不会触发hashchange事件，可以通过load事件 => 解析url => 匹配到对应的路由，跳转到yck页面 => DOM替换方式更改页面内容

History 模式是 HTML5 新推出的功能，比之 Hash URL 更加美观
参考：https://yuchengkai.cn/docs/frontend/framework.html#%E8%B7%AF%E7%94%B1%E5%8E%9F%E7%90%86 

React-router中的实现方式
1. hashHistory, Hash history 使用 URL 中的 hash（#）部分去创建形如 example.com/#/some/path 的路由。
2. browserHistory, Browser history 是使用 React Router 的应用推荐的 history。它使用浏览器中的 History API 用于处理 URL，创建一个像example.com/some/path这样真实的 URL 。
3. createMemoryHistory, Memory history 不会在地址栏被操作或读取。这就解释了我们是如何实现服务器渲染的。同时它也非常适合测试和其他的渲染环境（像 React Native ）。
                   
hashHistory
优点：简单；浏览器支持好；不会和服务器路由耦合；
缺点：http请求里没有前端路由信息；锚点功能失效；对SEO不友好；

browserHistory
优点：单点登陆时能带上前端路由；能统计到前端路由访问情况；对SEO友好;
缺点：分不清前端与后段；需要服务端支持；

实现如下：

```
// hashHistory

import React from 'react';
import './App.css';
import PropTypes from 'prop-types';

window.onhashchange = function(event) {
  console.log(event.oldURL);
  console.log(event.newURL);
  console.log(window.location.hash);
};

class Router extends React.Component{

  getHash(){
    let url = window.location.hash.replace('#','')
    return url;
  }

  constructor(props) {
    super(props);
    this.state = {
      hash: window.location.hash
    }
  }

  render() {
    return (
      <>
        {this.props.children}
      </>
    );
  }

  static childContextTypes = {
    hash: PropTypes.string,
  }

  getChildContext () {
    return {
      hash: this.getHash()
    }
  }


  componentDidMount() {
    window.onhashchange = () => {
      this.setState({
        hash: this.getHash()
      })
    }
  }

}

class Route extends React.Component{

  static contextTypes = {
    hash: PropTypes.string
  }

  render() {
    const {
      component,
      path
    } = this.props
    const {
      hash
    } = this.context

    return (
      <>
        {hash === path &&  React.createElement(component,null,null)}
      </>
    );
  }
}

const AA = () => <div>aa</div>
const BB = () => <div>bb</div>

function HashHistoryDemo() {
  return (
    <div className="App">
      <Router >
        <header className="App-header">
          <div>header</div>
          <Route path='/aa' component={AA}/>
          <Route path='/bb' component={BB}/>
        </header>
      </Router>

    </div>
  );
}

export default HashHistoryDemo;

```

```
// browserHistory

import React from 'react';
import './App.css';
import PropTypes from 'prop-types'

class Router extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      url: window.location.pathname
    }
    this.history = window.history;
    this.history.route = (name) => {
      this.setState({
        url: `/${name}`
      })
      window.history.pushState(null,null,name)
    }
  }

  render() {
    return (
      <>
        {this.props.children}
      </>
    );
  }

  static childContextTypes = {
    url: PropTypes.string,
    history: PropTypes.object
  }

  getChildContext () {
    return {
      url: this.state.url,
      history: this.history
    }
  }

  componentDidMount() {
    window.onpopstate = (a) => {
      console.log(a)
    }
  }

}

class Route extends React.Component{

  static contextTypes = {
    url: PropTypes.string,
    history: PropTypes.object
  }

  render() {
    const {
      component,
      path
    } = this.props
    const {
      url
    } = this.context
    return (
      <>
        {url === path &&  React.createElement(component,null,null)}
      </>
    );
  }
}

const AA = () => <div>aa</div>
const BB = () => <div>bb</div>

function App() {
  return (
    <div className="App">
      <Router >
        <header className="App-header">
          <div>header</div>
          <Route path='/aa' component={AA}/>
          <Route path='/bb' component={BB}/>
        </header>
      </Router>

    </div>
  );
}

export default App;


```

参考： https://yuchengkai.cn/docs/frontend/framework.html#%E8%B7%AF%E7%94%B1%E5%8E%9F%E7%90%86 
