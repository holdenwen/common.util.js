/**
 * Created by TimWen on 15/3/21.
 */

// 声明命名空间
var COMMON = COMMON || {};

// 命名空间函数
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

//
COMMON.namespace('COMMON.UTIL');

//
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