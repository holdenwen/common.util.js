/**
 * 网页常用功能工具库
 * @author 温昊天
 * @version 1.0.1 2015-06-01
 * @COMMON.UTIL.tab -轮播模块（tab切换功能）
 * @COMMON.UTIL.switchPics -轮播模块（switch切换功能）
 * @COMMON.UTIL.openPop -弹窗模块（打开弹窗功能）
 * @COMMON.UTIL.closePop -弹窗模块（关闭弹窗功能）
 * @COMMON.UTIL.marquee -走马灯模块（走马灯滚屏功能）
 * @COMMON.UTIL.video -视频模块（视频播放功能）
 * @COMMON.UTIL.flash -flash模块（flash播放功能）
 *
 */

// 声明命名空间
var COMMON = COMMON || {};

// 声明命名空间函数
COMMON.namespace = function(ns_string) {
    var parts = ns_string.split('.'),
        parent = COMMON,
        i;
    // 剥离最前面的冗余全局变量
    if(parts[0] === 'COMMON') {
        parts = parts.slice(1);
    }
    for(i = 0; i < parts.length; i += 1) {
        // 如果它不存在，就创建一个属性
        if(typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

// 调用命名空间函数，设置新的命名空间
COMMON.namespace('COMMON.UTIL');

/**
 * tab切换
 * @param btnsWrapper
 * @param contsWrapper
 * @param options
 */
COMMON.UTIL.tab = function(btnsWrapper, contsWrapper, options) {
    // 默认参数
    var settings = {
            time: 100,
            index: 0,
            event: 'hover',
            activeClass: 'current'
        },
    // 新参数继承
        settings = $.extend(settings, options || {});
    // 变量声明
    var _p = {},
        btns = $(btnsWrapper),
        btnCurrent,
        conts,
        contCurrent,
        currentIndex,
        overStatus,
        timer,
        trigger,
        time = settings.time,
        index = settings.index,
        event = settings.event,
        activeClass = settings.activeClass;
    //
    if(typeof contsWrapper !== 'string') {
        conts = [], contCurrent = [];
        $.each(contsWrapper, function () {
            conts.push($(this.toString()));
            contCurrent.push({});
        });
        contCurrent = [];
    } else {
        conts = $(contsWrapper);
        contCurrent = {};
    }
    $.each(btns, function (i) {
        if(event === 'hover') {
            trigger = 'mouseenter';
        } else if(event === 'click') {
            trigger = 'click';
        }
        $(this).bind(trigger, {'i': i, 'o': btns[i]}, function(e) {
            overStatus = true;
            (function() {
                var btn = e.data.o,
                    index = e.data.i;
                timer = setTimeout(function(o) {
                    if (overStatus && currentIndex != index) {
                        currentIndex = index;
                        _p.activeBtn(btn);
                        _p.activeConts(index);
                    }
                }, time);
            })();
        }).bind('mouseleave', {"i": i}, function (e) {
            clearTimeout(timer);
            overStatus = false;
        });
    });
    // 内部私有函数
    _p.activeBtn = function(btnObj) {
        $(btnCurrent).removeClass(activeClass);
        btnCurrent = btnObj;
        $(btnObj).addClass(activeClass);
    };
    _p.activeConts = function(num) {
        if(typeof contsWrapper !== 'string') {
            $.each(conts, function (i) {
                $(contCurrent[i]).removeClass(activeClass);
                contCurrent[i] = this[num];
                $(this[num]).addClass(activeClass);
            });
        } else {
            if(contCurrent) $(contCurrent).removeClass(activeClass);
            contCurrent = conts[num];
            $(conts[num]).addClass(activeClass);
        }
    };
    // 私有函数调用
    _p.activeBtn(btns[index]);
    _p.activeConts(index);
};


// 图片轮播
// 原命名为switch，由于switch是关键字，因此改成switchPics
COMMON.UTIL.switchPics = function(container, contsWrapper, btnsWrapper, options) {
    // 默认参数
    var settings = {
            direction: 'left',
            autoPlay: true,
            time: 5000,
            currentIndex: 0
        },
        // 新参数继承
        settings  = $.extend(settings, options || {});
    var $container = $(container),
        $contsWrap = $(contsWrapper),
        $btns = $(btnsWrapper),
        $ul = $contsWrap.find('ul'),
        liLength = $ul.find('li').length,
        liMove = settings.direction === 'left' ? $ul.find('li').width() : $ul.find('li').height(),
        ulDirection = settings.direction === 'left' ? 'width' : 'height',
        $prev = $container.find('.prev'),
        $next = $container.find('.next'),
        direction = settings.direction,
        autoPlay = settings.autoPlay,
        time = settings.time,
        currentIndex = settings.currentIndex,
        timer = null;
    $btns.eq(currentIndex).addClass('current');
    $ul.css(ulDirection, liLength * liMove);
    if(liLength > 1) {
        $next.click(function() {
            currentIndex++;
            currentIndex === liLength && (currentIndex = 0);  // 改写
            $btns.removeClass('current').eq(currentIndex).addClass('current');
            if(direction === 'left') {
                $ul.stop().animate({'left': -liMove * currentIndex}, 300);
            } else {
                $ul.stop().animate({'top': -liMove * currentIndex}, 300);
            }
        });
        $prev.click(function() {
            currentIndex--;
            currentIndex < 0 && (currentIndex = liLength - 1);  // 改写
            $btns.removeClass('current').eq(currentIndex).addClass('current');
            if(direction === 'left') {
                $ul.stop().animate({'left': -liMove * currentIndex}, 300);
            } else {
                $ul.stop().animate({'top': -liMove * currentIndex}, 300);
            }
        });
        $btns.click(function(){
            currentIndex = $(this).index(btnsWrapper);
            $btns.removeClass('current').eq(currentIndex).addClass('current');
            if(direction === 'left') {
                $ul.stop().animate({'left': -liMove * currentIndex}, 300);
            } else {
                $ul.stop().animate({'top': -liMove * currentIndex}, 300);
            }
        });
        if(autoPlay) {
            timer = setInterval(function() {
                $next.trigger('click');
            }, time);
            $btns.mouseenter(function() {
                clearInterval(timer);
            });
            $btns.mouseleave(function() {
                clearInterval(timer);
                timer = setInterval(function() {
                    $next.trigger('click');
                }, time);
            });
        }
    }
};


// 打开弹窗
COMMON.UTIL.openPop = function(popWrapper, triggerBtn) {
    // 初始化变量定义
    var $pop = $(popWrapper),
        $trigger = $(triggerBtn),
        $overlay = $('.overlay');
    // 触发按钮绑定
    $trigger.bind('click', function() {
        // 设置蒙版样式
        $overlay.css({
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'width': '100%',
            'height': '100%',
            'backgroundColor': '#000',
            'opacity': '0.6',
            'zIndex': 9999
        }).show();
        // 设置弹窗样式
        $pop.css({
            'marginTop': -$pop.height() / 2,
            'marginLeft': -$pop.width() / 2,
            'zIndex': 10000
        }).show();
    });
};

// 关闭弹窗
COMMON.UTIL.closePop = function(popWrapper, triggerBtn) {
    // 初始化变量定义
    var $pop = $(popWrapper),
        $overlay = $('.overlay'),
        $trigger = $(triggerBtn);
    // 触发按钮绑定
    $trigger.bind('click', function() {
        $pop.hide();
        $overlay.hide();
    });
};


// 走马灯滚屏效果
COMMON.UTIL.marquee = function(marqueeWrapper, options) {
    // 默认参数
    var settings = {
            direction: 'up',
            duration: 5000
        },
        // 新参数继承
        settings = $.extend(settings, options || {});
    var $mq = $(marqueeWrapper),
        direction = settings.direction,
        duration = settings.duration;
    $mq.marquee({
        direction: direction,
        duration: duration
    });
};


// 视频播放
COMMON.UTIL.video = function(videoWrapper, options) {
    // 默认参数
    var settings = {
            f4v: '',
            mp4: '',
            width: '320',
            height: '180',
            autoPlay: false
        },
        // 新参数继承
        settings = $.extend(settings, options || {});
    // 初始化变量
    var $vedio = $(videoWrapper),
        f4v = settings.f4v,
        mp4 = settings.mp4,
        width = settings.width,
        height = settings.height,
        autoplay = settings.autoPlay;
    // 视频设置
    $vedio.attr({
        width: width,
        height: height,
        src: mp4 || f4v || '',
        autoplay: autoplay,
        controls: true
    });

};



// flash播放
COMMON.UTIL.flash = function(flashWrapper, options) {
    // 默认参数
    var settings = {
            swf: '',
            wmode: 'transparent',
            width: 320,
            height: 180
        },
        // 新参数继承
        settings = $.extend(settings, options || {});
    var $flashWrapper = $(flashWrapper),
        swf = settings.swf,
        wmode = settings.wmode,
        width = settings.width,
        height = settings.height;
    // 判断flash是否可用
    if($.flash.available) {
        $flashWrapper.flash({
            swf: swf,
            wmode: wmode,
            width: width,
            height: height
        });
    }
};
