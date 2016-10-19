$(function() {
	$(window).bind('scroll',function(){
	
		if($(window).scrollTop()>50){
			$('.naver').addClass('docs-naver-fixed');	
		}
		else{
			$('.naver').removeClass('docs-naver-fixed');
		}
	})
});



