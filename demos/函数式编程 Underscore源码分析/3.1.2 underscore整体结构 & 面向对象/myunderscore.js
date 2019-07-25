(function(root) {
    // 构造函数 => 例如：为后续chain创建新的实例对象
    var _ = function(obj) {
        if (obj instanceof _) {
            return obj;
        }
        if (!(this instanceof _)) {
            return new _(obj);
        }
        this._wrapped = obj;
    }

    _.unique = function(obj, callbacks) {
        var res = [];
        var target, i = 0;
        for (; i < obj.length; i++) {
            var target =  callbacks ? callbacks(obj[i]) : obj[i];
            if (res.indexOf(target) === -1) {
                res.push(target);
            }
        }
        return res;
    }

    _.function = function(obj) {
        var names = [];
        for (name in obj) {
            names.push(name);
        }
        return names;
    }

    _.chain = function(obj) {
        // 通过构造函数重新创建一个新的实例
        var instance = _(obj);
        instance._chain = true;
        return instance;
    }

    _.each = function(obj, callbacks) {
        var length = obj.length;
        var i = 0;
        for (;i<length;i++) {
            callbacks.call(this, obj[i], i);
        }
    }

    _.prototype.value = function() {
        return this._wrapped;
    };

    _.map = function() {
        
    }

    var restArguments = function(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length), index = 0;
            for (;index < length ;index++) {
                rest[index] = arguments[index + startIndex];
            }

            var args = [];
            for (var i=0;i<startIndex;i++) {
                args[i] = arguments[i];
            }
            args[startIndex] = rest;
            return func.apply(this, args);
        }
    }

    _.restArguments = restArguments;

    var chainResult = function(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    }

    _.mixin = function(obj) {
        _.each(_.function(obj), function(name) {
            var func = _[name];
            _.prototype[name] = function() {
                var args = [this._wrapped];
                [].push.apply(args, arguments);
                // 此处return是拿到其他函数的返回值 例如: _unique
                return chainResult(this, func.apply(_, args));
            }
        });
    }

    _.mixin(_);
    root._ = _;
})(this);