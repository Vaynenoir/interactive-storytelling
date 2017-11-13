$(document).ready(function(){

	   var dataContent = JSON.parse(localStorage.getItem('PointsContent'));
     console.log(dataContent);

     function inWindow(s) {
     		if (!$(s).length) return false; // element not found

    		 var img_top_offset = $(s).offset().top;
    		 var img_bottom = $(s).offset().top + $(s).outerHeight();
    		 var bottomOfScreen = $(window).scrollTop() + $(window).height();
    		 var topOfScreen = $(window).scrollTop();

    		 return (bottomOfScreen > img_top_offset) && (topOfScreen < img_bottom);
 		}




     


     function compareId(objA, objB) {
 			 return objA.pointId - objB.pointId;
			}


     dataContent.sort(compareId);
     var text_cont = document.getElementById("boom");

     		for(var i=0;i<dataContent.length;i++){
     			var section = document.createElement('section');
     			$(section).addClass('js-section');
     			$(section).attr({
     				"data-zoom": dataContent[i].zoom + "%",
     				"data-pos-top": dataContent[i].top  + "%",
     				"data-pos-bottom": dataContent[i].bottom  + "%",
     				"data-pos-left": dataContent[i].left  + "%",
     				"data-pos-right": dataContent[i].bottom  + "%",
     				"id": "section_" + i
     		});


     			section.insertAdjacentHTML('beforeend', dataContent[i].data);
     			$(section).find('img').addClass('js-image');
     			$(section).find('.js-image').attr('data-pos-x', 0);
     			$(section).find('.js-image').attr('data-pos-y', 0);


     			text_cont.append(section);	
     	}



     // $('#textWrap p').addClass('kek');
$('.mapbg').css("zoom", "0%");
$('.mapbg').css("right", "0");
$('mapbg').css("bottom", "0");
 var a = document.getElementById('map');

    var map_url = JSON.parse(localStorage.getItem('map'));
    var map_url_true = "../"+map_url;
    console.log(map_url_true);
    // $('#map').attr('data', map_url);
    $('#map').attr('data', map_url_true);
    a.addEventListener("load", function() {
    	
    	console.log($("#map").attr('data'));
        var svgDoc = a.contentDocument;
        var svgRoot = svgDoc.documentElement;
        var PathDirection = JSON.parse(localStorage.getItem('path'));

        console.log(svgRoot);
        $(svgRoot).addClass("my-svg");

        if (PathDirection) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            $(path).attr('d', PathDirection);
            $(path).attr('fill', 'transparent');
            $(path).attr('stroke', '#000');

            // console.log(path);
        }





     	   var currentDisplacementTop = parseInt($("#IDmapbg")[0].style.top);
     	   var currentDisplacementLeft = parseInt($('#IDmapbg')[0].style.left);
         // console.log(currentDisplacementLeft);
          var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 					$(path1).css('display', 'none');

 
function sectionCounter() {
     $('.js-section').each(function(i) {
     	   // var sectionId = "section_" + i;
     	   // console.log(i);
     	   // $(this).attr('id', sectionId);
         var scrollCount = $(window).scrollTop();
         var topOffset = $(this).offset().top;
         var dataZoom = $(this).attr("data-zoom");
         // console.log(dataZoom);
         var dataPosTop = parseInt($(this).attr("data-pos-top")) + currentDisplacementTop + "%" ;
         var dataPosBottom = $(this).attr('data-pos-bottom');
         var dataPosLeft = parseInt($(this).attr("data-pos-left")) + currentDisplacementLeft + "%";
         var dataPosRight = $(this).attr("data-pos-right");


         // console.log(dataPosLeft);
         if (topOffset <= scrollCount && inWindow($(this))) {

             $(this).addClass("active");
             
             $('.mapbg').stop(400).animate({
                 zoom: dataZoom,
                 left: dataPosLeft ,
                 right: dataPosRight,
                 top: dataPosTop,
                 bottom: dataPosBottom
             }, 400);
   


         } else {
             $(this).removeClass("active");
             if (!$('.js-section').hasClass("active")) {
                 $('.mapbg').stop().animate({
                     left: currentDisplacementLeft + "%",
                     top: currentDisplacementTop + "%",
                     zoom: "100%"
                 }, 400);

             }
         }

     });

     var arrImgID = [];
     $('.js-image').each(function(el) {

         arrImgID.push($(this));
     });


    var CirclePathCoords = JSON.parse(localStorage.getItem('circlesCoords'));
    $(arrImgID).each(function(i,el){
     		$(this).attr({
     			'data-pos-x': CirclePathCoords[i].cx,
     			'data-pos-y': CirclePathCoords[i].cy
     });
     		// console.log(el);
     	}); 
     // var vis_count = 0;
     // console.log(arrImgID);


     var vis_count = 0;





     $(arrImgID).each(function() {
         if (inWindow($(this))) {
             vis_count++;
        //      	console.log($(this));
 							// console.log($(this));
             	 	var cx = $(this).attr('data-pos-x');
             		var cy = $(this).attr('data-pos-y');
             		// console.log(circle);
             		


             var Coordinates = $(this)[0].getBoundingClientRect();

             // console.log("Top:"+Coordinates.top+", Left:"+Coordinates.left+", Right:"+Coordinates.right+", Bottom:"+Coordinates.bottom);
             var bottomOffsetImg = Coordinates.top + $(this).height();
             // console.log(Coordinates);
             $(path1).attr('d', "M" + cx + " " + cy + " L" + (-Coordinates.left) + " " + (Coordinates.top-120) + " L" + (Coordinates.left) + " " + (Coordinates.bottom-200));
             $(path1).css('position', "relative");
             $(path1).attr('fill', '#47DBB4');
             $(path1).attr('opacity', '.2');

         }
     });


svgRoot.append(path1);
     if (vis_count > 0) {
         $(path1).fadeIn(900);
     } else {
         $(path1).fadeOut(900);
     }
 }





































                 Snap.plugin(function(Snap, Element, Paper, global) {
            Paper.prototype.circlePath = function(cx, cy, r) {
                var p = "M" + cx + "," + cy;
                p += "m" + -r + ",0";
                p += "a" + r + "," + r + " 0 1,0 " + (r * 2) + ",0";
                p += "a" + r + "," + r + " 0 1,0 " + -(r * 2) + ",0";
                return this.path(p, cx, cy);

            };
        });

        var pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        pathGroup.id = "pathGroup";
        pathGroup.append(path);
        svgRoot.append(pathGroup);
        var s = Snap(pathGroup);

        var circlesArray = JSON.parse(localStorage.getItem('circlesCoords'));


     $.each(circlesArray, function(index, el) {

        var circle = s.circlePath(this.cx, this.cy, this.r).attr({
            fill: "#ff6600",
            stroke: "#000",
            "stroke-width": "3px",
            id: index
            // onclick: "openNav();"
        });

        var intersects = Snap.path.intersection(circle, $(path).attr('d'));

            intersects.forEach(function(el) {

                s.circle(el.x, el.y, 1);       
                
            });

        });	

     	text_cont.style.display = "block";









     	var length = path.getTotalLength();


     var offsetDash = $(path).css({
         "stroke-dashoffset": length,
         "stroke-dasharray": length + " " + length
     });
     
     var StopPoints = JSON.parse(localStorage.getItem('stopsAtLength'));
     // for(var i=0;i<StopPoints.length;i++){
     // 	var stopPoint = StopPoints[i];
     // 	console.log(stopPoint);
     // }
     var stops = (function(pathLength){
     	for(var i=0; i< StopPoints.length;i++){
     		var stopPoint = StopPoints[i];
     		// console.log(pathLength);
     		if((stopPoint - 8)<= pathLength <=(stopPoint)){
     			// console.log(pathLength);
     		}
     	}
     });
     

var  counter = 0;
// console.log(length);










function checkContentInWindow(i){

$.each($('.js-section'), function(){
if($(this).hasClass('active')){
	var id = $(this).attr("id");
		
		id = id[8];

		
		return parseInt(id);
}
});

}










function scrolled(e) {

	   var $percentageComplete = (($(window).scrollTop() / ($("html").height() - $(window).height())) * 100);


	   // console.log(pathBegin);
	   	// console.log($(path).css("stroke-dashoffset"));
	   

    var $newUnit = length; //parseInt($dashOffset, 10);
    var $offsetUnit = $percentageComplete * ($newUnit / 1000);
    var offsetCounter = $newUnit - ($offsetUnit);
    // console.log(Math.round($offsetUnit));
    // console.log(path.pathLength);
 

    // console.log(Math.floor($offsetUnit));
    
    if(20>($newUnit - ($offsetUnit)) >0){
    	$(path).css("stroke-dashoffset", "0px");
    }








	sectionCounter();












	for(var i=0; i< StopPoints.length;i++){
		   	checkContentInWindow(i);
				var faultLess = StopPoints[i] - 6;
				var faultMore = StopPoints[i] + 20;
				var pathCurrentLength = Math.floor($offsetUnit);
				// console.log(faultMore,faultLess);
				// console.log(inWindow($('#section_' + i)));
				// enableScroll(i);

				// console.log($('.active'));
				// checkContentInWindow(i);
				// console.log(pathCurrentLength);


				// if( pathCurrentLength < faultMore && pathCurrentLength > faultLess ){
     						

     						console.log(checkContentInWindow(i));
     				if(checkContentInWindow(i) === i){
     						console.log('KEK');
     						$(path).css("stroke-dashoffset", "" + ($newUnit -  StopPoints[checkContentInWindow(i)]) + "px");
     				}
     		// console.log(($newUnit - pathCurrentLength));
     		
     		// $(path).css("stroke-dashoffset", StopPoints[i] + "px");
     		// $(window).unbind("scroll", scrolled);

     			
				// $(window).on("scroll resize");
				
     	// }


				$(path).css("stroke-dashoffset", "" + ($newUnit - pathCurrentLength) + "px");

				// if( pathCurrentLength > faultMore && pathCurrentLength < faultLess && checkContentInWindow(i) == i){
     		
    //  		$(path).css("stroke-dashoffset", "" + ($newUnit - pathCurrentLength) + "px");

    //  			// $(window).bind("scroll", scrolled);
     		
    //  	  }
				


     		

     	// else if(pathCurrentLength > faultMore && pathCurrentLength < faultLess ){
     	// 	$(window).on("scroll");
     	// 	$(path).css("stroke-dashoffset", ($newUnit - ($offsetUnit)));
     	// }
     	
     	// else{
     	// 	$(window).bind("scroll", function(){
      //       scroll();
      //   });
     	// 	}
     	// else if(pathCurrentLength > faultMore && pathCurrentLength < faultLess ){
     	// 	$(path).css("stroke-dashoffset", ($newUnit - ($offsetUnit)));
     	// }
     	}	
}






$(window).on("scroll", scrolled);


















      }, false);

     var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties'));
    console.log(WrapperProps);
    $.each(WrapperProps, function(prop, value) {
        $("#IDmapbg").css(prop, value);
    });

});