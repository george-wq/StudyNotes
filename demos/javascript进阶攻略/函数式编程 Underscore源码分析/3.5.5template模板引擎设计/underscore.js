(function(root) {
	var push = Array.prototype.push;

	var _ = function(obj) {
		if (obj instanceof _) {
			return obj;
		}

		if (!(this instanceof _)) {
			return new _(obj);
		}
		this._wrapped = obj;
	}

	//数组去重
	_.uniq = _.unique = function(array, isSorted, iteratee, context) {
		// 没有传入 isSorted 参数
		if (!_.isBoolean(isSorted)) {
			context = iteratee;
			iteratee = isSorted;
			isSorted = false;
		}

		// 如果有迭代函数
		if (iteratee != null)
			iteratee = cb(iteratee, context);
		var result = [];
		var seen;

		for (var i = 0; i < array.length; i++) {
			var computed = iteratee ? iteratee(value, i, array) : array[i];
			if (isSorted) {
				if (!i || seen !== computed) result.push(computed);
				seen = computed; //  1
			} else if (result.indexOf(computed) === -1) {
				result.push(computed);
			}
		}

		return result;
	};

	//开启链接式的调用
	_.chain = function(obj) {
		var instance = _(obj);
		instance._chain = true;
		return instance;
	}

	//辅助函数
	var result = function(instance, obj) {
		return instance._chain ? _(obj).chain() : obj;
	}

	_.prototype.value = function() {
		return this._wrapped;
	}

	_.functions = function(obj) {
		var result = [];
		var key;
		for (key in obj) {
			result.push(key);
		}
		return result;
	}

	//映射
	_.map = function(obj, iteratee, context) {
		//生成不同功能迭代器
		var iteratee = cb(iteratee, context);
		//分辨 obj是数组对象, 还是object对象
		var keys = !_.isArray(obj) && Object.keys(obj);
		var length = (keys || obj).length;
		var result = Array(length);

		for (var index = 0; index < length; index++) {
			var currentKey = keys ? keys[index] : index;
			result[index] = iteratee(obj[currentKey], index, obj);
		}

		return result;
	}

	var cb = function(iteratee, context, count) {
		if (iteratee == null) {
			return _.identity;
		}

		if (_.isFunction(iteratee)) {
			return optimizeCb(iteratee, context, count);
		}
	}

	//optimizeCb优化迭代器
	var optimizeCb = function(func, context, count) {
		if (context == void 0) {
			return func;
		}

		switch (count == null ? 3 : count) {
			case 1:
				return function(value) {
					return func.call(context, value);
				};
			case 3:
				return function(value, index, obj) {
					return func.call(context, value, index, obj);
				};
			case 4:
				return function(memo, value, index, obj) { //回调函数 = 包装 >  迭代器
					return func.call(context, memo, value, index, obj); //调用回调
				};
		}
	}

	_.identity = function(value) {
		return value;
	}

	// rest 参数
	_.restArguments = function(func) {
		//rest参数位置
		var startIndex = func.length - 1;
		return function() {
			var length = arguments.length - startIndex,
				rest = Array(length),
				index = 0;
			// rest数组中的成员
			for (; index < length; index++) {
				rest[index] = arguments[index + startIndex];
			}
			//非rest参数成员的值一一对应
			var args = Array(startIndex + 1);
			for (index = 0; index < startIndex; index++) {
				args[index] = arguments[index];
			}

			args[startIndex] = rest;
			return func.apply(this, args);
		}
	}

	var Ctor = function() {};

	//Object.create polyfill
	var baseCreate = function(prototype) {
		if (!_.isObject(prototype)) return {};
		if (Object.create) return Object.create(prototype);
		Ctor.prototype = prototype;
		var result = new Ctor;
		Ctor.prototype = null;
		return result;
	};

	var createReduce = function(dir) {
		//累加
		var reduce = function(obj, iteratee, memo, init) {
			//obj  数组对象     keys === undefined
			//obj  object对象  keys  === [自身可枚举的所有的属性名称]
			var keys = !_.isArray(obj) && Object.keys(obj),
				length = (keys || obj).length,
				index = dir > 0 ? 0 : length - 1;
			if (!init) {
				memo = obj[keys ? keys[index] : index];
				index += dir; //1   
			};
			for (; index >= 0 && index < length; index += dir) {
				var currnteKey = keys ? keys[index] : index;
				memo = iteratee(memo, obj[currnteKey], currnteKey, obj) //[1,2,3,4]   {name:"max"}
			}
			return memo;
		}
		//memo  最终能累加的结果     每一次累加的过程
		return function(obj, iteratee, memo, context) {
			var init = arguments.length >= 3;
			//context === undefined   iteratee
			return reduce(obj, optimizeCb(iteratee, context, 4), memo, init);
		}
	}
	_.reduce = createReduce(1); //_.reduce(obj, function(){}, {});    回调函数  => 迭代器  
	//predicate  真值检测(重点: 返回值)
	_.filter = _.select = function(obj, predicate, context) {
		var results = [];
		predicate = cb(predicate, context);
		_.each(obj, function(value, index, list) {
			if (predicate(value, index, list)) results.push(value);
		});
		return results;
	};

	//去掉数组中所有的假值   _.identity = function(value){return value};
	_.compact = function(array) {
		return _.filter(array, _.identity);
	};


	// 返回某一个范围内的数值组成的数组 5   stop == 5      start === 0   step === 1
	_.range = function(start, stop, step) {
		if (stop == null) {
			stop = start || 0;
			start = 0;
		}

		step = step || 1; //2
		// 返回数组的长度  返回大于等于参数x的最小整数 向上取整 10/2  5
		var length = Math.max(Math.ceil((stop - start) / step), 0);
		// 返回的数组
		var range = Array(length);
		for (var index = 0; index < length; index++, start += step) { //1+2
			range[index] = start;
		}
		return range;
	};


	_.each = function(target, callback) {
		var key, i = 0;
		if (_.isArray(target)) {
			var length = target.length;
			for (; i < length; i++) {
				callback.call(target, target[i], i);
			}
		} else {
			for (key in target) {
				callback.call(target, key, target[key]);
			}
		}

	}
	/*
      createReduce  工厂函数生成reduce 
     */
	var createReduce = function(dir) {
		//累加
		var reduce = function(obj, iteratee, memo, init) {
			var keys = !_.isArray(obj) && _.keys(obj),
				length = (keys || obj).length,
				index = dir > 0 ? 0 : length - 1; //确定累加的方向
			if (!init) {
				memo = obj[keys ? keys[index] : index];
				index += dir;
			};
			for (; index >= 0 && index < length; index += dir) {
				var currnteKey = keys ? keys[index] : index;
				memo = iteratee(memo, obj[currnteKey], currnteKey, obj)
			}
			return memo;
		}
		//memo  第一次累加的时候初始化的值 || 数组数据中下标为0的值
		return function(obj, iteratee, memo, context) {
			var init = arguments.length >= 3;
			return reduce(obj, optimizeCb(iteratee, context, 4), memo, init);
		}
	}
	_.reduce = createReduce(1);

	//延迟执行
	_.delay = function(func, wait) {
		var args = [].slice.call(arguments, 2);
		return setTimeout(function() {
			func.apply(null, args); //["max"]
		}, wait);
	}

	//函数组合
	_.compose = function() {
		var args = arguments;
		//处理函数  数据
		var start = args.length - 1; //倒叙调用
		return function() {
			var i = start;
			var result = args[i].apply(null, arguments); //args[i] === C     arguments === 2
			while (i--) {
				result = args[i].call(null, result); //输出 === 返回值        输入 ===  参数
			}
			return result;
		}
	}

	//实体编码    <script>  &lt;a&gt;....
	var escapeMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'`': '&#x60;',
	};

	var createEscaper = function(map) {
		//replace
		var escaper = function(match) {
			return escapeMap[match]
		}
		var source = '(?:' + Object.keys(map).join("|") + ')';
		//正则
		var testRegExp = new RegExp(source, "g"); //
		//console.log(testRegExp)
		return function(string) {
			return testRegExp.test(string) ? string.replace(testRegExp, escaper) : string;
		}
	}

	_.escape = createEscaper(escapeMap);

	//时间戳(单位: ms)   /1000 (单位: s)
	_.now = Date.now;

	/*
	节流函数
	func  处理函数
	wait  指定毫秒
	options 配置  {leading:false, trailing:false }
	*/
	_.throttle = function(func, wait, options) {
		var context, args, result;
		var timeout = null;
		//上一次在执行回调的时间戳   初始值
		var lastTime = 0;
		if (!options) {
			options = {};
		}

		var later = function() {
			lastTime = options.leading === false ? 0 : _.now();
			timeout = null;
			result = func.apply(context, args);
		}
		return function() {
			//时间戳
			var now = _.now();
			//console.log(now)  1558614694319
			//立即执行   根据wait调用回调函数
			if (!lastTime && options.leading === false) {
				//将lastTime的时间戳设置为now
				lastTime = now;
			}
			//距离下一次调用func 还需要等待多长时间  now 第二次触发onscroll   lastTime  第一次触发onscroll 
			var remaining = wait - (now - lastTime); //wait === 1000   
			context = this;
			args = arguments;
			console.log(remaining); //options.leading === false   remaining=>1000   options.leading === undefined  remaining=> -1558615774941
			if (remaining <= 0) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				lastTime = now;
				result = func.apply(context, args);
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		}
	}

	/*
	_.debounce(function, wait, [immediate]) 
    immediate  === false   等待wait毫秒之后去调动处理函数
    immediate  === true  立即执行处理函数
    */

	_.debounce = function(func, wait, immediate) {
		//上一次在执行回调的时间戳   第一次执行处理函数初始值
		var lastTime, timeout, context, args, result;

		var later = function() {
			//间隔    定时器的回调later方法调用的时间戳 和debounce执行他返回的匿名函数最后一次的时间戳的间隔
			var last = _.now() - lastTime;
			console.log(last); //1002
			if (last < wait) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if (!immediate) { //执行处理函数
					result = func.apply(context, args);
				}
			}
		}
		return function() {
			context = this;
			args = arguments;
			lastTime = _.now();
			//立即执行触发必须满足两个条件  immediate === true  timeout  ===  undefined
			var callNow = immediate && !timeout;
			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
			if (callNow) {
				result = func.apply(context, args);
				//解除引用
				context = args = null;
			}
			return result;
		}
	}

	var hasOwnProperty = Object.hasOwnProperty;
	//属性检测
	_.has = function(obj, key) {
		return obj !== null && hasOwnProperty.call(obj, key);
	}

	var hasEnumbug = ({
		toString: null
	}).propertyIsEnumerable("toString"); //正常浏览器 => true
	var colletNotEnumProps = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString',
		'toString', 'valueOf'
	];
	//获取object对象上所有属性的名称(自身可枚举的属性)   
	_.keys = function(obj) {
		var prop;
		if (!_.isObject(obj)) {
			return []
		};
		//判断浏览器是否支持Object.keys() 优先使用
		if (Object.keys) {
			return Object.keys(obj);
		}
		var result = [];
		for (var key in obj) {
			result.push(key);
		}
		//IE>9  bug
		if (!hasEnumbug) {
			for (var i = 0, length = colletNotEnumProps.length; i < length; i++) {
				prop = colletNotEnumProps[i];
				if (obj[prop] !== obj.__proto__[prop]) {
					result.push(prop);
				}
			}
		}
		return result;
	}

	//获取object对象上所有属性的名称(自身+原型链可枚举的属性) 
	_.allKeys = function(obj) {
		var prop;
		if (!_.isObject(obj)) {
			return []
		};
		var result = [];
		for (var key in obj) {
			result.push(key);
		}
		//IE>9  bug
		if (!hasEnumbug) {
			for (var i = 0, length = colletNotEnumProps.length; i < length; i++) {
				prop = colletNotEnumProps[i];
				if (obj[prop] !== obj.__proto__[prop]) {
					result.push(prop);
				}
			}
		}
		return result;
	}

	//_.values  获取obj对象上所有课枚举属性的值      
	_.invert = function(obj) {
		var result = {};
		var keys = _.keys(obj); //属性的名称  key   obj[key]
		for (var i = 0, length = keys.length; i < length; i++) {
			result[obj[keys[i]]] = keys[i];
		}
		return result;
	}

	var createAssigner = function(func) {
		return function(obj) {
			var length = arguments.length;
			if (length < 2 || obj == null) {
				return obj
			};

			for (var i = 1; i < length; i++) {
				var source = arguments[i];
				var keys = func(source); //data
				var len = keys.length;
				for (var j = 0; j < len; j++) {
					var key = keys[j]; //data
					obj[key] = source[key]; //
				}
			}
			return obj;
		}
	}

	//jQuery  extend   对象扩展  $.extend({}, object1, object2);    for in
	_.extend = createAssigner(_.allKeys); //自身对象+原型链上可枚举的属性
	_.extendOwn = createAssigner(_.keys); //自身对象上可枚举的属性

	//浅克隆
	_.clone = function(obj) {
		if (!_.isObject(obj)) {
			return obj;
		}
		//创建副本
		return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	}

	//深克隆
	_.deepclone = function(obj) {
		//待克隆的对象是数组还是object 
		if (_.isArray(obj)) {
			//映射到一个新的数组当中  深克隆
			return _.map(obj, function(elem) {
				return _.isArray(elem) || _.isObject(elem) ? _.deepclone(elem) : elem;
			});
		} else if (_.isObject(obj)) {
			//iteratee(memo, obj[currnteKey], currnteKey, obj) 
			return _.reduce(obj, function(memo, value, key) {
				memo[key] = _.isArray(value) || _.isObject(value) ? _.deepclone(value) : value;
				return memo;
			}, {})
		} else {
			return obj;
		}
	}


	//白名单
	_.pick = function(object, oiteratee, context) {
		var result = {};
		var iteratee, keys;
		if (object == null) {
			return result;
		}

		if (_.isFunction(oiteratee)) {
			keys = _.allKeys(object);
			//生成迭代器  oiteratee  封装
			iteratee = optimizeCb(oiteratee, context);
			console.log(iteratee)
		} else {
			keys = [].slice.call(arguments, 1);
			iteratee = function(value, key, object) {
				return key in object;
			}
		}

		for (var i = 0, length = keys.length; i < length; i++) {
			var key = keys[i];
			var value = object[key];
			console.log(iteratee)
			//满足条件
			if (iteratee(value, key, object)) {
				result[key] = value;
			}
		}
		return result;
	}

	//解析模板
	_.template = function(templateString, settings) {
		//默认规则
		var RULES = {
			interpolate: /<%=([\s\S]+?)%>/g, //变量
			escape: /<%-([\s\S]+?)%>/g, //HTML转义
			expression: /<%([\s\S]+?)%>/g //JavaScript 代码
		}
		settings = _.extend({}, RULES, settings);

		//解析 
		var matcher = new RegExp([
			settings.interpolate.source,
			settings.escape.source,
			settings.expression.source
		].join("|"), "g");

		var source = "_p+='";
		var index = 0;
		templateString.replace(matcher, function(match, interpolate, escape, expression, offset) {
			source += templateString.slice(index, offset).replace(/\n/g, function(){
				  return "\\n";
			});
			index = offset + match.length;
			if (interpolate) { //name  _p+='';
				source += "'+\n ((_t=(" + interpolate + ")) == null?'':_t)+\n'";
			} else if (escape) {

			} else if (expression) {   //obj.forEach(function(e, i, a){
				source +="';\n"+expression+"\n_p+='"
			}
		});
		source += " ';";
		source = "with(obj){\n" + source + "}\n"
		//渲染函数    字符串
		source = "var _t,_p='';" + source + "return _p;\n";
        console.log(source)
		//data 传参的问题  预编译
		var render = new Function("obj", source);

		var template = function(data) {
			return render.call(null, data); //renderString
		}
		return template;
	}
    /*
	_p+='hello: '+((_t=( name )) == null?'':_t)+' ';
	_p+='';
	obj.forEach(function(e, i, a){}
	_p+='
	*/

	//类型检测
	_.isArray = function(array) {
		return toString.call(array) === "[object Array]";
	}

	_.isObject = function(obj) {
		var type = typeof obj;
		return type === "function" || type === "object";
	}

	_.each(["Function", "String", "Number", "Boolean"], function(name) {
		_["is" + name] = function(obj) {
			return toString.call(obj) === "[object " + name + "]";
		}
	});

	//mixin  
	_.mixin = function(obj) {
		_.each(_.functions(obj), function(name) {
			var func = obj[name];

			_.prototype[name] = function() {
				var args = [this._wrapped];
				push.apply(args, arguments);
				// instance      去重之后的结果
				return result(this, func.apply(this, args));
			}
		});
	}

	_.mixin(_);
	root._ = _;
})(this);
