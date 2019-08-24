(function(global) {
	var startUp = global.startUp = {
		version: "1.0.1",
	}
	var data = {};
	var cache = {};
	var anonymousMeta = {};
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

	var isString = function(obj) {
		return toString.call(obj) === "[object String]";
	}

	function scripts() {
		return document.getElementsByTagName('script');
	}

	function getInteractiveScript() {
		var arrS = scripts();
		var dataMain, src;
		var exp = /^.*\.js$/;
		arrS = [].slice.call(arrS);
		arrS.forEach(function(script) {
			dataMain = script.getAttribute('data-main');
			if (dataMain && !data.baseUrl && !(exp.test(dataMain))) {
				if (dataMain.substring(dataMain.length - 1) !== "/") {
					dataMain = (dataMain + "/");
				}
				data.baseUrl = dataMain;
			}
		});
	}
	getInteractiveScript();

	function parseAlias(id) { 
		var alias = data.alias; 
		return alias && isString(alias[id]) ? alias[id] : id;
	}

	var PATHS_RE = /^([^\/:]+)(\/.+)$/; 

	function parsePaths(id) {
		var paths = data.paths; 
		if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
			id = paths[m[1]] + m[2]
		}
		return id;
	}

	function normalize(path) {
		var last = path.length - 1;
		var lastC = path.charAt(last);
		return (lastC === "/" || path.substring(last - 2) === ".js") ? path : path + ".js";

	}

	function addBase(id, uri) {
		var result = data.baseUrl ? data.cwd + data.baseUrl + id : data.cwd + id;
		console.log(result)
		return result;
	}

	var DOT_RE = /\/.\//g;  
	function relapath(path) {
		path = path.replace(DOT_RE, "/");
		return path;
	}
    
	//路径解析  API   b.js   == child
	startUp.resolve = function(child, parent) {
		if (!child) return "";
		child = parseAlias(child); 
		child = parsePaths(child); 
		child = normalize(child); 
		return addBase(child, parent); 
	}


	//
	startUp.request = function(url, callback) {
		var node = document.createElement("script");
		node.src = url;
		document.body.appendChild(node);
		node.onload = function() {
			callback();
		}
	}

	function Module(uri, deps) {
		this.uri = uri;
		this.deps = deps || [];
		this.exports = null;
		this.status = 0;
		this._waitings = {};
		this._remain = 0;
	}

	Module.prototype.load = function() {
		var m = this; 
		m.status = status.LOADING;
		var uris = m.resolve(); 
		var len = m._remain = uris.length;
		var seed;
		for (var i = 0; i < len; i++) {
			seed = Module.get(uris[i]); 
			seed.e = true;
			if (seed.status < status.LOADED) {
				seed._waitings[m.uri] = seed._waitings[m.uri] || 1;
			} else {
				m._remain--; 
			}
		}
		if (m._remain == 0) {
			m.onload();
		};

		var requestCache = {};
		for (var i = 0; i < len; i++) {
			seed = Module.get(uris[i]);
			if (seed.status < status.FETCHED) {
				seed.fetch(requestCache);
			}
		}

		for (uri in requestCache) {
			requestCache[uri]();
		}
	}

	Module.prototype.fetch = function(requestCache) {
		var m = this;
		m.status = status.FETCHED;
		var uri = m.uri;
		requestCache[uri] = sendRequest; 

		function sendRequest() {
			startUp.request(uri, onRequest);
		}

		function onRequest() {
			if (anonymousMeta) {
				m.save(uri, anonymousMeta);
			}
			m.load(); 
		}
	}

	Module.prototype.onload = function() {
		var mod = this; 
		mod.status = status.LOADED; 
		if (mod.callback) {
			mod.callback();
		}
		var waitings = mod._waitings;
		var key, m;
		for (key in waitings) {
			var m = cache[key];
			m._remain -= waitings[key];
			if (m._remain == 0) {
				m.onload();
			}
		}

	}

	Module.prototype.save = function(uri, meta) {
		var mod = Module.get(uri);
		mod.uri = uri;
		mod.deps = meta.deps || [];
		mod.factory = meta.factory;
		mod.status = status.SAVED;
	}

	Module.prototype.exec = function() {
		var module = this;
		if (module.status >= status.EXECUTING) {
			return module.exports;
		}
		module.status = status.EXECUTING;
		var uri = module.uri;

		function require(id) {
			return Module.get(require.resolve(id)).exec(); 
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

	Module.prototype.resolve = function() {
		var mod = this;
		var ids = mod.deps; 
		var uris = [];
		for (var i = 0; i < ids.length; i++) {
			uris[i] = startUp.resolve(ids[i], mod.uri); 
		}
		return uris;
	}

	Module.define = function(factory) {
		var deps;
		if (isFunction(factory)) {
			deps = parseDependencies(factory.toString());
		}
		var meta = {
			id: "",
			uri: "",
			deps: deps,
			factory: factory
		}
		anonymousMeta = meta;
	}

	Module.get = function(uri, deps) {
		return cache[uri] || (cache[uri] = new Module(uri, deps));
	}

	Module.use = function(deps, callback, uri) {
		var m = Module.get(uri, isArray(deps) ? deps : [deps]); 
		m.callback = function() {
			var exports = []; 
			var uris = m.resolve();
			for (var i = 0; i < uris.length; i++) {
				exports[i] = cache[uris[i]].exec(); 
			}
			if (callback) {
				callback.apply(global, exports);
			}
		}
		m.load();
	}

	var _cid = 0;

	function cid() {
		return _cid++;
	};

	data.preload = [];
	data.cwd = document.URL.match(/[^?]*\//)[0];
	Module.preload = function(callback) {
		var length = data.preload.length;
		if (!length) callback();
	};

	startUp.use = function(list, callback) {
		Module.preload(function() {
			Module.use(list, callback, data.cwd + "_use_" + cid()); 
		});
	}

	startUp.config = function(options) {
		var key, curr;
		for (key in options) {
			curr = options[key];
			data[key] = curr; 
		}
	}

	var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
	var REQUIRE_RE = /\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g;

	function commentReplace(match, multi, multiText, singlePrefix) {
		return singlePrefix || '';
	}

	function parseDependencies(code) {
		var ret = []
		code.replace(commentRegExp, commentReplace).replace(REQUIRE_RE, function(m, m1, m2) {
			if (m2) ret.push(m2);
		});
		return ret
	};

	global.define = Module.define;
})(this);
