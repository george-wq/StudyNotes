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
		this.uri = uri;
		this.deps = deps || [];
		this.exports = null;
		this.status = 0;
		this._waitings = {};
		this._remain = 0;
	}

	//分析主干 (左子树 | 右子树) 上的依赖项
	Module.prototype.load = function() {
		var module = this;
		module.status = status.LOADING;
		var uris = module.resolve(); //获取主干上的依赖项
		var len = module._remain = uris.length;
		console.log(uris)
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
			Module.onload();
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
		document.cretaE

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
	
	//更改初始化数据 
	Module.prototype.save = function(uri, meta){
		
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

	}

	//检测缓存对象上是否有当前模块信息
	Module.get = function(uri, deps) {
		return cache[uri] || (cache[uri] = new Module(uri, deps));
	}

	Module.use = function(deps, callback, uri) {
		var module = Module.get(uri, isArray(deps) ? deps : [deps]);
		//所有模块都加载完毕
		module.callback = function() {

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
	console.log(data.cwd);
	Module.preload = function(callback) {
		var length = data.preload.length;
		if (!length) callback();
		//length !== 0 先加载预先设定模块
	};

	startUp.use = function(list, callback) {
		//检测有没有预先加载的模块  
		Module.preload(function() {
			Module.use(list, callback, data.cwd + "_use_" + cid()); //虚拟的根目录
		});
	}

	global.define = Module.define;
})(this);
