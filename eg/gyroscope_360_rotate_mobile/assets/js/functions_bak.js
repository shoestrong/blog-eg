log.enableAll();
(function(){
    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
    }
    animate();
})();
var transform = getStyleProperty('transform');
var getStyle = ( function() {
    var getStyleFn = getComputedStyle ?
        function( elem ) {
            return getComputedStyle( elem, null );
        } :
        function( elem ) {
            return elem.currentStyle;
        };

    return function getStyle( elem ) {
        var style = getStyleFn( elem );
        if ( !style ) {
            log.error( 'Style returned ' + style +
                '. Are you running this code in a hidden iframe on Firefox? ' +
                'See http://bit.ly/getsizebug1' );
        }
        return style;
    };
})();
var cache = {
    imgW: 5100,
    imgH: 852,
    panOffsetX: 0,
    ring: 0,
    deg: 0,
    runDeg: 0,
    minOffsetDeg: 8,
    rotationOffsetDeg: 0,
    onceRotationOffsetDeg: 0,
    nowOffset: 0,
    len: 0,
    touchLock: false,
    timer: null
};
var tween1, tween2;
var util = {
    setTranslateX: function setTranslateX(el, num) {
        el.style[transform] = "translate3d(" + num + "px,0,0)";
    }
};
var initPanoramaBox = function initPanoramaBox($el, opts) {
    var elH = $el.height();
    var elW = $el.width();
    var $panoramaBox = $('<div class="panorama-box">' +
        '<div class="panorama-item"></div>' +
        '<div class="panorama-item"></div>' +
        '</div>');
    var $panoramaItem = $('.panorama-item', $panoramaBox);
    var scal = elH / opts.height;
    $panoramaItem.css({
        width: opts.width,
        height: opts.height
    });
    $panoramaBox.css({
        width: elW / scal,
        height: opts.height,
        transform: 'scale3d(' + scal + ',' + scal + ',' + scal + ')',
        'transform-origin': '0 0'
    });
    util.setTranslateX($panoramaItem.get(0), 0);
    util.setTranslateX($panoramaItem.get(1), -opts.width);
    $el.append($panoramaBox);
    var offset = function offset(num) {
        var width = opts.width;
        var num1 = num % opts.width;
        var num2;
        if (num1 < -width / 2) {
            num2 = width + num1 - 2;
        } else {
            num2 = -width + num1 + 2;
        }
        util.setTranslateX($panoramaItem.get(0), num1);
        util.setTranslateX($panoramaItem.get(1), num2);
    };
    var run = function (subBox1, subBox2, width) {
        return function offset(num) {
            num = parseInt(num);
            cache.len = num;
            var num1 = num % width;
            var num2;
            if (num1 < -width / 2) {
                num2 = width + num1 - 1;
            } else {
                num2 = -width + num1 + 2;
            }
            util.setTranslateX(subBox1, num1);
            util.setTranslateX(subBox2, num2);
        };
    };
    return run($panoramaItem.get(0), $panoramaItem.get(1), opts.width);
};
var $el = {};
$el.main = $('.wrapper');

var offset = initPanoramaBox($el.main, {
    width: cache.imgW,
    height: cache.imgH
});

var animOffset = function animOffset(length){
    if(tween1){
        tween1.stop();
    }
    tween1 = new TWEEN.Tween({x: cache.len});
    tween1.to({x: length}, 600);
    tween1.onUpdate(function(){
        offset(this.x);
    });
    tween1.start();
};
var animPanEnd = function animPanEnd(velocityX){
    if(tween2){
        tween2.stop();
    }
    var oldLen = cache.len;
    var offsetLen ;
    tween2 = new TWEEN.Tween({x: cache.len});
    tween2.to({x: cache.len - 200 * velocityX}, 600);
    tween2.easing(TWEEN.Easing.Cubic.Out);
    tween2.onUpdate(function(){
        offset(this.x);
        offsetLen =oldLen - this.x;
        cache.nowOffset += + offsetLen;
        cache.panOffsetX +=  + offsetLen;
    });
    tween2.start();
};
var initOrientationControl = function () {
    FULLTILT.getDeviceOrientation({'type': 'world'})
        .then(function (orientationControl) {
            var orientationFunc = function orientationFunc() {
                var screenAdjustedEvent = orientationControl.getScreenAdjustedEuler();
                cache.navDeg = 360 - screenAdjustedEvent.alpha;
                if (cache.navDeg > 270 && cache.navOldDeg < 90) {
                    cache.ring -= 1;
                } else if (cache.navDeg < 90 && cache.navOldDeg > 270) {
                    cache.ring += 1;
                }
                cache.navOldDeg = cache.navDeg;
                cache.oldDeg = cache.deg;
                cache.deg = cache.ring * 360 + cache.navDeg;
                var offsetDeg = cache.deg - cache.runDeg;
                if (!cache.touchLock &&
                    (Math.abs(offsetDeg) > cache.minOffsetDeg)) {
                    var length = cache.imgW / 360 * -(cache.deg - cache.rotationOffsetDeg) + cache.panOffsetX;
                    cache.runDeg = cache.deg;
                    cache.nowOffset = length;
                    animOffset(length);
                }
            };
            orientationControl.listen(orientationFunc);
        })
        .catch(function(e){
           log.error(e);
        });
};
var initTouch = function(){
    var mc = new Hammer.Manager($el.main.get(0));
    var pan = new Hammer.Pan();
    $el.main.on('touchstart', function (evt) {
        if (cache.timer) {
            clearTimeout(cache.timer);
            cache.timer = null;
        }
        cache.touchLock = true;
        if(tween1){
            tween1.stop();
        }
        if(tween2){
            tween2.stop();
        }
        cache.nowOffset = cache.len;
    });
    $el.main.on('touchend', function (evt) {
        cache.timer = setTimeout(function () {
            cache.onceRotationOffsetDeg = cache.deg - cache.runDeg;
            cache.runDeg = cache.deg + cache.onceRotationOffsetDeg;
            cache.rotationOffsetDeg = cache.rotationOffsetDeg + cache.onceRotationOffsetDeg;
            cache.touchLock = false;
        }, 1000);
    });
    mc.add(pan);
    mc.on('pan', function (evt) {
        offset(cache.nowOffset + evt.deltaX);
    });
    mc.on('panend', function (evt) {
        cache.nowOffset += + evt.deltaX;
        cache.panOffsetX +=  + evt.deltaX;
        //animPanEnd(evt.velocityX);
    });
};
initTouch();
initOrientationControl();