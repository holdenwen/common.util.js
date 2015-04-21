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
});

