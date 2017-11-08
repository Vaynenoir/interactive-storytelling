$(document).ready(function(){
	     var dataContent = JSON.parse(localStorage.getItem('PointsContent'));
     console.log(dataContent);
     function compareId(objA, objB) {
 			 return objA.pointId - objB.pointId;
			}
     dataContent.sort(compareId);
     var text_cont = document.getElementById("textWrap");
     for(var i=0;i<dataContent.length;i++){
     	text_cont.insertAdjacentHTML('beforeend', dataContent[i].data); ;
     	
     }
     $('#textWrap p').addClass('kek');

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


      }, false);
     var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties'));
    console.log(WrapperProps);
    $.each(WrapperProps, function(prop, value) {
        $(".mapbg").css(prop, value);
    });

});