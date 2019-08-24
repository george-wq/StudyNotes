(function(global) {
	var startUp = global.startUp = {
		version: "1.0.1",
	}
	var data = {};
	var cache = {};
	var anonymousMeta = {};
	//模块的生命周期
	var status = {
		FETCHED: 1,
		SAVED: 2,
		LOADING: 3,
		LOADED: 4,
		EXECUTING: 5,
		EXECUTED: 6,
	}

	var isArray = function(obj) {
		return toString.call(obj) === "[object Array]";
	}

	var isFunction = function(obj) {
		return toString.call(obj) === "[object Function]";
	}

	//是否使用了别名
	function parseAlias(id) { //a  b
		var alias = data.alias; //配置
		return alias && isString(alias[id]) ? alias[id] : id;
	}

	//不能以"/" ":"开头  结尾必须是一个"/" 后面跟随任意字符至少一个
	var PATHS_RE = /^([^\/:]+)(\/.+)$/; //([^\/:]+)   路径的短名称配置

	// 检测是否 书写路径短名称
	function parsePaths(id) {
		var paths = data.paths; //配置
		if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
			id = paths[m[1]] + m[2]
		}
		return id;
	}

	//检测是否添加后缀
	function normalize(path) {
		var last = path.length - 1;
		var lastC = path.charAt(last);
		return (lastC === "/" || path.substring(last - 2) === ".js") ? path : path + ".js";

	}

	//添加根目录
	function addBase(id, uri) {
		var result;
		if (id.charAt(0) === ".") {
			result = relapath((uri ? uri.match(/[^?]*\//)[0] : data.cwd) + id);
		} else {
			result = data.cwd + id;
		}
		return result;
	}

	var DOT_RE = /\/.\//g; // 规范路径  "/./" => "/"   
	function relapath(path) {
		path = path.replace(DOT_RE, "/");
		return path;
	}

	//生成绝对路径  parent child
	startUp.resolve = function(child, parent) {
		if (!child) return "";
		child = parseAlias(child); //检测是否有别名
		child = parsePaths(child); // 检测是否有路径别名 依赖模块中引包的模块路径地址 require("app/c");
		child = normalize(child); //检测是否添加后缀
		return addBase(child, parent); //添加根目录
	}

	startUp.request = function(url, callback) {
		var node = document.createElement("script");
		node.src = url;
		document.body.appendChild(node);
		node.onload = function() {
			//node.onload = null;
			//document.body.removeChild(node); 
			callback();
		}
	}

	//构造函数  模块初始化数据
	function Module(uri, deps) {
		this.uri = uri; // 当前模块的绝对路径
		this.deps = deps || []; // 当前模块依赖列表
		this.exports = null; // 当前模块对外暴露接口对象
		this.status = 0; // 当前模块状态
		this._waitings = {}; // 有多少依赖项
		this._remain = 0; // 还有多少个未加载项
	}

	//分析主干 (左子树 | 右子树) 上的依赖项
	Module.prototype.load = function() {
		var module = this;
		module.status = status.LOADING;
		var uris = module.resolve(); //获取主干上的依赖项
		var len = module._remain = uris.length;
		//console.log(uris)
		//加载主干上的依赖项(模块)
		var m;
		for (var i = 0; i < len; i++) {
			m = Module.get(uris[i]); //  创建缓存信息
			if (m.status < status.LOADED) {
				m._waitings[module.uri] = m._waitings[module.uri] || 1;
			} else {
				module._remain--;
			}
		}
		//如果依赖列表模块全都加载完毕
		if (module._remain == 0) {
			// module.onload();
		};

		//准备执行根目录下的依赖列表中的模块
		var requestCache = {};
		for (var i = 0; i < len; i++) {
			m = Module.get(uris[i]);
			if (m.status < status.FETCHED) {
				m.fetch(requestCache);
			}
		}

		for (uri in requestCache) {
			requestCache[uri]();
		}
	}

	//加载依赖列表中的模块
	Module.prototype.fetch = function(requestCache) {
		var module = this;
		console.log(module)
		module.status = status.FETCHED;
		var uri = module.uri;
		requestCache[uri] = sendRequest; //Document.createElement("script") 
		
		function sendRequest() {
			startUp.request(uri, onRequest);
		}

		function onRequest() {
			if (anonymousMeta) {
				module.save(uri, anonymousMeta);
			}
			module.load(); //递归 模块加载策略
		}
	}

	Module.prototype.onload = function() {
		var mod = this;
		mod.status = status.LOADED;
		if (mod.callback) {
			mod.callback();
		}
		//伪递归
		_waitings = mod._waitings;
		var uri, m;
		for (uri in _waitings) {
			//console.log(uri);   //根目录对应的Module实例对象
			m = cache[uri];
			m._remain -= _waitings[uri];
			if (m._remain == 0) {
				m.onload()
			};
		}

	}

	//更改初始化数据 
	Module.prototype.save = function(uri, meta) {
		var module = Module.get(uri); //是否在缓存
		module.id = uri;
		module.deps = meta.deps || [];
		module.factory = meta.factory;
		module.status = status.SAVED;
	}

	//获取模块对外的接口对象
	Module.prototype.exec = function() {
		var module = this;
		//防止重复执行
		if (module.status >= status.EXECUTING) {
			return module.exports;
		}
		module.status = status.EXECUTING; //5
		var uri = module.uri;

		function require(id) {
			//console.log(require.resolve(id));   //更新过后的数据
			return Module.get(require.resolve(id)).exec(); //获取接口对象
		}

		require.resolve = function(id) {
			return startUp.resolve(id, uri); 
		}

		var factory = module.factory;
		var exports = isFunction(factory) ? factory(require, module.exports = {}, module) : factory;

		if (exports === undefined) {
			exports = module.exports;
		}
		module.exports = exports;
		module.status = status.EXECUTED; 
		return exports;
	}

	//资源定位 解析依赖项生成绝对路径
	Module.prototype.resolve = function() {
		var mod = this;
		var ids = mod.deps; //["./a","./b"]
		var uris = [];
		for (var i = 0; i < ids.length; i++) {
			uris[i] = startUp.resolve(ids[i], mod.uri); //依赖项   (主干| 子树)
		}
		//console.log(uris)
		return uris;
	}

	//定义一个模块
	Module.define = function(factory) {
		var deps;
		if (isFunction(factory)) {
			//正则解析依赖项
			deps = parseDependencies(factory.toString());
		}
		//存储当前模块的信息
		var meta = {
			id: "",
			uri: "",
			deps: deps,
			factory: factory
		}
		anonymousMeta = meta;
	}

	//检测缓存对象上是否有当前模块信息
	Module.get = function(uri, deps) {
		return cache[uri] || (cache[uri] = new Module(uri, deps));
	}

	Module.use = function(deps, callback, uri) {
		var module = Module.get(uri, isArray(deps) ? deps : [deps]);
		//所有模块都加载完毕
		module.callback = function() {
			var exports = []; //所以依赖项模块的接口对象
			var uris = module.resolve();
			for (var i = 0; i < uris.length; i++) {
				exports[i] = cache[uris[i]].exec(); //获取模块对外定义的接口对象
			}
			if (callback) {
				callback.apply(global, exports);
			}
		}
		module.load();
	}

	var _cid = 0;

	function cid() {
		return _cid++;
	};

	data.preload = [];
	//获取当前项目文档的URL
	data.cwd = document.URL.match(/[^?]*\//)[0];
	console.log(document.URL);
	console.log(document.URL.match(/[^?]*\//));
	console.log(data.cwd);
	Module.preload = function(callback) {
		var length = data.preload.length;
		if (!length) callback();
		//length !== 0 先加载预先设定模块
	};

	// 启动模块加载器
	startUp.use = function(list, callback) {
		//检测有没有预先加载的模块
		Module.preload(function() {
			Module.use(list, callback, data.cwd + "_use_" + cid()); //虚拟的根目录
		});
	}

	var REQUIRE_RE = /\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g

	function parseDependencies(code) {
		var ret = []
		code.replace(REQUIRE_RE, function(m, m1, m2) {
			if (m2) ret.push(m2);
		});
		return ret
	};

	global.define = Module.define;
})(this);
