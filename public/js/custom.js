$(function(){ //<----shorter version of doc ready. this one can be used ->jQueyr(function($){ 
      $('#support').click(function(e){ // <----you missed the '.' here in your selector.
          e.stopPropagation();
          $('.support_bos').slideToggle();
      });

    $('.support_bos').click(function(e){
        e.stopPropagation();
    });

    $(document).click(function(){
       $('.support_bos').slideUp();
    });
});

$(document).ready(function() {
	"use strict";	
//	$("#support").click(function(e) {
//		$(".support_bos").stop().slideToggle();
//		e.stopPropagation();
//	});
//       $('.slidingDiv').slideUp();
		
	 
    var $toTop = $('#topS');
$(window).scroll(function () {
    if ($(this).scrollTop() > 35) {
      $toTop.slideUp();
	  $('.positionfixed').css('top','110px');
	  $('.rtbanner_fixed').css('top','110px');
    } else {
      $toTop.slideDown();
	  $('.positionfixed').css('top','144px');
	  $('.rtbanner_fixed').css('top','144px');
    }
});
    
    
	"use strict";          
    $('.carousel').carousel();   
	
	  
	 $('#read_more').on('click',function(){
		 $('#quickguide').slideToggle();
		 $(this).text($(this).text() == 'See more' ? 'Hide' : 'See more');
	 });
	 
	 $("#wt-this").click(function () { 
    $('#howtoidentify').slideToggle('slow');
	
});
	 
});

var htmlContent = '<div class="review">'+$('#addreview .review:eq(0)').clone().html()+'</div>';
$("a.morereview").on("click",function(){
	"use strict";
	if($('#addreview .review').length < 5){
		/*$('#addreview').append(htmlContent);*/
		$(htmlContent).hide().appendTo("#addreview").fadeIn(1000);
		if($('#addreview .review').length >= 5){
			$('a.morereview').hide();
		}
		else{
		$('a.morereview').fadeIn(2000);
	}}
});

$(function() {
	"use strict";  
	$('.sliderightoleft_Solution').css({'margin-right':'-289px',}, 800);
	$("a.rightsidepuiopen").click(function() {
		$('.sliderightoleft_Solution').animate({'margin-right':'0px',}, 800); 
	});
	
	$(".closebuttods").click(function() {
		$('.sliderightoleft_Solution').animate({'margin-right':'-289px',}, 800); 
	});
	
});


$(window).scroll(function(){
	"use strict";
	if ($(this).scrollTop() > 200) {
	  $('.header').addClass('fixed');
	} else {
	  $('.header').removeClass('fixed');
	}
	
});

