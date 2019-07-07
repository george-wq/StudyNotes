(function(root) {
	var optionsCache = {};
	var _ = {
		callbacks: function(options) {
			options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {};
            var list = [];
			var index,length, testting, memory, start, starts;
			var fire = function(data) {
				memory = options.memory && data;
				index = starts || 0;
				starts = 0;
				testting = true;
				length = list.length;
				for(;index < length;index++) {
					// 传入执行上下文 和 参数,并且立即执行
					if(list[index].apply(data[0], data[1]) === false && options.stopOnfalse) { 
						break;
					}
				}
			}
			var self = {
				add: function() {
					var args = Array.prototype.slice.call(arguments);
					start = list.length;
					args.forEach(function(fn) {
						if(toString.call(fn) ==="[object Function]") {
							list.push(fn);
						}
					});
					if(memory) {
					 starts = start;
					 fire(memory);	
					}
                },
                // 调用fire函数，并且传入参数
				fireWith: function(context, arguments) {
					var args = [context, arguments];
					if(!options.once || !testting) {
					 fire(args);
					}
					
                },
                // 传递参数
				fire: function() {
					self.fireWith(this, arguments);
				}
			}
			return self;
		},
	}

	function createOptions(options) {
		var object = optionsCache[options] = {};
		options.split(/\s+/).forEach(function(value) {
			object[value] = true;
		});
		return object;
	}
	root._ = _;
})(this);
