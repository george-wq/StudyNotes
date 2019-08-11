(function($, window) {
    $.fn.extend({
        lazyload: function() {
            console.log(this);
            var self = this;
            loadImgs();
    
            // 页面监听页面滚动
            $(window).on('scroll', function() {
                loadImgs();
            })
    
            function loadImgs() {
                $(self).each(function () {
                    console.log(this);
                    if ($.fn.checkShow($(this)) && !$.fn.isLoaded($(this)) ){
                        $.fn.loadImg($(this));
                    }
                })
            }
        },
        checkShow: function(element) {
            // 页面滚动的距离
            var scrollTop = $(window).scrollTop();  
            var windowHeight = $(window).height(); 
            var offsetTop = element.offset().top;  
            if (offsetTop < (scrollTop + windowHeight) && offsetTop > scrollTop) { 
                return true;
            }
            return false;
        },
        loadImg: function(element) {
            element.attr('src', element.attr('data-src'));
        },
        isLoaded: function(element) {
            return element.attr('data-src') === element.attr('src'); 
        }
    });
})(jQuery, window);