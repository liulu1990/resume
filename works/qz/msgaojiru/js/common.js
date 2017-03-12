$(function(){ 
	$('a[href^=#]').click(function() {
      var speed = 550; 
      var href= $(this).attr("href");
      var target = $(href == "#top" || href == "" ? 'html' : href);
      var position = target.offset().top;
      $('body,html').animate({scrollTop:position}, speed, 'swing');
      return false;
   });
	$(window).scroll(function(){
		if ($(window).scrollTop() == 0) {
			$(".pagetop").fadeOut();
			$(".btnTop").fadeOut();
		} else {
			$(".pagetop").fadeIn();
			$(".btnTop").fadeIn();
		}
	});
});





