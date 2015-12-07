$(function() {
    COMMON.UTIL.tab('.section-tab-btns a', '.tab-contsList');
    COMMON.UTIL.switchPics('.section-switch',
        '.section-switch-conts',
        '.section-switch-btns a');
    COMMON.UTIL.openPop('.pop', '.section-pop a');
    COMMON.UTIL.closePop('.pop', '.pop .pop-close');
    COMMON.UTIL.marquee('.section-marquee-contsList');

    COMMON.UTIL.video('.section-video-cont', {
        mp4: 'swf/test.mp4',
        width: 800,
        height: 450,
        autoPlay: false
    });

    COMMON.UTIL.flash('.section-flash-cont', {
        swf: 'http://utiljs.sinaapp.com/swf/test.swf',
        wmode: 'opaque',
        width: 290,
        height: 130
    });
});