// Only run everything once the page has completely loaded
    $(document).ready(function() {
		"use strict";  
        var totalHeight =0;
        $(".thumb1").each(function(){			
           totalHeight = totalHeight + $(this).outerHeight(true);
        });
	totalHeight = totalHeight;
        //var maxScrollPosition = totalHeight - $(".thumbs").outerHeight();
		var maxScrollPosition = totalHeight - 296;	
        function toGalleryItem($targetItem){
            // Make sure the target item exists, otherwise do nothing
            if($targetItem.length){
			
                // The new position is just to the left of the targetItem
                var newPosition = $targetItem.position().top;
                // If the new position isn't greater than the maximum width				
				
                if(newPosition <= maxScrollPosition){
                    // Add active class to the target item
                    $targetItem.addClass("gallery__item--active");

                    // Remove the Active class from all other items
                    $targetItem.siblings().removeClass("gallery__item--active");
					
					//alert("newPosition :: "+ newPosition + "maxScrollPosition :: " + maxScrollPosition);
					
					if(newPosition === maxScrollPosition)
					{
						$('.rightwithoutarrow').css( 'cursor', 'default' );
						$(".rightwithoutarrow").css({ opacity: 0.5 });
					}
					else
					{
						
						$('.rightwithoutarrow').css( 'cursor', 'pointer' );
						
						if((maxScrollPosition - newPosition) < $('.thumb1').outerHeight())
							{    									
								$('.rightwithoutarrow').css( 'cursor', 'default' );
								$(".rightwithoutarrow").css({ opacity: 0.5 });
							}
							else
							{
								$(".rightwithoutarrow").css({ opacity: 1 });								
								
							}
					}
					
					if(newPosition === 0)
					{
						$('.leftwithoutarrow').css( 'cursor', 'default' );
						$(".leftwithoutarrow").css({ opacity: 0.3 });
					}
					else
					{
						$('.leftwithoutarrow').css( 'cursor', 'pointer' );
						$(".leftwithoutarrow").css({ opacity: 1 });
					}
                    
                    // Animate .gallery element to the correct left position.
                    $(".thumbs").animate({
                        top : - newPosition
                    });
                } else {
	
                    // Animate .gallery element to the correct left position.
                    $(".thumbs").animate({
                       top : - maxScrollPosition					
						
                    });
                }
            }
			
        }

        // Basic HTML manipulation
        // ====================================================================
        // Set the gallery width to the totalWidth. This allows all items to
        // be on one line.
       
		
		$(".thumbs").height(totalHeight);
		
		$('.leftwithoutarrow').css( 'cursor', 'default' );
		$(".leftwithoutarrow").css({ opacity: 0.3 });
		
        // Add active class to the first gallery item
        $(".thumb1:first").addClass("gallery__item--active");

        // When the prev button is clicked
        // ====================================================================
        $(".leftwithoutarrow").click(function(){
            // Set target item to the item before the active item
            var $targetItem = $(".gallery__item--active").prev();
            toGalleryItem($targetItem);
        });

        // When the next button is clicked
        // ====================================================================
        $(".rightwithoutarrow").click(function(){
            // Set target item to the item after the active item
            var $targetItem = $(".gallery__item--active").next();
            toGalleryItem($targetItem);
        });
    });
	
	$(document).ready(function() {	
	"use strict";  
	//select all the a tag with name equal to modal
	$('a[name=modal]').click(function(e) {
		//Cancel the link behavior
		e.preventDefault();
		
		//Get the A tag
		var id = $(this).attr('href');
	
		//Get the screen height and width
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
	
		//Set heigth and width to mask to fill up the whole screen
		$('#mask').css({'width':maskWidth,'height':maskHeight});
		$('.mask').css({'width':maskWidth,'height':maskHeight});
                
		//transition effect		
		$('#mask').fadeIn(500);	
		$('#mask').fadeTo("slow",500);	
                $('.mask').fadeIn(500);	
		$('.mask').fadeTo("slow",500);	
	
		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();
              
		//Set the popup window to center
		$(id).css('top',  winH/2-$(id).height()/2);
		$(id).css('left', winW/2-$(id).width()/2);
	
		//transition effect
		$(id).fadeIn(500); 
	
	});
	
	//if close button is clicked
	$('.window .close, .onclickrightsideopen').click(function (e) {
		//Cancel the link behavior
		e.preventDefault();
		
		$('#mask').hide();
                $('.mask').hide();
		$('.window').hide();
                $('.modal-backdrop').hide();
                
	});		
	
/*	//if mask is clicked
	$('#mask').click(function () {
		$(this).hide();
		$('.window').hide();
	});			
*/
	/*$(window).resize(function () {
	 
 		var box = $('#boxes .window');
 
        //Get the screen height and width
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
      
        //Set height and width to mask to fill up the whole screen
        $('#mask').css({'width':maskWidth,'height':maskHeight});
               
        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();

        //Set the popup window to center
        box.css('top',  winH/2 - box.height()/2);
        box.css('left', winW/2 - box.width()/2);
	 
	});
	*/
});

(function($){
	"use strict";  			
//	$(window).load(function(){
//		$(".scrolloneleftside4").mCustomScrollbar({
//			scrollEasing: "easeOutCirc",
//	mouseWheel: "auto",
//	autoDraggerLength: true,
//	advanced: {
//		updateOnBrowserResize: true,
//		updateOnContentResize: true
//	} 
//	});
//});			

})(jQuery);

/*var slidflag=true;
$(".mainmenu .greybar").mouseover(function(){
	'use strict';	
	if(slidflag){
		$(this).parent('ul.yourprfr').find('ul.submenu').slideUp("slow");
		$(this).addClass('arrow-down');
		slidflag=false;
	}else{
		$(this).parent('ul.yourprfr').find('ul.submenu').slideDown("slow");
		$(this).removeClass('arrow-down');
		slidflag=true;
	}
});

$(".mainmenu ul.yourprfr").mouseover(function(){
	'use strict';
	$(this).find('.greybar').slideDown("fast");
});
$(".mainmenu ul.yourprfr").mouseout(function(){
	'use strict';
	$(this).find('.greybar').slideUp("fast");
});*/


