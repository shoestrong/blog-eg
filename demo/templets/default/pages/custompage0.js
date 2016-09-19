			$(function () {
				var $vDrag = $(".v_drag");
				var $hDrag = $(".top .h_drag");
				var v_options=$.cookie("v_drag")?unserizalize($.cookie("v_drag")):{ minHeight: 50, vDrag: 1 , nextHeight:30  };
				var h_options=$.cookie("h_drag")?unserizalize($.cookie("h_drag")):{ minHeight: 0, hDrag: 1 , prevWidthRate:0.5 , hiddenSize: 980};
				
				$vDrag.custompage(v_options);
				$hDrag.custompage(h_options);

				$(window).resize(function(){
					$vDrag.custompage("reset");
					$hDrag.custompage("reset");
				});
				$(window).bind("unload",function(){
					$vDrag.custompage("saveCookie");
					$hDrag.custompage("saveCookie");
				});
			  function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }

        var id = getQueryString("articleid");
        if (id) {
            $(".content a[href$='articleid=" + id + "']").css({ "color": "yellow" });
        }
		
		
		    function anim(duration){
        $('#mint').animate(
            {height: 'toggle'},
            {duration: duration}
        );
    }

    $('#closebtn').click(function() {
        $('#mintbar').slideUp();
        anim(100);
    });

    $('#mint').click(function() {
        anim(100);
        $('#mintbar').slideDown('slow');
    });


    });
