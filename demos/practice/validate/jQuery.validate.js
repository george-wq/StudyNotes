(function ($, window) {
    $.fn.validate = function (options) {
        var self = this;
        return toValidate(self, options);
    };

    var regEx = {
        NOTEMPTY: /\S/, // 非空字符
        EMAIL: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, // 邮箱
        IDCARS: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        PHONE: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
    }

    var type = ['input:not([type]),input[type="color"],input[type="date"],input[type="datetime"],input[type="datetime-local"],input[type="email"],input[type="file"],input[type="hidden"],input[type="month"],input[type="number"],input[type="password"],input[type="range"],input[type="search"],input[type="tel"],input[type="text"],input[type="time"],input[type="url"],input[type="week"],textarea', 'select', 'input[type="checkbox"],input[type="radio"]'],
    allTypes = type.join(',');

    var validateField = function(event, options) {
        console.log('on blur');
    }

    var toValidate = function(element, options) {
        console.log(element);
        element.on('submit', function() {
            var ruleId = Object.keys(options.rules);
            ruleId.forEach(function(id) {
                // var rule = options.rules[id];
                if (id === 'username') {
                    ($('#' + id).val() === undefined || $('#' + id).val() === '') ?
                    alert(id + ': 必填') : ''; 
                }
                if (id === 'email') {
                    regEx.EMAIL.test($('#' + id).val()) ? '' : alert('请输入正确的邮箱');
                }
                if (id === 'phone') {
                    regEx.PHONE.test($('#' + id).val()) ? '' : alert('请输入正确的手机号');
                }
                if (id === 'IDCARS') {
                    regEx.IDCARS.test($('#' + id).val()) ? '' : alert('请输入正确的身份证');
                }
            });
        })

        var fields = element.find(allTypes);

        if(element.is('[id]')) {
            fields = fields.add('[form="' + element.prop('id') + '"]').filter(allTypes);
        }
        
        // onBlur
        if((options.onBlur && !!options.onBlur.enabled)) {
            fields.filter(type[0]).on('blur', function(event) {
                validateField.call(this, event, options);
            });
        }

        // onKeyup
        if((options.onKeyup && !!options.onKeyup.enabled) ) {
            // 未完待续...
        }

        // onChange
        if((options.onBlur && !!options.onChange.enabled) ) {
            // 未完待续...
        }

    }
}($, window));