$(document).ready(function () {
	"use strict";  
	var slideCount = $('#steps .step').length;
	var slideWidth = $('#steps .step').width();
	//var slideHeight = $('#steps .step').height();
        var sliderUlWidth = slideCount * slideWidth;
	
	$('#steps').css({ width: slideWidth});	
	$('#steps .slide').css({width: sliderUlWidth});	
// alert(slideCount);        
console.log('happpen_pls');
        $('body').on('click', '.card, .box span', function () {
                // alert(slideWidth);alert($(this).attr('id'));
                if($(this).attr('id') === 'popular'){slideWidth = slideWidth * 2; var durn = 300;}
                else{var durn = 300;} 
// alert(slideWidth);alert(sliderUlWidth);
		$(this).parents('.step').animate({marginLeft: -slideWidth}, {duration: durn});
	});
	
	        $('.home_breadcrumb').on('click', function () {
                var durn = 1000;
		$('.step-1').animate({"margin-left": "0px"}, {duration: 300});
                $('.step-2').animate({"margin-left": "0px"}, {duration: 0});
                $('.step-3').animate({"margin-left": "0px"}, {duration: 0});
                $('.step-4').animate({"margin-left": "0px"}, {duration: 0});
                $('#stepper_1').removeClass('checked');
                $('#stepper_2').removeClass('active checked');
                $('#stepper_3').removeClass('active checked');
                $('#stepper_4').removeClass('active checked');
	});
        
       $('.category_name_breadcrumb').on('click', function () {
                var durn = 1000;
		$('.step-1').animate({"margin-left": "-970px"}, {duration: 300});
                $('.step-2').animate({"margin-left": "0px"}, {duration: 300});
                $('.step-3').animate({"margin-left": "0px"}, {duration: 300});
                $('.step-4').animate({"margin-left": "0px"}, {duration: 300});
                
//                $('#stepper_1').addClass('active checked');
                $('#stepper_2').removeClass('checked');
                $('#stepper_3').removeClass('active checked');
                $('#stepper_4').removeClass('active checked');
	});
        
        $('.sub_category_name_breadcrumb').on('click', function () {
                var durn = 1000;
		$('.step-1').animate({"margin-left": "-970px"}, {duration: 300});
                $('.step-2').animate({"margin-left": "-970px"}, {duration: 300});
                $('.step-3').animate({"margin-left": "0px"}, {duration: 300});
                $('.step-4').animate({"margin-left": "0px"}, {duration: 300});
                
//                $('#stepper_1').addClass('active checked');
//                $('#stepper_2').addClass('active checked');
                $('#stepper_3').removeClass('checked');
                $('#stepper_4').removeClass('active checked');
	});
	
	

$('.step-4 #selectall').click(function() {  //on click 
	if(this.checked) { // check select status
		$('.checkbox1').each(function() { //loop through each checkbox
			this.checked = true;  //select all checkboxes with class "checkbox1"               
		});
	}else{
		$('.checkbox1').each(function() { //loop through each checkbox
			this.checked = false; //deselect all checkboxes with class "checkbox1"                       
		});         
	}
});

$(".prefrence .change-url").click(function(event){
	event.preventDefault();
	$('.form-inline select').prop("disabled", false); // Element(s) are now enabled.
	$('.form-inline select').parent('.form-group').removeClass('hidetag');
	$('.prefrence .cancel-url, .prefrence .save-url').show('slow');
	$(this).hide('slow');
});

$(".prefrence .cancel-url").click(function(event){
	event.preventDefault();
	$('.form-inline select').prop("disabled", true); // Element(s) are now enabled.
	$(this).hide('slow');
	$('.form-inline select').parent('.form-group').addClass('hidetag');
	$('.prefrence .save-url').hide('slow');
	$('.prefrence .change-url').show('slow');
});


$(".filtersection h4").click(function () { 
    $('#filter').slideToggle('slow');
	
});

function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}
$('#accordion').on('hidden.bs.collapse', toggleChevron);
$('#accordion').on('shown.bs.collapse', toggleChevron);


// Carousel Auto-Cycle
  $(document).ready(function() {
    $('.carousel').carousel({
	  pause: true,
      interval: 6000
    });
  });
    
  
});

