(function(root){
    var jQuery = function() {
        return new jQuery.prototype.init();
    }
    
    jQuery.fn = jQuery.prototype = {
        init: function(){},
        css: function(){}
    }
    
    //extend
    jQuery.fn.extend = jQuery.extend = function() {
        console.log(arguments);
        var target = arguments[0] || {};
        var length = arguments.length;
        var i = 1;
        var deep = false;
        var name, option, src, copy, copyIsArray, clone;

        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        // 第一个参数一定要是Object
        if (typeof target !== 'object') {
            target = {};
        }

        if (length === i) {
            target = this;
            i--;   
        }

        for (; i < length; i++) {
            // 貌似不用!=null 判断也行
            if ((option = arguments[i]) != null) {
                for (name in option) {
                    src = target[name]
                    copy = option[name];

                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : []
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {}
                        }
                        target[name] = jQuery.extend(deep, clone, copy);
                    } else if (copy != undefined) {
                        target[name] = copy;
                    }
                }
            } 
        }

        return target;
    }

    jQuery.extend({
        isPlainObject: function(obj) {
            return toString.call(obj) === '[object Object]';
        },
        isArray: function(obj) {
            return toString.call(obj) === '[object Array]';
        },
    });

    jQuery.extend({
        validate
    })

    // 共享原型
    jQuery.fn.init.prototype = jQuery.fn;
    root.$ = root.jQuery = jQuery;
})(this);