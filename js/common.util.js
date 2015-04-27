/**
 * Created by TimWen on 15/3/21.
 * @author 温昊天
 *
 *
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
 * @param btnsObj
 * @param contsObj
 * @param options
 */
COMMON.UTIL.tab = function(btnsObj, contsObj, options) {
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
        btns = $(btnsObj),
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
    if(typeof contsObj !== 'string') {
        conts = [], contCurrent = [];
        $.each(contsObj, function () {
            conts.push($(this.toString()));
            contCurrent.push({});
        });
        contCurrent = [];
    } else {
        conts = $(contsObj);
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
                        // _p.activeFun(index);
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
        if(typeof contsObj !== 'string') {
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
    /*
     _p.activeFun = function (num) {
     $.isFunction(fn) && fn(num);
     };
     */
    // 私有函数调用
    _p.activeBtn(btns[index]);
    _p.activeConts(index);
    // _p.activeFun(index);
};


// 图片轮播
// 原命名为switch，由于switch是关键字，因此改成switchPics
COMMON.UTIL.switchPics = function(container, contsWrap, btnsObj, options) {
    var settings = {
            direction: 'left',
            autoPlay: true,
            time: 5000,
            currentIndex: 0
        },
        settings  = $.extend(settings, options || {});
    var $container = $(container),
        $contsWrap = $(contsWrap),
        $btns = $(btnsObj),
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
            currentIndex = $(this).index(btnsObj);
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
COMMON.UTIL.openPop = function(popObj, triggerBtn) {
    // 初始化变量定义
    var $pop = $(popObj),
        $trigger = $(triggerBtn),
        $overlay = $('.overlay');
    // 触发按钮绑定
    $trigger.bind('click', function() {
        // 添加蒙版（判断）
        // typeof $('.overlay').html() === 'undefined' && $body.append('<div class="overlay"></div>');
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
COMMON.UTIL.closePop = function(popObj, triggerBtn) {
    // 初始化变量定义
    var $pop = $(popObj),
        $overlay = $('.overlay'),
        $trigger = $(triggerBtn);
    // 触发按钮绑定
    $trigger.bind('click', function() {
        $pop.hide();
        $overlay.hide();
    });
};



// 走马灯效果
COMMON.UTIL.marquee = function(contObj, options) {
    var settings = {
            direction: 'top'
        },
        settings = $.extend(settings, options || {});
    var $cont = $(contObj),
        contMove = settings.direction === 'top' || settings.direction === 'bottom' ? $cont.width() : $cont.height();
    // if(settings.direction === 'top')
    $cont.css('position', 'absolute')
        .animate({'top': -(contMove+contMove%200)},10000);
    // TODO 未写完

    // console.log(contMove)
};


// 视频播放
COMMON.UTIL.video = function(videoWrapper, options) {
    var settings = {
            f4v: '',
            mp4: '',
            width: '320',
            height: '180',
            wmode: 'opaque',
            autoPlay: false
        },
        settings = $.extend(settings, options || {});
    var $videoWrapper = $(videoWrapper),
        f4v = settings.f4v,
        mp4 = settings.mp4,
        width = settings.width,
        height = settings.height,
        wmode = settings.wmode,
        autoPlay = settings.autoPlay;
    if($.flash.available) {
        $videoWrapper.flash({
            // swf: 'swf/player.swf',  //设置flash播放器
            // TODO flash播放器地址（绝对？相对？）
            swf: 'http://res.nie.netease.com/comm/js/nie/util/player.swf',  //设置flash播放器
            width: width,
            height: height,
            allowFullScreen: true,
            allowscriptaccess: 'always',
            bgcolor: '000000',
            wmode: wmode,
            flashvars: {
                width: width,
                heigth: height,
                movieUrl: f4v || mp4 || '',  //f4v和mp4的选择
                videoWidth: width,
                videoHeight: height,
                autoPlay: autoPlay,
                volume: 0.8,
                loopTimes: 0,
                bufferTime: 5,
                videoIndex: 1,
                allowFullScreen: true
            }
        });
    }
};
// http://res.nie.netease.com/comm/js/nie/util/player.swf


// flash播放
COMMON.UTIL.flash = function(flashWrapper, options) {
    var settings = {
            swf: '',
            wmode: 'transparent',
            width: 320,
            height: 180
        },
        settings = $.extend(settings, options || {});
    var $flashWrapper = $(flashWrapper),
        swf = settings.swf,
        wmode = settings.wmode,
        width = settings.width,
        height = settings.height;
    // 判断flash可用
    if($.flash.available) {
        $flashWrapper.flash({
            swf: swf,
            wmode: wmode,
            width: width,
            height: height
        });
    }
};

// http://res.xy2.netease.com/gw/15v1/img/290_130_29b5dc2.swf























// 闭包写法，有问题
/*
COMMON.UTIL.carousel = (function() {
    var _e = {}, _p = {};
    _e.t = function(a, b) {
        var _p = {};

        _p.f = function(a, b) {
            console.log(a + b);
        }
        _p.f(a, b);
    };

    _e.tab = function(btnObj, contObj, params) {
        // console.log(btnObj+contObj)
        var _p = {};
        // 映射函数（赋值使用）
        _p.map = function(attribute, value) {
            return (typeof params !== 'undefine' && typeof params[attribute] !== 'undefine') ? params[attribute] : value;
        };
        _p.activeBtn = function(btnObj) {
            $(btnCurrent).removeClass(activeClass);
            btnCurrent = btnObj;
            $(btnObj).addClass(activeClass);
        };
        _p.activeConts = function(num) {
            if(typeof contObj !== 'string') {
                $.each(conts, function (i) {
                    $(contCurrent[i]).removeClass(activeClass);
                    contCurrent[i] = this[num];
                    $(this[num]).addClass(activeClass);
                });
            } else {
                if(contCurrent) {
                    $(contCurrent).removeClass(activeClass);
                }
                contCurrent = conts[num];
                $(conts[num]).addClass(activeClass);
            }
        };
        _p.activeFun = function(num) {
            if ($.isFunction(fn)) {
                fn(num);
            }
        };

        var btns = $(btnObj),
            btnCurrent,
            contCurrent,
            conts,
            currentIndex,
            overStatus,
            timer,
            trigger,
            time = _p.map('time', 100),
            index = _p.map('index', 0),
            event = _p.map('event', 'hover'),
            activeClass = _p.map('activeClass', 'class');
        if(typeof contObj !== 'string') {
            conts = [], contCurrent = [];
            $.each(contObj, function () {
                conts.push($(this.toString()));
                contCurrent.push({});
            });
            contCurrent = [];
        } else {
            conts = $(contObj);
            contCurrent = {};
        }
        $.each(btns, function (i) {
            // 判断标签触发的事件类型
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
                        if(overStatus && currentIndex !== index) {
                            currentIndex = index;
                            _p.activeBtn(btn);
                            _p.activeConts(index);
                            _p.activeFun(index);
                        }
                    }, time);
                })();
            }).bind('mouseleave', {'i': i}, function(e) {
                clearTimeout(timer);
                overStatus = false;
            });
        });
        _p.activeBtn(btns[index]);
        _p.activeConts(index);
        _p.activeFun(index);
    };
    return _e;
})();
*/



/*
COMMON.UTIL.tab = function(btnObj, conObj, params) {
    var btns = $(btnObj),
        btnCurrent,
        conCurrent,
        cons,
        currentIndex,
        overStatus,
        timer,
        trigger,
        time = chk('time', 100),
        index = chk('index', 0),
        event = chk('event', 'hover'),
        activeClass = chk('activeClass', 'current');
    function chk(attribute, value) {
        return (typeof params !== 'undefined' && typeof params[attribute] !== 'undefined') ? params[attribute] : value;
    }
    function activeBtn(btnObj) {
        $(btnCurrent).removeClass(activeClass);
        btnCurrent = btnObj;
        $(btnObj).addClass(activeClass);
    }
    function activeCons(num) {
        if(typeof conObj !== 'string') {
            $.each(cons, function (i) {
                $(conCurrent[i]).removeClass(activeClass);
                conCurrent[i] = this[num];
                $(this[num]).addClass(activeClass);
            });
        } else {
            if(conCurrent) $(conCurrent).removeClass(activeClass);
            conCurrent = cons[num];
            $(cons[num]).addClass(activeClass);
        }
    }
    function activeFun(num) {
        if ($.isFunction(fn)) {
            fn(num);
        }
    }
    if(typeof conObj !== 'string') {
        cons = [], conCurrent = [];
        $.each(conObj, function () {
            cons.push($(this.toString()));
            conCurrent.push({});
        });
        conCurrent = [];
    } else {
        cons = $(conObj);
        conCurrent = {};
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
                        activeBtn(btn);
                        activeCons(index);
                        activeFun(index);
                    }
                }, time);
            })();
        }).bind('mouseleave', {"i": i}, function (e) {
            clearTimeout(timer);
            overStatus = false;
        });
    });
    activeBtn(btns[index]);
    activeCons(index);
    activeFun(index);
};
*/







/*
var com = {
    scrollPics : function(opt) {
        var settings = {
                currentTarget: '',
                wrap: '',
                autoplay : true,
                minNum: 1,
                time: 5000,
                tab: '',
                index: 0,
                prevCallback: function() {},
                nextCallback: function() {}
            },
            opt = opt || {};
        settings = $.extend(settings, opt);
        var $currentTarget = $(settings.currentTarget),
            $wrap = $(settings.wrap),
            ul = $wrap.find("ul"),
            li_len = ul.find("li").length,
            li_w = ul.find("li").width(),
            left = $currentTarget.find(".prev"),
            right = $currentTarget.find(".next"),
            tab = $(settings.tab),
            timer = null,
            currentIndex = settings.index;
        tab.eq(currentIndex).addClass('current');
        ul.css('width',li_w*li_len);
        if(li_len > settings.minNum){
            right.click(function(){
                settings.nextCallback();
                currentIndex++;
                if(currentIndex == li_len) {
                    currentIndex = 0;
                }
                tab.removeClass('current').eq(currentIndex).addClass('current');
                ul.stop().animate({
                    "left": -(li_w*currentIndex)
                },{
                    "duration": 1000,
                    "easing": "easeOutExpo"
                });
            });
            left.click(function() {
                currentIndex--;
                if(currentIndex < 0){
                    currentIndex = li_len - 1;
                }
                tab.removeClass('current').eq(currentIndex).addClass('current');
                ul.stop().animate({
                    "left": -(li_w*currentIndex)
                },{
                    "duration": 1000,
                    "easing": "easeOutExpo"
                });
                settings.prevCallback();
            });
            tab.click(function(){
                currentIndex = $(this).index(settings.tab);
                tab.removeClass('current').eq(currentIndex).addClass('current');
                ul.stop().animate({
                    "left": -(li_w*currentIndex)
                },{
                    "duration": 1000,
                    "easing": "easeOutExpo"
                });
            });
            if (settings.autoplay) {
                timer = setInterval(function() {
                    right.trigger("click");
                }, settings.time);
                $wrap.mouseenter(function() {
                    clearInterval(timer);
                });
                $wrap.mouseleave(function() {
                    clearInterval(timer);
                    timer = setInterval(function() {
                        right.trigger("click");
                    }, settings.time);
                });
            }
        }
    }
};
    */