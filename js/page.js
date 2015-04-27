/**
 * Created by TimWen on 15/4/18.
 */
/*
(function(){
    COMMON.UTIL.carousel.tab('.section-tab-btns a', '.tab-contsList');
})();
*/
$(function() {
    // COMMON.UTIL.carousel.tab('.section-tab-btns a', '.tab-contsList');
    // COMMON.UTIL.carousel.t(1, 2);
    COMMON.UTIL.tab('.section-tab-btns a', '.tab-contsList');
    COMMON.UTIL.switchPics('.section-switch', '.section-switch-conts', '.section-switch-btns a');
    COMMON.UTIL.openPop('.pop', '.section-pop a');
    COMMON.UTIL.closePop('.pop', '.pop .pop-close');
    COMMON.UTIL.marquee('.section-marquee-contsList');


    COMMON.UTIL.video('.section-video-cont', {
        f4v: 'http://v.txhd.netease.com/2014/1216/tx1216.f4v',
        mp4: 'http://v.txhd.netease.com/2014/1216/tx1216.mp4',
        width: 800,
        height: 450,
        wmode: 'opaque',
        autoPlay: false
    });

    COMMON.UTIL.flash('.section-flash-cont', {
        swf: 'http://res.xy2.netease.com/gw/15v1/img/290_130_29b5dc2.swf',
        wmode: 'opaque',
        width: 290,
        height: 130
    });




    /*
    $('.section-video-cont').flash({
        // swf: 'http://res.nie.netease.com/comm/js/nie/util/player.swf',
        swf: 'swf/player.swf',
        width: 800,
        height: 450,
        allowFullScreen: true,
        allowscriptaccess: 'always',
        bgcolor: '000000',
        wmode: 'opaque',
        flashvars: {
            width: 800,
            heigth: 450,
            movieUrl: 'http://v.txhd.netease.com/2014/1216/tx1216.f4v',
            videoWidth: 800,
            videoHeight: 450,
            volume: 0.8,
            autoPlay: false,
            loopTimes: 0,
            bufferTime: 5,
            videoIndex: 1,
            allowFullScreen: true
        }
    });
    */
});


