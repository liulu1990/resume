define(["jquery"],function($){

    $.fn.extend({
      stickUp:function(){

      var _this = $(this),
          nodeH = $(this).height()

      $(window).on('scroll',function(){

         var scrollTop = $(window).scrollTop(),
             windowH = $(window).height()
   
        if (scrollTop >= (windowH - nodeH) ) {
          _this.css({"background-color": "rgba(34,34,34,1)"})
        }else{
          _this.css({"background-color": "rgba(34,34,34,0.5)"})
        } 

      })
    }
  })

})

