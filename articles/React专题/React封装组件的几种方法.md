# React封装组件的几种方法

## 方法组件

直接用方法调用组件

适用场景: loading, input, confirm, tooltip, message

组件的挂载: ReactDOM.render(<Loading />, document.getElementById('root'));
组件的卸载: ReactDOM.unmountComponentAtNode(document.getElementById('root'));

Loading.js
```
import ReactDOM from "react-dom";
import React from "react";
import './index.css'

class Loading extends React.Component{
	render() {
		return (
			<div className='loading'>
				<div className='loading__mask'></div>
				<div className='loading__content'>
					loading
				</div>
			</div>
		);
	}
}
let node = null
const loading = {
	show() {
		node = document.createElement('div');
		document.body.appendChild(node);
		ReactDOM.render(<Loading />, node);
	},
	hide() {
		if(node) {
			ReactDOM.unmountComponentAtNode(node);
			document.body.removeChild(node);
		}
	}
}

export default loading;
```

App.js
```
import React, { Component } from 'react';
import loading from './loading/Loading';
import './App.css';

class App extends Component {
  componentDidMount() {
    // loading
    loading.show();
    setTimeout(() => {
      loading.hide();
    }, 2000);
  }
  render() {
    return (
      <div className="App">
        <button>点我</button>
      </div>
    )
  }
}

export default App;
```

## 装饰器

装饰器的基本用法(待学习)

接下来我们学习一下在React中组件用法: 反向继承、属性代理(待学习)

反向继承

```
import React, { Component } from 'react';

const loading = Com => {
  class LoadingComponent extends Com {
    constructor(props) {
      super(props);
      this.state = {
        loading: false
      }
    }
    showLoading = () => {
      this.setState({
        loading: true
      });
    }
    hideLoading = () => {
      this.setState({
        loading: false
      });
    }
    render() {
      const { loading } = this.state;
      return (
        <div>
          {super.render()}
          <div>{loading ? 'loading...' : ''}</div>
        </div>
      )
    }
  }
  return LoadingComponent;
}

@loading // @loading相当于 let NewApp = loading(Decorator);
class Decorator extends Component {
  componentDidMount() {
		// 调用loading
    this.showLoading();
    setTimeout(() => {
			// 去掉loading
      this.hideLoading();
    }, 3000)
  }
  render() {
    return (
      <div>
        <div>ExtendTest</div>
      </div>
    )
  }
}

export default Decorator;
```

## 基于Antd封装组件

封装Icon组件,在[iconfont](www.iconfont.cn)中选取Icon, 然后添加至项目，下载至本地，防置项目中

Layout.js

```
import React, { Component } from 'react';
import Icon from './react-ui/Icon';

class Layout extends Component {
  render() {
    return (
      <Icon name="icon-down-circle" />
    )
  }
}

export default Layout;
```

Icon.js
```
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../react-icon/iconfont.css'

class Icon extends Component {
  // 规范react组件属性类型
  static propTypes = {
    name: PropTypes.string
  }
  static defaultProps = {
    name: ''
  }
  render() {
    const { name } = this.props;
    return (
      <span className={`icon iconfont ${name}`} ></span>
    )  
  }
}

export default Icon;
```

