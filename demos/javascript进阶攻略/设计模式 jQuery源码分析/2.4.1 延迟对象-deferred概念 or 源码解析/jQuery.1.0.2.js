/*
 * @Author: Administrator
 * @Date:   2018-10-30 20:40:51
 * @Last Modified by:   Administrator
 * @Last Modified time: 2018-11-01 22:10:22
 */
(function(root) {
	var testExp = /^\s*(<[\w\W]+>)[^>]*$/;
	var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
	var version = "1.0.1";
	var optionsCache = {};
	var jQuery = function(selector, context) {
		return new jQuery.prototype.init(selector, context);
	}

	jQuery.fn = jQuery.prototype = { //原型对象
		length: 0,
		jquery: version,
		selector: "",
		init: function(selector, context) {
			context = context || document;
			var match, elem, index = 0;
			//$()  $(undefined)  $(null) $(false)  
			if (!selector) {
				return this;
			}

			if (typeof selector === "string") {
				if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
					match = [selector]
				}
				//创建DOM
				if (match) {
					//this  
					jQuery.merge(this, jQuery.parseHTML(selector, context));
					//查询DOM节点
				} else {
					elem = document.querySelectorAll(selector);
					var elems = Array.prototype.slice.call(elem);
					this.length = elems.length;
					for (; index < elems.length; index++) {
						this[index] = elems[index];
					}
					this.context = context;
					this.selector = selector;
				}
			} else if (selector.nodeType) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}

		},
		css: function() {
			console.log("di~~didi~~")
		},
		//....
	}

	jQuery.fn.init.prototype = jQuery.fn;


	jQuery.extend = jQuery.prototype.extend = function() {
		var target = arguments[0] || {};
		var length = arguments.length;
		var i = 1;
		var deep = false; //默认为浅拷贝 
		var option;
		var name;
		var copy;
		var src;
		var copyIsArray;
		var clone;

		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1];
			i = 2;
		}

		if (typeof target !== "object") {
			target = {};
		}

		if (length == i) {
			target = this;
			i--; //0   
		}

		for (; i < length; i++) {
			if ((option = arguments[i]) !== null) {
				for (name in option) {
					src = target[name];
					copy = option[name];
					if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}
						target[name] = jQuery.extend(deep, clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	}


	jQuery.extend({
		//类型检测     
		isPlainObject: function(obj) {
			return typeof obj === "object";
		},

		isArray: function(obj) {
			return toString.call(obj) === "[object Array]";
		},

		isFunction: function(fn) {
			return toString.call(fn) === "[object Function]";
		},
		//类数组转化成正真的数组  
		markArray: function(arr, results) {
			var ret = results || [];
			if (arr != null) {
				jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
			}
			return ret;
		},

		//合并数组
		merge: function(first, second) {
			var l = second.length,
				i = first.length,
				j = 0;

			if (typeof l === "number") {
				for (; j < l; j++) {
					first[i++] = second[j];
				}
			} else {
				while (second[j] !== undefined) {
					first[i++] = second[j++];
				}
			}

			first.length = i;

			return first;
		},

		parseHTML: function(data, context) {
			if (!data || typeof data !== "string") {
				return null;
			}
			//过滤掉<a>   <a>   => a 
			var parse = rejectExp.exec(data);
			console.log(parse)
			return [context.createElement(parse[1])];
		},

		//$.Callbacks用于管理函数队列
		callbacks: function(options) {
			options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {};
			var list = [];
			var index, length, testting, memory, start, starts;
			var fire = function(data) {
				memory = options.memory && data;
				index = starts || 0;
				start = 0;
				testting = true;
				length = list.length;
				for (; index < length; index++) {
					if (list[index].apply(data[0], data[1]) === false && options.stopOnfalse) {
						break;
					}
				}
			}
			var self = {
				add: function() {
					var args = Array.prototype.slice.call(arguments);
					start = list.length;
					args.forEach(function(fn) {
						if (!options.unique || list.indexOf(fn) === -1) {
							list.push(fn);
						}
						// if (toString.call(fn) === "[object Function]") {
						// 	list.push(fn);
						// }
					});
					if (memory) {
						starts = start;
						fire(memory);
					}
					return this;
				},
				//指定上下文对象
				fireWith: function(context, arguments) {
					var args = [context, arguments];
					if (!options.once || !testting) {
						fire(args);
					}

				},
				//参数传递
				fire: function() {
					self.fireWith(this, arguments);
				}
			}
			return self;
		},

		// 异步回调解决方案
		Deferred: function(func) {
			// 延迟对象的三种不同状态信息描述
			// 延迟对象的状态、 往队列中添加处理函数、创建队列(self副本的引用)、最终的状态信息描述
			var tuples = [
					["resolve", "done", jQuery.callbacks("once memory"), "resolved"],
					["reject", "fail", jQuery.callbacks("once memory"), "rejected"],
					["notify", "progress", jQuery.callbacks("memory")]
				],
				state = "pending", //pending 进行中的一种状态 
				
				// promise 属性和方法 state | then | promise | done | fail | progress
				promise = {
					state: function() {
						return state;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = [].slice.call(arguments);
						return jQuery.Deferred(function(newDeferred) {
							tuples.forEach(function(tuple, i) {
								var fn = fns[i] && jQuery.isFunction(fns[i]);
								deferred[tuple[1]](function() {
									var returned = fn && fn.apply(this, arguments);
									if (returned && jQuery.isFunction(returned.promise)) {
										returned.promise()
										.done(newDeferred.resolve)
										.fail(newDeferred.reject)
										.progress(newDeferred.notify)
									}
								});
							});
						}).promise();
					},
					promise: function(obj) {
						/**
						 * ??? 为什么调用了2次 =>
						 *  1 obj !== null 给obj(defrred对象扩展promise的方法和属性)  
						 *  2 调用when的时候会返回promise
						 */ 
						return obj != null ? jQuery.extend(obj, promise) : promise;
					}
				},
				
				/**
				 * // 延迟对象
				 * deferred 属性和方法  resolve | reject | notify | resolveWith | 
				 * rejectWith | notifyWith | state | then | promise | done | fail | progress
				 */ 
				deferred = {};

			tuples.forEach(function(tuple, i) {
				var list = tuple[2], // 创建Callbacks队列 self 对象副本的引用
					stateString = tuple[3]; // resolved, rejected 

				// promise[ done | fail | progress ] = list.add
				promise[tuple[1]] = list.add; // 拿到add方法的引用 只要调用了 就是往队列中添加处理函数

				// Handle state 
				if (stateString) {
					// ??? 为什么先往队列中添加这个函数
					list.add(function() {
						// state = [ resolved | rejected ]
						// console.log(stateString);
						state = stateString;
					});
				}

				// deferred[ resolve | reject | notify ] 演示对象的状态
				deferred[tuple[0]] = function() {
					// ???  
					deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
					return this;
				};
				// 执行队列 调用队列中的处理函数并且传参 绑定执行时上下文对象
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			// ???
			/**
			 * 为deferred对象扩展promise上的属性和方法
			 */
			promise.promise(deferred);

			if (func) {
				func.call(deferred, deferred);
			}

			return deferred;
		},
		//执行一个或多个对象的延迟对象的回调函数
		when: function(subordinate) {
			console.log(subordinate)
			// ??? 为什么 promise是个函数
			// 上面promise.promise(deferred);给deferred对象上扩展了promise函数
			// 调用promise()时，未传参数obj 所以返回promise
			return subordinate.promise();
		},

	});

	function createOptions(options) {
		var object = optionsCache[options] = {};
		options.split(/\s+/).forEach(function(value) {
			object[value] = true;
		});
		return object;
	}

	root.$ = root.jQuery = jQuery;
})(this);
