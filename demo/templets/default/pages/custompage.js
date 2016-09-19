function serialize(array){
	var str="";
	for(var t in array){
		str+=t+"="+array[t]+","
	}
	return str.substring(0,str.length-1);
}
function unserizalize(str){
	var array={};
	var tem=str.split(",");
	for(var i=0;i<tem.length;i++){
		var obj=tem[i].split("=");
		var val=obj[1];
		if($.isNumeric(val)){
			val=parseFloat(val);
		}
		array[obj[0]]=val;
	}
	return array;
}
$(function(){
	  CustomPage=(function(){
		function CustomPage(el,options){
			this.options=options;
			this.$wrap=$(options.wrapSelector);
			this.$drag=$(el);
			this.$prev=$(el).prev();
			this.$next=$(el).next();
			this.prevWidthRate = this.options.prevWidthRate;
			this.prevHeightRate =  this.options.prevHeightRate;

			var options=this.options;
			options.hDrag=options.hDrag
			var cursor="";
			if( options.hDrag ){
				cursor="e-resize";
			}
			else if( options.vDrag ){
				cursor="n-resize";
			}
			this.$drag.css({"cursor":cursor});
			if(!$(".dialog_floor")[0]){
				$("<div class='dialog_floor'></div>").css({'width':'100%','height':'100%','position':'absolute','z-index':9999,'opacity':0,'left':0,'top':0,'background-color':'red'}).hide().appendTo("body");
			}
			this.hiddenSize = this.options.hiddenSize;
			this.initWrap();
			this.init();
			this.initEvents();
			this.addEvents();
		}
		CustomPage.prototype.initWrap=function(){

			this.windowWidth = window.innerWidth?window.innerWidth:$(window).width();
			this.windowHeight = window.innerHeight?window.innerHeight:$(window).height();
			this.$wrap.width( this.windowWidth );
			this.$wrap.height( this.windowHeight );
			
		};
		CustomPage.prototype.init=function(){
			this.mouseX=0;
			this.mouseY=0;
			
			if(this.options.hDrag ){
				if( this.hiddenSize){
					if( this.windowWidth <= this.hiddenSize){
						this.$prev.hide();
						this.$drag.hide();
						this.$next.width(this.windowWidth);
						return;
					}else{
						this.$prev.show();
						this.$drag.show();
					}
				}
				var w=this.$drag.parent().width() - this.$drag.width();
				if(this.options.prevWidth){
					this.prevWidth=  this.options.prevWidth ;
					this.nextWidth=  w - this.options.prevWidth;
				}else if(this.options.nextWidth){
					this.prevWidth=  w - this.options.nextWidth ;
					this.nextWidth=  this.options.nextWidth;
				}else{
					this.prevWidth=  w * this.prevWidthRate ;
					this.nextWidth=  w - this.prevWidth;
				}

				this.$prev.width( this.prevWidth );
				this.$next.width( this.nextWidth );
			}else if(this.options.vDrag ){
				if( this.hiddenSize){
					if( this.windowHeight <= this.hiddenSize){
						this.$prev.hide();
						this.$drag.hide();
						this.$next.height(this.windowHeight);
						return;
					}
				}
				var h=this.$drag.parent().height() - this.$drag.height();
				if(this.options.prevHeight){
					this.prevHeight=  this.options.prevHeight;
					this.nextHeight=  h - this.options.prevHeight;
				}else if(this.options.nextHeight){
					this.prevHeight= h - this.options.nextHeight;
					this.nextHeight= this.options.nextHeight;
				}else{
					this.prevHeight= h * this.prevHeightRate;
					this.nextHeight= h - this.prevHeight;
				}

				this.$prev.height( this.prevHeight );
				this.$next.height( this.nextHeight );
			}

		};
		CustomPage.prototype.initEvents=function(){
			var options=this.options;
			this.events = {
				down: (function (_this) {
					return function (e) {
						_this.mouseX=e.pageX;
						_this.mouseY=e.pageY;

						$(".dialog_floor").show().bind("mousemove", _this.events["drag"]).bind("mouseup", _this.events["up"]);
						return false;
					};
				})(this),
				drag: (function (_this) {
					return function (e) {
						var $drag=_this.$drag;
						var $prev=_this.$prev;
						var $next=_this.$next;
						
						if( _this.options.hDrag && _this.options.hDrag =="1"){
							var mouseX=e.clientX;
							var moveX = mouseX-_this.mouseX;

							var prevWidth = _this.prevWidth += moveX;
							var nextWidth = _this.nextWidth -= moveX;

							if( prevWidth<options.minWidth || nextWidth<options.minWidth ){
								return false;
							}

							$prev.width( prevWidth );
							$next.width( nextWidth );

							_this.mouseX=mouseX;
						}
						if( _this.options.vDrag && _this.options.vDrag =="1" ){
							var mouseY=e.clientY;
							var moveY = mouseY-_this.mouseY;

							var prevHeight = _this.prevHeight += moveY;
							var nextHeight = _this.nextHeight -= moveY;

							if( prevHeight<options.minHeight || nextHeight<options.minHeight){
								return false;
							}

							$prev.height( prevHeight );
							$next.height( nextHeight );

							_this.mouseY=mouseY;
						}
						
						
						return false;
					};
				})(this),
				up: (function (_this) {
					return function (e) {
						_this.currentDrag=null;
						$(".dialog_floor").hide().unbind("mousemove", _this.events["drag"]).unbind("mouseup", _this.events["up"]);
						return false;
					};
				})(this)
			};
		};
		CustomPage.prototype.addEvents=function(){
			var events;
			this.removeEvents();
			events = this.events;
			this.$drag.bind("mousedown", events["down"]);
		};
		CustomPage.prototype.removeEvents=function(){
			var events;
			events = this.events;
			this.$drag.unbind();
		};
		CustomPage.prototype.reset=function(){
			this.updateRate();
			this.initWrap();
			this.init();
		};
		
		CustomPage.prototype.updateRate=function(){
			if( this.options.hDrag ){
				var prevWidthRate = this.$prev.width()/(this.$prev.width()+this.$next.width());
				this.prevWidthRate = prevWidthRate;
			}
			if( this.options.vDrag ){
				var prevHeightRate =  this.$prev.height()/(this.$prev.height()+this.$next.height());
				this.prevHeightRate = prevHeightRate;
			}
		};
		CustomPage.prototype.saveCookie=function(){
			this.updateRate();
			var str=serialize($.extend(this.options,{
				prevWidth:0,
				nextWidth:0,
				prevHeight:0,
				nextHeight:0,
				prevWidthRate:this.prevWidthRate,
				prevHeightRate:this.prevHeightRate
			}
			));
			$.cookie(this.$drag.attr("id"), str ,{expires:7});
			
		};
		return CustomPage;
	  })();
	  $.fn.custompage = function (settings) {
		return this.each(function() {
			var custompage,options;
			if (!(custompage=this.m_custompage)) {
				options = $.extend({}, $.fn.custompage.defaults, settings);
				return this.m_custompage = custompage = new CustomPage(this,options);
			}
			if (settings && typeof settings == "object") {
                $.extend(custompage.options, settings);
				custompage.reset();
			}else if( settings == "reset"){
				custompage.reset();
			}else if( settings == "saveCookie"){
				return custompage.saveCookie();
			}
		});
	  }
	  //horizontal,vertical
	  $.fn.custompage.defaults={
		minWidth:0,
		minHeight:30,
		hDrag:0,
		prevWidthRate:0.5,
		prevWidth:0,
		nextWidth:0,
		vDrag:0,
		prevHeightRate:0.5,
		prevHeight:0,
		nextHeight:0,
		wrapSelector:".wrap",
		hiddenSize: 0
	  };
})