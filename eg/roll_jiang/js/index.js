var config = {
    "rollId": '#rollId', //外层divid
    "rollBtn": ".rollBtn", //点击滚动的按钮--class
    "rollList": ".rollList",
    "pinIndex": 0, //滚动的起点
    "speed": 200, //滚动的速度
    "cycle": 0, //滚动的圈数
    "fastCycle": 5, //快速滚动圈数
    "rollResult": 4 //抽奖的结果
};
var Roll = function() {
    var self = this;
    self.config = config;
    self.stopIndex = '';
    self.isRolling = false;
    self.timer = null;
    self.ops = '';
    self.rollId = '';
    self.rollBtn = '';
    self.rollList = '';
    self.rollIndex = 0;
}

var roll=new Roll();

$(function(){
	$(".choujiang").on("click",function(){
		rollFun(4);
	});
})

function rollFun(prize_code) {
    roll.init({
        "rollId": '#zhuanpan',
        "rollBtn": ".choujiang",
        "rollList": ".zhuanpan1",
        "pinIndex": 0,
        "rollResult": prize_code
    });
    roll.start();
}


Roll.prototype.init = function(options) {
    var self = this;
    self.ops = $.extend({}, self.config, options);
    self.rollId = $(self.ops.rollId);
    self.rollBtn = self.rollId.find(self.ops.rollBtn);
    self.rollList = self.rollId.find(self.ops.rollList).find('li');
    self.stopIndex = self.ops.rollResult;
};

// 按钮事件
Roll.prototype.start = function() {
    this.rollPre();
};
Roll.prototype.rollPre = function() {
    var self = this;
    if (!self.isRolling) {
        self.rollList.eq(self.ops.pinIndex).show().siblings().hide();
        rollStart(self); // 开始启动转盘
    }
};
// 指向下一个
function rollGoNext(self) {
    self.rollIndex += 1;
    if (self.rollIndex > self.rollList.length) {
        self.rollIndex = 0;
        self.ops.cycle++;
    }
    self.rollList.eq(self.rollIndex).show().siblings().hide();
}
// 停止转动
function rollStop(self) {
    clearInterval(self.timer);
    (function stopGoNext() {
        if (self.rollIndex !== self.stopIndex) {
            rollGoNext(self);
            setTimeout(function() {
                stopGoNext();
            }, 300);
        } else {
            self.isRolling = false;
            self.ops.cycle = 0;
            self.rollIndex = 0;
            $(".choujiang").hide();
            $(".have_choujiang").show();
            // self.ev.trigger('succeed', {
            //     rollResult: self.stopIndex
            // });
        }
    })();
}
//开始转动
function rollStart(self) {
    self.isRolling = true;
    self.timer = setInterval(function() {
        rollGoNext(self);
        if (self.rollIndex == 5) {
            clearInterval(self.timer);
            self.ops.speed = 20;
            self.timer = setInterval(function() {
                rollGoNext(self);
                if (self.ops.cycle >= 5) {
                    clearInterval(self.timer);
                    self.ops.speed = 200;
                    self.timer = setInterval(function() {
                        if (self.ops.cycle === 6) {
                            rollStop(self);
                        } else {
                            rollGoNext(self);
                        }
                    }, self.ops.speed);
                }
            }, self.ops.speed);
        }
    }, self.ops.speed);
}