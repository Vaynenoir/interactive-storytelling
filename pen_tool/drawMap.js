$(document).ready(function(){

var a = document.getElementById('map');
	  var map_url = JSON.parse(localStorage.getItem('map'));
    $('#map').attr('data', map_url);
a.addEventListener("load",function(){
	  var svgDoc = a.contentDocument; 
    var svgRoot  = svgDoc.documentElement;
    var PathDirection = JSON.parse(localStorage.getItem('path'));


    console.log(svgRoot);

	if(PathDirection){
		var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		$(path).attr('d', PathDirection);
		$(path).attr('fill', 'transparent');
		$(path).attr('stroke', '#000');
		console.log(path);
	}




	svgRoot.append(path);
		var circlesArray = JSON.parse(localStorage.getItem('circlesCoords'));
		console.log(circlesArray);
		$.each(circlesArray, function(el){
				var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				$(circle).attr('cx', this.cx);
				$(circle).attr('cy', this.cy);
				$(circle).attr('r', this.r);
				$(circle).attr("fill", "#000");
				console.log(circle);
				svgRoot.append(circle);
		});




},false);

   // var svgIntersections = require(['svg-intersections']);
   //  var intersect = svgIntersections.intersect;
   //  var shape = svgIntersections.shape;


   //   var intersections = intersect(  
   //      shape("circle", { cx: $("circle").attr('cx'), cy: $("circle").attr('cy'), r: $("circle").attr('r') }),
   //      shape("path", { d: $(path).attr('d') })  
   //  );
	var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties'));
	console.log(WrapperProps);
	$.each(WrapperProps, function(prop, value){
		$(".mapbg").css(prop, value);
	});
});