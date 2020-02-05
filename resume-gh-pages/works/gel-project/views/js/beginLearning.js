$(function(){
	$('#learnTab li').click(function(){
		var index = $(this).index();
		$('.source_content dl').eq(index).show().siblings().hide();
		$(this).addClass('s_active').siblings().removeClass('s_active');
	})
	$('#replayTab li').click(function(){
		var index = $(this).index();
		$('.info_content .info_po').eq(index).show().siblings().hide();
		$(this).addClass('info_active').siblings().removeClass('info_active');
	})
    $('.in_po dd a span').click(function(){
         $(this).parent().next('ul').stop().slideToggle(300);
    })
})