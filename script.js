var path = document.querySelector('.st0');
var length = path.getTotalLength(200,157);
	var p = path.getPointAtLength(200,157);


var circle = document.querySelector('#movingCircle');
console.log(circle);
		console.log(p);
  



  		var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  		$(path1).css('display','none');
  		var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
function sectionCounter(){
	$('.js-section').each(function(i){
		var scrollCount = $(window).scrollTop();
		var topOffset = $(this).offset().top;
		var dataZoom = $(this).attr("data-zoom");
		var dataPos = $(this).attr("data-pos");


	


		// console.log(topOffset, dataZoom);
		// console.log(i);
		if(topOffset <= scrollCount){
			// if (!$(this).hasClass("active")){
				$(this).addClass("active");
				$('.bg_svg').stop(400).animate({zoom: dataZoom, left: dataPos},400);
				$('.st2').stop(200).fadeIn(400);
				$('.path_circle_2').stop().fadeIn(400);
				$('.path_circle_3').stop().fadeIn(400);

					// console.log(dataZoom);
					// console.log(scrollCount);
					// if(scrollCount <= $('.path_circle').attr('cx')){
					// $('.path_circle').css("fill","#000");

					// }
				// }
				
			}
		else{
			$(this).removeClass("active");
			if(!$('.js-section').hasClass("active")){
				$('.bg_svg').stop().animate({zoom: "100%", left: '40%'},400);
				// $('.path_circle').fadeOut(400);
			}
		}

	});
//ЗДЕСЬ МОЖЕШЬ ЧЕРЕЗ ФОР ИЧ НАПИСАТЬ ЭТУ ФУНКЦИЮЮ ДЛЯ ВСЕХ КАРТИНОК НА СТРАНИЦЕ
	$('.js-image').each(function(currentImg){
		var img_top_offset = $(this).offset().top;
		var img_bottom = $(this).offset().top + $(this).outerHeight();
		var bottomOfScreen = $(window).scrollTop() + $(window).height();
		var topOfScreen = $(window).scrollTop();
		if((bottomOfScreen > img_top_offset) && (topOfScreen < img_bottom)){
		var Coordinates = $(this)[0].getBoundingClientRect();
		console.log("Top:"+Coordinates.top+", Left:"+Coordinates.left+", Right:"+Coordinates.right+", Bottom:"+Coordinates.bottom)
		var bottomOffsetImg = Coordinates.top + $(this).height();

		$(path1).attr('d', "M487.588,412.15 L"+ (-Coordinates.left) + " " + (Coordinates.top) +  " L" + (-Coordinates.left) + " " + (Coordinates.bottom -30) );

			$(path1).css('position',"relative");
		// $(path1).attr('stroke', '#000');
		$(path1).attr('fill', '#26a69a');
		$(path1).attr('opacity', '.1');
		$(path2).attr('opacity', '.1');
		// $(path2).attr('stroke', '#000');
		$(path2).attr('fill', '#26a69a');
		$(path1).fadeIn(900);
}
else{	
	
}
});
}


	

	// circle.onclick = function(){
	// 	path.classList.add('anim');
	// }

$(document).ready(function(){
		$('.bg_svg svg').append(path1);
		$('.bg_svg svg').append(path2);
	var $dashOffset = $('.st0').css("stroke-dashoffset");
			var offsetDash = $('.st0').css("stroke-dashoffset");
	$(window).scroll(function(){
		var $percentageComplete = (($(window).scrollTop() / ($("html").height() - $(window).height())) * 100);



		var $newUnit = parseInt($dashOffset, 10);
		var $offsetUnit = $percentageComplete * ($newUnit / 100);
		$('.st0').css("stroke-dashoffset", $newUnit - $offsetUnit);

		sectionCounter();			
		
				


				if(Math.round($newUnit - $offsetUnit) < 830 || $newUnit - $offsetUnit == 723 || $newUnit - $offsetUnit == 490){
					$('.path_circle_1').css("fill", "#000");
				}
				if(Math.round($newUnit - $offsetUnit) < 723){
					$('.path_circle_2').css("fill","#000");
				}
				if(Math.round($newUnit - $offsetUnit) < 490){
					$('.path_circle_3').css("fill", "#000");
				}


	// if(bo >= 370){
	// 		$('.bg_svg').stop().animate({zoom: '130%',left: '50%'},400);
	// 		$('#firstCircle').fadeIn(400);
	// }
	// else{
	// 	$('#firstCircle').hide(400);
	// }
	// if(bo >=648){
	// 	$('.bg_svg').stop().animate({zoom: '140%',left: '40%'},400);
	// 	$('#secondCircle').fadeIn(400);
	// }
	// else{
	// 	$('#secondCircle').hide(400);
	// }
	// if(bo >=1170){
	// 	$('.bg_svg').stop().animate({zoom: '150%',left: '20%'},400);
	// 	$('#thirdCircle').fadeIn(400);
	// }
	// if(bo <=1170){
	// 	$('#thirdCircle').hide(400);
	// }
	// if(bo<400) {
	// 	$('.bg_svg').stop().animate({zoom: '100%',left: '50%'},400);
	// 	console.log('works');
	// }


	});
});













	// path.style.z-index = "100";

// 	console.log(1);

// $(document).scroll(function(){
// 	var current_scroll_top = $(document).scrollTop();
// 	console.log(current_scroll_top);
// 	function AnimateLine(){
// 	var line = document.querySelector('.st0');
// 	lineLength = line.getTotalLength();
// 	var to = current_scroll_top;
// 	var from = 0;

// 	animate({
// 		duration: 5000,
// 		timing: linear,
// 		draw: function(progress){
// 			var result = (to - from) * progress + from;
// 			line.style.stroke-dasharray = to*progress;
// 		}
// 	});	
// }
// })