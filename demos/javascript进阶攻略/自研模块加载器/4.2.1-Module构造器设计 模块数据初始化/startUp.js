(function(global) {
	var startUp = global.startUp = {
		version: "1.0.1",
	}
	var data = {};
	var cache = {};
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
		//var uris = module.resolve(); //获取主干上的依赖项
		//var len = module._remain = uris.length;  
		//加载主干上的依赖项(模块)
	}
	
	//资源定位
	Module.prototype.resolve = function(){
		
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
		console.log(module)
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
