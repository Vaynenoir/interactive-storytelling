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

Snap.plugin( function( Snap, Element, Paper, global ) {
        Paper.prototype.circlePath = function(cx,cy,r) {
        var p = "M" + cx + "," + cy;
        p += "m" + -r + ",0";
        p += "a" + r + "," + r + " 0 1,0 " + (r*2) +",0";
        p += "a" + r + "," + r + " 0 1,0 " + -(r*2) + ",0";
        return this.path(p, cx, cy );

                };
});

var s = Snap(svgRoot);
	svgRoot.append(path);

		var circlesArray = JSON.parse(localStorage.getItem('circlesCoords'));
		console.log(circlesArray);
		var pointsArr = [];
		$.each(circlesArray, function(el){
				// var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

				// $(circle).attr('cx', this.cx);
				// $(circle).attr('cy', this.cy);
				// $(circle).attr('r', this.r);
				// $(circle).attr("fill", "#000");
				var circle = s.circlePath(this.cx,this.cy,this.r).attr({ fill: "none", stroke: "red" });
				var intersects = Snap.path.intersection(circle, $(path).attr('d'));
				intersects.forEach( function( el ) {
        s.circle( el.x, el.y, 2 );
				} );
				 // console.log(Snap.getElementByPoint(this.cx, this.cy).getTotalLength());

				console.log(path);
				console.log(circle);
				svgRoot.append(circle);
				// console.log(pointsArr);
				// var subPath;
				// var pathR = [];
				// console.log(s.path.getSubpath(1,2));

				
       // var pointsAry = [["M",10,10],["T",30,50],["T",60,100],["T",80,200],["T",300,400]], subPath, path = [];
            // for (var i = 0 ; i < pointsArr.length ; i++) {
            //     pathR.push(pointsArr[i]);
            //     subPath = Paper.path(pathR).attr({ "stroke-opacity": 0 }); // make the path invisible
            //     pointsArr[i].subPathSum = subPath.getTotalLength();
            //     subPath.remove();
            // }

            // console.log(pointsArr);



		});
// console.log(path.getSubpath(0, 270));




var cp = s.circlePath(100,150,50).attr({ fill: "none", stroke: "red" });
var cp2 = s.circlePath(120,140,50).attr({ fill: "none", stroke: "blue" });
var cp3 = s.circlePath(100,120,60).attr({ fill: "none", stroke: "green" });
var intersects = Snap.path.intersection(cp,cp2);

var intersects2 = Snap.path.intersection(cp,cp3);


intersects2.forEach( function( el ) {
        s.circle( el.x, el.y, 5 );
} );

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