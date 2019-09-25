# React & ES6

### [变量的赋值与解构](http://es6.ruanyifeng.com/)

### [Proxy拦截器](http://es6.ruanyifeng.com/#docs/proxy)

```
let obj = new Proxy({
	a: 10,
	b: 20
}, {
	get: function(target, key) {
		return target[key] * 10
	},
	set: function(target, key, value) {
		return Reflect.set(target, key, value)
	}
})
obj.a // 100
```

### async & await 用法 (待详细学习)

```
async componentDidMount() {
  let {
    data: {
      data
    }
  } = await axios.get('http://localhost:7777/api')
  console.log(data)
  let value = await this.getValue()
  console.log(value)
}

// 等同于
componentDidMount() {
  axios.get('http://localhost:7777/api').then({
    data: {
      data
    }
  } => {
    console.log(data)
    this.getValue().then(value=> {
      console.log(value)
    })
  })
}
```

### Class 的基本语法 (getter、setter)