$(document).ready(function() {
	"use strict";
    $(".notif").click(function(e) {
		$(".cartpop").hide();
		 $(".welcomepop").hide();
        $(".notifi_pop").toggle();
        e.stopPropagation();
    });

    $(document).click(function(e) {
        if (!$(e.target).is('.notifi_pop, .notifi_pop *')) {
            $(".notifi_pop").hide();
        }
    });
	
	
});


$(document).ready(function() {
	"use strict";
    $(".shopcart").click(function(e) {
		 $(".notifi_pop").hide();
		  $(".welcomepop").hide();
        $(".cartpop").toggle();
        e.stopPropagation();
    });

    $(document).click(function(e) {
        if (!$(e.target).is('.cartpop, .cartpop *')) {
            $(".cartpop").hide();
        }
    });
});

$(document).ready(function() {
	"use strict";
//        $(".welcome").click(function(e) {
////            alert('hey');
//		$('#arrowdown').removeClass('glyphicon-menu-down');
//		$('#arrowdown').addClass('glyphicon-menu-up');
//		 $(".notifi_pop").hide();
//		 $(".cartpop").hide();
//        $(".welcomepop").toggle();
//        e.stopPropagation();
//    });

    $(document).click(function(e) {
        if (!$(e.target).is('.welcomepop, .welcomepop *')) {
            
	    
            $('#arrowdown').removeClass('glyphicon-traingle-bottom');
            $('#arrowdown').removeClass('glyphicon-triangle-top');
            $(".welcomepop").hide();
        }
		
    });
	
	$('html').on('click','#searchcourse',function() {
			console.log('I am here');
			$('#getstarted').fadeOut('4000');
			$('#searchgetstart').fadeIn('4000');
    	}); 
	
	
	$('#sbtbtnn').click(function() {
         $('#questionday').hide();
		 $('#questionanswerdisplay').show();
    });
});

//window.onload = function(){
//		"use strict";
//		$( '#slider1' ).lemmonSlider({			
//			infinite: true
//		});
//		
//		$( '#slider2' ).lemmonSlider({			
//			infinite: true
//		});
//	};
//	
$(document).ready(function() {
	"use strict";
        $('#example-enableClickableOptGroups-disabled').multiselect({
            enableClickableOptGroups: true
        });		 
    });
$(document).ready(function() {
$('.navbar-brand').on('click' ,function(event){
        event.preventDefault();
        if(Session.get('global_grade_id')){
	    var gId = Session.get('global_grade_id');
            var slugData = getcustomData(Session.get('courseName'));
	    Router.go('/'+slugData+'/'+gId);
        }else{
            Router.go('/');
        }
            
    });
});

function getcustomData(url_string){
	var slugData = url_string.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
	slugData = (slugData).replace('--',"-").toLowerCase();
	slugData = (slugData).replace("---","-").toLowerCase();
	/*var slugData = (url_string).replace(/ /g,"-").toLowerCase();
	slugData = (slugData).replace('(',"-").toLowerCase();
	slugData = (slugData).replace(')',"-").toLowerCase();
	slugData = (slugData).replace('.',"-").toLowerCase();
	slugData = (slugData).replace('+',"-").toLowerCase();
	slugData = (slugData).replace('--',"-").toLowerCase();
	slugData = (slugData).replace("---","-").toLowerCase();*/
	if(slugData=='iit-jee-advanced'){
	    return 'iit-jee';
	}else{
	    return slugData;
	}
}

function gaEvent(eventCategory, eventAction, eventLabel, eventValue){
    ga('send', {
            hitType: 'event',
            eventCategory: eventCategory,
            eventAction: eventAction,
            eventLabel: eventLabel,
            eventValue: eventValue
        });
}

$(document).ready(function(){
 "use strict";
    $("#toptoggle").click(function(){
        $("#wapmenu").slideToggle("slow");
    });
    $(document).on('click',function(e){
        var container=$('#toptoggle');
        if($('#wapmenu').is(':visible') && !container.is(e.target)){
            $('#wapmenu').hide();
        }
    });
});

$(window).scroll(function () {
    if ($(this).scrollTop() > 35) {
	  $('.rtbanner_fixed_abt').css('top','55px');
	  $('.rtbanner_abt-left').css('top','55px');
    } else {
	  $('.rtbanner_fixed_abt').css('top','90px');
	  $('.rtbanner_abt-left').css('top','90px');
    }
});
