# React-router详解

>知其然知其所以然，我先用react实现react router的实现原理

HashHistory

```
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const AA = () => <div>AA</div>
const BB = () => <div>BB</div>

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: window.location.hash
    }
  }

  static childContextTypes = {
    hash: PropTypes.string,
  }

  getHash = () => window.location.hash.replace('#', '');

  getChildContext() {
    return {
      hash: this.getHash()
    }
  }

  componentDidMount() {
    // 监听hash的改变
    window.onhashchange = () => {
      this.setState({
        hash: this.getHash()
      })
    }
  }

  render() {
    return (
      <>
        {this.props.children}
      </>
    )
  }
}

class Route extends Component {
  static contextTypes = {
    hash: PropTypes.string
  }
  render() {
    const { path, component } = this.props;
    const { hash } = this.context;
    console.log(hash);
    // 创建组件实例 (类似于<AA />)
    // const instance = React.createElement(component, null, null);
    return (
      <>
        {path === hash && React.createElement(component, null, null)}
      </>
    )
  }
}

window.onhashchange = function (event) {
  console.log(event.oldURL);
  console.log(event.newURL);
  console.log(window.location.hash);
};

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>Header</div>
          <Route path="/aa" component={AA} />
          <Route path="/bb" component={BB} />
        </Router>
      </div>
    )
  }
}

export default App;
```

BroserHistory

```
import React from 'react';
import './App.css';
import PropTypes from 'prop-types'

window.onhashchange = function(event) {
  console.log(event.oldURL);
  console.log(event.newURL);
  console.log(window.location.hash);
};

class Router extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      url: window.location.pathname
    }
    this.history = window.history
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
    // window.onhashchange = () => {
    //   this.setState({
    //     hash: this.getHash()
    //   })
    // }
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

    let instance = React.createElement('div', component)
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

## react-router v4 switch关键字的使用场景及作用

有<Switch>标签，则其中的<Route>在路径相同的情况下，只匹配第一个，这个可以避免重复匹配；
无<Switch>标签，则其中的<Route>在路径相同的情况下全都会匹配。更严重的是，还会匹配上级路径的
结论：为了更好地匹配规则，轻易不要舍弃<Switch>


## 阐述react-router hashHistory 和 browserHistory 的主要区别

hashHistory 访问是 #/active?user='george' 一般纯前端会用hashHistory

browserHistory 访问是 /active?user='george' 官方推荐使用browserHistory，使用browserHistory需要后端配合(nodejs 或者 nginx), 前端需要配置一个basename (类似于webpack中的publicpath), basename后的路径是nginx配置。

browserHistory 优点:
1. 单点登录时能带上前端路由
2. 能统计到前端路由访问情况
2. 对SEO友好

browserHistory 缺点：
1. 分不清前端后端
2. 需要服务端支持