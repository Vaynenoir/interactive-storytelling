 function inWindow(s){
    if(!$(s).length) return false; // element not found

		var img_top_offset = $(s).offset().top;
		var img_bottom = $(s).offset().top + $(s).outerHeight();
		var bottomOfScreen = $(window).scrollTop() + $(window).height();
		var topOfScreen = $(window).scrollTop();
   
    return (bottomOfScreen > img_top_offset) && (topOfScreen < img_bottom);
}
$(document).ready(function() {
//Chrome Smooth Scroll

	// Default
	jQuery.scrollSpeed(100, 1200);

	// Custom Easing



});

  		var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  		$(path1).css('display','none');
  		var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
function sectionCounter(){
	$('.js-section').each(function(i){
		var scrollCount = $(window).scrollTop();
		var topOffset = $(this).offset().top;
		var dataZoom = $(this).attr("data-zoom");
		var dataPos = $(this).attr("data-pos");


	



		if(topOffset <= scrollCount){

				$(this).addClass("active");
				$('.bg_svg').stop(400).animate({zoom: dataZoom, left: dataPos},200);
				$('.st2').stop(200).fadeIn(200);
				$('.path_circle_2').stop().fadeIn(400);
				$('.path_circle_3').stop().fadeIn(400);

				
				
			}
		else{
			$(this).removeClass("active");
			if(!$('.js-section').hasClass("active")){
				$('.bg_svg').stop().animate({zoom: "100%", left: '40%'},400);

			}
		}

	});
//ЗДЕСЬ МОЖЕШЬ ЧЕРЕЗ ФОР ИЧ НАПИСАТЬ ЭТУ ФУНКЦИЮЮ ДЛЯ ВСЕХ КАРТИНОК НА СТРАНИЦЕ

var arrImgID = [];
$('img').each(function(el){

	arrImgID.push($(this));

});
	var vis_count = 0;
	// console.log(arrImgID);
	$(arrImgID).each(function(el,i){


			if(inWindow($(this))){
				vis_count++;
				var cx = $(this).attr('data-pos-x');
				var cy = $(this).attr('data-pos-y');
				var Coordinates = $(this)[0].getBoundingClientRect();
				
				// console.log("Top:"+Coordinates.top+", Left:"+Coordinates.left+", Right:"+Coordinates.right+", Bottom:"+Coordinates.bottom);
				var bottomOffsetImg = Coordinates.top + $(this).height();
				// console.log(Coordinates);
				$(path1).attr('d', "M"+cx + " " + cy +  " L"+ (-Coordinates.left) + " " + (Coordinates.top) +  " L" + (-Coordinates.left) + " " + (Coordinates.bottom -30) );

				$(path1).css('position',"relative");
				$(path1).attr('fill', '#47DBB4');
				$(path1).attr('opacity', '.1');

				//$(path1).fadeIn(900);
		}
		//else if(!inWindow($('img'))) {	

				//$(path1).fadeOut(900);

		//}

		

// if(!(inWindow($('.js-image1'))))
// else if(!(inWindow($('.js-image2')))){
// 	$(path1).fadeOut(900);
// }
});

		if (vis_count > 0) {
			$(path1).fadeIn(900);
		}
		else {
			$(path1).fadeOut(900);
		}


}


	



$(document).ready(function(){
		var path = document.querySelector('.st0');
		var length = path.getTotalLength();
		$('.bg_svg svg').append(path1);
		$('.bg_svg svg').append(path2);
	var $dashOffset = $('.st0').css("stroke-dashoffset");
			var offsetDash = $('.st0').css({
				"stroke-dashoffset": length,
				"stroke-dasharray": length + " " + length
			});





	$(window).scroll(function lol(){
		// console.log("img 1 = "+inWindow('.js-image1'));
		// console.log("img 2 = "+inWindow('.js-image2'));
		var $percentageComplete = (($(window).scrollTop() / ($("html").height() - $(window).height())) * 100);




		var $newUnit = length;//parseInt($dashOffset, 10);
		var $offsetUnit = $percentageComplete * ($newUnit / 200);
		var	offsetCounter = $newUnit - ($offsetUnit); 
	
	if (offsetCounter < 2220 && offsetCounter>2190) return $('.st0').stop(2000).animate({"stroke-dashoffset": "2215px"},2000);
	else $('.st0').css("stroke-dashoffset", $newUnit - ($offsetUnit));

	
		sectionCounter();			
		

	});

});









