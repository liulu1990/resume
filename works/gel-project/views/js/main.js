/*左侧导航*/
$(document).on('click','.left-nav a',function(e){
    var $this=$(e.target),$active,$parent = $this.closest('.left-nav').hasClass("nav-infomation");
    $this.is('a')||($this=$this.closest('a'));
    $active=$this.parent().siblings(".active");
    $active&&!$parent&&$active.find('> a').toggleClass('active')&&$active.toggleClass('active').find('> ul:visible').slideUp(200);
    ($this.hasClass('active')&&$this.next().slideUp(200))||$this.next().slideDown(200);
    $this.toggleClass('active').parent().toggleClass('active');
    $this.next().is('ul')&&e.preventDefault();
});
/*弹出层事件*/
$(document).on('click','.answer',function(){
    layeraw();
})
/*tab切换*/
/*tab切换*/
$(function(){
    $(".left-nav>li a").click(function(){
        $(this).next("ul").slideToggle();
    });
    $(".tabs").each(function(){
        $(this).find("li").hover(function(){
            $(this).parent(".tabs").find("li").eq($(this).index()).addClass("active").siblings().removeClass('active');
            $(this).parents('.tabs-box').find(".tabs-con").hide().eq($(this).index()).show();
        });
    })
    $(".tabbs").each(function(){
        $(this).find("li").click(function(){
            $(this).parent(".tabbs").find("li").eq($(this).index()).addClass("active").siblings().removeClass('active');
            $(this).parents('.tabs-box').find(".tabs-con").hide().eq($(this).index()).show();
        });
    })
    $('.nav li:last').addClass('nav-last');
    $(".nav li").mouseover(function(){
        $(this).find('.subnav').stop().slideDown('fast');
    });
    $(".nav li").mouseout(function(){
        $(this).find('.subnav').stop().slideUp('fast');
    });
});

/*图片切换*/
$(function(){
    var _speed=100;
    var _slide = $("#slideText");
    var _slideli1 = $(".slideli1");
    var _slideli2 = $(".slideli2");
    _slideli2.html(_slideli1.html());
    function Marquee(){
    if(_slide.scrollLeft() >= _slideli1.width())
    _slide.scrollLeft(0);
    else{
    _slide.scrollLeft(_slide.scrollLeft()+2);
    }
    }
    $(function(){
    //两秒后调用
    var sliding=setInterval(Marquee,_speed)
    _slide.hover(function() {
    //鼠标移动DIV上停止
    clearInterval(sliding);
    },function(){
    //离开继续调用
    sliding=setInterval(Marquee,_speed);
    });
    });
});
$(function(){
    var _speed1=50;
    var _slide1 = $("#slideImg");
    var _slideli11 = $(".slideImgli1");
    var _slideli22 = $(".slideImgli2");
    _slideli22.html(_slideli11.html());
    function Marquee1(){
        if(_slide1.scrollLeft() >= _slideli11.width())
        _slide1.scrollLeft(0);
        else{
            _slide1.scrollLeft(_slide1.scrollLeft()+2);
        }
    }
    $(function(){
        //两秒后调用
        var sliding1=setInterval(Marquee1,_speed1)
        _slide1.hover(function() {
        //鼠标移动DIV上停止
        clearInterval(sliding1);
        },function(){
        //离开继续调用
        sliding=setInterval(Marquee1,_speed1);
        });
    });
});
