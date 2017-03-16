$(window).scroll(function () {
	"use strict";
/*  var toproll= $(document).scrollTop(); 
  if(toproll < 220){
   $(".centernaiv").css({"top":"0px" ,"position":"relative"}); 
   $(".scroller_black").css("background",'');
   $(".scroller_black ul li a").css("color",'');
   
   
  }
  else{
  $(".centernaiv").css({"top":"0px" ,"position":"fixed"});
   $(".scroller_black").css("background",'#000');
   $(".scroller_black ul li a").css("color",'#fff');


  }  */ 
  
  var toprollDetails= $(document).scrollTop();	
	 if(toprollDetails < 150){
	//console.log('1-'+toprollDetails);	 
	  $(".detailsnavi_wrapper").css({"display":"none"});
	  $(".headingdetaolss").css({"padding-top":"0px"});
//	  $(".detailsnavi2_wrapper").css({"margin-bottom":"25px"}); 
      $(".detailsnavi2_wrapper").css({"top":"110px","z-index":"99999999999"});
            
	 }
	 else{ 
	 	//console.log('2-'+toprollDetails);
	   $(".scrolltdlnew").css({"top":"","position":"relative"});
	  $(".detailsnavi_wrapper").css({"display":"block"}); 
	  $(".headingdetaolss").css({"padding-top":"12px"});
	  $(".detailsnavi2_wrapper").css({"margin-bottom":"0px"});
	  if($( window ).width()<768){
	  		
	  }
	  
          
	 }
         
      if(toprollDetails > 250){
		  if($( window ).width()>768){
			  $(".scrolltdlnew").css({"top":"110px","position":"fixed"});
	  		}else{
				 if(toprollDetails > 780){
				  $(".scrolltdlnew").css({"top":"0px","position":"fixed"});
			 }
			}
//          $(".scrolltdlnew").css({"top":"110px","position":"fixed"});
          $("#nav").css({"top":"0px" ,"position":"relative"});
          $(".scroller_black").css({"background":"#000","margin-bottom":"50px"});
          $(".scroller_black ul li a").css("color",'#fff');
		  
         
      }else{
          $(".scrolltdlnew").css({"top":"","position":"relative"});
//          $("#nav").css({"top":"" ,"position":"absolute"}); 
          
      }   
         
//         if(toprollDetails > 480){
//          $(".scrolltdlnew").css({"position":"relative"});
//          $("#nav").css({"top":"0px" ,"position":"fixed"});
//          $(".scroller_black").css({"background":"#000","margin-bottom":"50px"});
//          $(".scroller_black ul li a").css("color",'#fff');
//		  
//         
//      }else{
//          $(".scrolltdlnew").css({"top":"","position":"relative"});
////          $("#nav").css({"top":"" ,"position":"absolute"}); 
//          
//      }  
      
});
	
$(function() {
	"use strict";
 var sections = $('.box_padd'), 
 nav = $('.nav-1'), 
 nav_height = nav.outerHeight();
   var nv1 = $('.nav-1');
   var Nav1_height = nv1.outerHeight();

 $(window).on('scroll', function () {
   var cur_pos = $(this).scrollTop(); 
   var $toTop = $('#topS');
   if ($(this).scrollTop() > 35) {
      $toTop.slideUp();
    } else {
      $toTop.slideDown();
    } 
   sections.each(function() {
   var top = $(this).offset().top - (nav_height + Nav1_height) ,
   bottom = top + $(this).outerHeight();
   });
 });
 nav.find('a').on('click', function () {
   var $el = $(this), 
   id = $el.attr('href');
   var nav_height_patch =0;
    if($( window ).width()>768){
	   if ($(window).scrollTop() < 250) {
		  nav_height_patch = 60;
	   }
	}else{
		if ($(window).scrollTop() < 456) {
		  nav_height_patch = 100;
	   }
	
	}
   console.log('scrollTop'+$(window).scrollTop() );
   	   console.log('nav_height'+nav_height);
	   console.log('nav_height_patch'+nav_height_patch);
   $('html, body').animate({
  	scrollTop: $(id).offset().top - ((nav_height + Nav1_height + nav_height_patch)+180) 
   }, 500);  
   console.log('animate'+( $(id).offset().top - ((nav_height + Nav1_height)+180) ));
   nav.find('a').removeClass('active');
    sections.removeClass('active');    
    $(this).addClass('active');
    nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
   return false;
 });
});		