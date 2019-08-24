var _ = {};

_.isObject = function (obj) {
    var type = typeof obj;
    return type === "function" || type === "object";
}

_.allKeys = function (obj) {
    var prop;
    if (!_.isObject(obj)) {
        return []
    };
    var result = [];
    for (var key in obj) {
        result.push(key);
    }
    //IE>9  bug
    // if (!hasEnumbug) {
    //     for (var i = 0, length = colletNotEnumProps.length; i < length; i++) {
    //         prop = colletNotEnumProps[i];
    //         if (obj[prop] !== obj.__proto__[prop]) {
    //             result.push(prop);
    //         }
    //     }
    // }
    return result;
}

var createAssigner = function (func) {
    return function (obj) {
        var length = arguments.length;
        if (length < 2 || obj == null) {
            return obj
        };

        for (var i = 1; i < length; i++) {
            var source = arguments[i];
            var keys = func(source); // data
            var len = keys.length;
            for (var j = 0; j < len; j++) {
                var key = keys[j]; // data
                obj[key] = source[key]; //
            }
        }
        return obj;
    }
}

_.extend = createAssigner(_.allKeys); //自身对象+原型链上可枚举的属性
// _.extendOwn = createAssigner(_.keys); //自身对象上可枚举的属性

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

_.template = function (templateString, setting) {
    var RULE = {
        interpolate: /<%=([\s\S]+?)%>/,   // 不能用双引号 '/<%=([\s\S]+?)%>/'
        escape: /<%-([\s\S]+?)%>/,
        expression: /<%([\s\S]+?)%>/
    }

    // 利用extend为{}上扩展 RULE和setting(用户自定义模板正则)
    settings = _.extend({}, RULE, setting);

    // 合并为一个正则表达式
    var matcher = new RegExp([
        settings.interpolate.source,
        settings.escape.source,
        settings.expression.source,
    ].join("|"), "g");

    var source = "_p+='";
    var index = 0;

    // interpolate(匹配到的RULE.interpolate), 
    // escape(匹配到的RULE.escape), 
    // expression(匹配到的RULE.expression), 
    // offset (匹配到的正则的第一个字符的下标值)
    templateString.replace(matcher, function (match, interpolate, escape, expression, offset) {
        source += templateString.slice(index, offset).replace(/\n/g, function () {
            return "\\n";
        });
        index = offset + match.length;
        if (interpolate) {
            // console.log(interpolate);
            // 变量有 + ???
            source += "'+\n((_t=("+interpolate+"))==null?'':_t)+\n'";
        } else if (escape) {
            // console.log(escape);
            source += "'+\n((_t=("+escape+"))==null?'':_.escape(_t))+\n'";
        } else if (expression) {
            // console.log(expression);
            // js代码没有 + ??? 
            source += "'\n"+expression+"\n_p+='";
        }
    });

    source += " ';";
    source = "with(obj){\n" + source + "}\n";
    source = "var _t,_p='';" + source + "return _p;\n";
    // console.log(source);

    // 渲染函数
    var render = new Function("obj", source);

    // 预编译 模板只运行一次 返回函数的引用，之后数据改变调用函数副本
    var template = function (data) {
        return render.call(null, data);
    }

    return template;
    // console.log(source);
    // source = 'with'

}