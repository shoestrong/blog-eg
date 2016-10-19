var img = document.getElementById("img"),
    start = document.getElementById("start"),
    imgShow = document.getElementById("imgShow"),
    conte = document.getElementById("conte");
start.onclick = startt;

/*转换函数*/
function startt() {
    var imgFile = new FileReader();
    var fileSrc = img.files[0];
    if(fileSrc){
        imgFile.readAsDataURL(fileSrc);
        document.getElementById("resultColor").innerHTML = "";
        imgFile.onload = function() {
            var imgData = this.result; //base64数据    
            imgShow.setAttribute('src', imgData);
            if (imgShow.height > 300) {
                imgShow.height = 300
            }
            conte.innerHTML = imgData;

            var test = new ImageColor(imgData, { //imgSrc 支持 url 和 img对象 不能支持跨域图片
                colorCount: 10, // 最大颜色数
                quality: 4, // 颜色质量 1~10
                //range: [210, 104, 132, 140] // 原图片范围 [x, y, width, height]  默认为整张图片
            });
            test.ready(function(res) {
                // document.body.appendChild(this.canvasImage.imgBuff.image);
                // document.body.appendChild(this.canvasImage.canvasBuff.canvas);
                for (var i = 0, len = res.length; i < len; i++) {
                    var rgb = res[i];
                    var hex = rgb2hex(rgb[0], rgb[1], rgb[2]);
                    var a = document.createElement('a');
                    a.href = "javascript:;";
                    a.className = 'color';
                    a.style.background = '#' + hex;
                    document.getElementById("resultColor").appendChild(a);
                }
            });
        }
    }
}


function rgb2hex(red, green, blue) {
    if ((typeof red !== 'number' || typeof green !== 'number' || typeof blue !== 'number') &&
        (red > 255 || green > 255 || blue > 255)) {
        throw new TypeError('Expected three numbers below 256');
    }

    return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1);
};