log.enableAll();
(function () {
    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
    }

    animate();
})();
$.fn.panorama360 = function (options) {
    var $self = $(this);
    var defaults = {
        width: 16,
        height: 9,
        stabilizer: 2,
        swichTime: 800
    };
    var opts = $.extend(null, defaults, options);
    var transform = getStyleProperty('transform');
    var tween1, tween2, offset;
    var cache = {
        imgW: opts.width,
        imgH: opts.height,
        panOffsetX: 0,
        ring: 0,
        deg: 0,
        runDeg: 0,
        minOffsetDeg: opts.stabilizer,
        rotationOffsetDeg: 0,
        onceRotationOffsetDeg: 0,
        nowOffset: 0,
        len: 0,
        pathLock: false,
        touchLock: false,
        timer: null,
        swichTime: opts.swichTime
    };

    var util = {
        setTranslateX: function setTranslateX(el, num) {
            el.style[transform] = "translate3d(" + num + "px,0,0)";
        }
    };
    var animOffset = function animOffset(length) {
        if (tween1) {
            tween1.stop();
        }
        tween1 = new TWEEN.Tween({x: cache.len});
        tween1.to({x: length}, 600);
        tween1.onUpdate(function () {
            offset(this.x);
        });
        tween1.start();
    };

    function initPanoramaBox($el, opts) {
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
    }

    function initOrientationControl() {
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
                    if (!cache.pathLock &&
                        (Math.abs(offsetDeg) > cache.minOffsetDeg)) {
                        var length = cache.imgW / 360 * -(cache.deg - cache.rotationOffsetDeg)
                            + cache.panOffsetX;
                        cache.runDeg = cache.deg;
                        cache.nowOffset = length;
                        animOffset(length);
                    }
                };
                orientationControl.listen(orientationFunc);
            })
            .catch(function (e) {
                log.error(e);
            });
    }

    function initTouch() {
        var mc = new Hammer.Manager($self.get(0));
        var pan = new Hammer.Pan();
        $self.on('touchstart', function (evt) {
            if(cache.touchLock){
                return false;
            }
            if (cache.timer) {
                clearTimeout(cache.timer);
                cache.timer = null;
            }
            cache.pathLock = true;
            if (tween1) {
                tween1.stop();
            }
            if (tween2) {
                tween2.stop();
            }
            cache.nowOffset = cache.len;
        });
        $self.on('touchend touchcancel', function (evt) {
            if(cache.touchLock){
                return false;
            }
            cache.timer = setTimeout(function () {
                cache.onceRotationOffsetDeg = cache.deg - cache.runDeg;
                cache.runDeg = cache.deg + cache.onceRotationOffsetDeg;
                cache.rotationOffsetDeg = cache.rotationOffsetDeg + cache.onceRotationOffsetDeg;
                cache.pathLock = false;
            }, cache.swichTime);
        });
        mc.add(pan);
        mc.on('pan', function (evt) {
            if(cache.touchLock){
                return false;
            }
            offset(cache.nowOffset + evt.deltaX);
        });
        mc.on('panend', function (evt) {
            if(cache.touchLock){
                return false;
            }
            cache.nowOffset += evt.deltaX;
            cache.panOffsetX += evt.deltaX;
        });
    }

    offset = initPanoramaBox($self, {
        width: cache.imgW,
        height: cache.imgH
    });
    initTouch();
    initOrientationControl();
    return {
        stop: function(){
            if(tween1){
                tween1.stop();
            }
            if(tween2){
                tween2.stop();
            }
            cache.touchLock = true;
            cache.pathLock = true;
        },
        start: function(){
            cache.touchLock = false;
            cache.timer = setTimeout(function () {
                cache.onceRotationOffsetDeg = cache.deg - cache.runDeg;
                cache.runDeg = cache.deg + cache.onceRotationOffsetDeg;
                cache.rotationOffsetDeg = cache.rotationOffsetDeg + cache.onceRotationOffsetDeg;
                cache.pathLock = false;
            }, cache.swichTime);
        }
    }
};

var $el = {};
$el.win = $(window);
$el.doc = $(document);
$el.wrapper = $('.wrapper');
$el.tmp = $('#tmp');

//$el.a1 = $('#a1');
$el.a2 = $('#a2');
$el.a3 = $('#a3');

$el.doc.on('touchstart touchmove touchend touchcancel', function(evt){
    evt.preventDefault();
});

var func = $el.wrapper.panorama360({
    width: 5100,    //全景宽度
    height: 852,    //全景高度
    stabilizer: 6,  //防抖
    swichTime: 800  //滑动结束与重力感应开始间隔时间
});
func.stop();

$el.panoramaItem = $el.wrapper.find('.panorama-item');
$el.panoramaItem.append($el.tmp.children());

$el.a2.on('tap click', function(){
    func.stop();
});
$el.a3.on('tap click', function(){
    func.start();
});