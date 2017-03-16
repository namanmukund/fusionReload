$('.centernaiv ul li a').click(function() { 
	  $('.centernaiv ul li a').removeClass('active'); 
	  $(this).addClass('active'); 
	});

$(window).scroll(function () {
  var toproll= $(document).scrollTop(); 
  if(toproll < 220){
   $(".centernaiv").css({"top":"0px" ,"position":"relative"}); 
   $(".scroller_black").css("background",'');
   $(".scroller_black ul li a").css("color",'');
  }
  else{
  $(".centernaiv").css({"top":"0px" ,"position":"fixed"});
   $(".scroller_black").css("background",'#000');
   $(".scroller_black ul li a").css("color",'#fff');
  }   
  
  var toprollDetails= $(document).scrollTop();	
	 if(toprollDetails < 450){
	  $(".scrolltdlnew").css({"top":"0px" ,"position":"relative"}); 
	  $(".detailsnavi_wrapper").css({"display":"none"});
	  $(".headingdetaolss").css({"padding-top":"0px"});
//	  $(".detailsnavi2_wrapper").css({"margin-bottom":"25px"});         
	 }
	 else{
	  $(".scrolltdlnew").css({"top":"0px" ,"position":"fixed"});
	  $(".detailsnavi_wrapper").css({"display":"block"}); 
	  $(".headingdetaolss").css({"padding-top":"12px"});
	  $(".detailsnavi2_wrapper").css({"margin-bottom":"0px"});
          $(".scroller_black").css("background",'#000');
          $(".scroller_black ul li a").css("color",'#fff');
	 }	
});
	
$(function() {
 var sections = $('.box_padd, .marbottomboti')
   , nav = $('.nav')
   , nav_height = nav.outerHeight();
   var nv1 = $('.nav1')
   var Nav1_height = nv1.outerHeight();

 $(window).on('scroll', function () {
   var cur_pos = $(this).scrollTop();   
   sections.each(function() {
  var top = $(this).offset().top - (nav_height + Nav1_height) ,
   bottom = top + $(this).outerHeight();
  if (cur_pos >= top && cur_pos <= bottom) {
    nav.find('a').removeClass('active');
    sections.removeClass('active');    
    $(this).addClass('active');
    nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
  }
   });
 });
 nav.find('a').on('click', function () {
   var $el = $(this)
  , id = $el.attr('href');
   $('html, body').animate({
  	scrollTop: $(id).offset().top - ((nav_height + Nav1_height)) 
   }, 500);   
   return false;
 });
 
 $('.centernaiv ul li a').click(function(){
	 
 });

});		