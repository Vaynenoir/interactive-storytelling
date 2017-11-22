$(document).ready(function() {
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */


// $("#mySidenav").on({

//     mouseenter: function() {

//         $(this).resizable({
//         handles: 'e',
//         ghost: true
//         });

//     },
//     mouseleave : function(){
//         $(this).resizable({
//         handles: 'e',
//         ghost: true            
//     });
//     }

// });


    $("#mySidenav").resizable({
        handles: 'e',
        ghost: true,
        containment: '#head'
    });












    var a = document.getElementById('map');
    var map_url = JSON.parse(localStorage.getItem('map'));
    $('#map').attr('data', map_url);
    a.addEventListener("load", function() {
        var svgDoc = a.contentDocument;
        var svgRoot = svgDoc.documentElement;
        var PathDirection = JSON.parse(localStorage.getItem('path'));


        console.log(svgRoot);

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
			  var pointsArray = [];
				var stringArr = '';


//  Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white 


      $.each(circlesArray, function(index, el) {
      	var pointsObj = {
        	cx: 0,
        	cy: 0,
        	r: 1
        };    

        var circle = s.circlePath(this.cx, this.cy, this.r).attr({
            fill: "#ff6600",
            stroke: "#000",
            "stroke-width": "3px",
            id: index
            // onclick: "openNav();"
        });

        var intersects = Snap.path.intersection(circle, $(path).attr('d'));
        		console.log(intersects);
            pointsObj.cx = intersects[0].x;
            pointsObj.cy = intersects[0].y;

            pointsArray.push(pointsObj);
						// console.log(pointsArray);
						// circlesOnPage.push(circle);
            intersects.forEach(function(el) {

                s.circle(el.x, el.y, 1);       
                
            });
            // console.log(pointsArray);
					localStorage.setItem('points', JSON.stringify(pointsArray));
        });	






		if (localStorage.getItem('PointsContent') != null) {
		    var pointsDataContentArray = JSON.parse(localStorage.getItem('PointsContent'));
		} else {
		    var pointsDataContentArray = [];
		}
		for (var i = 0; i < circlesArray.length; i++) {
		    var paths = svgDoc.getElementById(i);
		    // paths[i].attr("data","alert(1)");
		    var equalID = i + 1;
		    // console.log(pointsDataContentArray[i].pointId);
		    for(var j=0;j<pointsDataContentArray.length;j++){

		    if(pointsDataContentArray[j].pointId == equalID){
		    	console.log("pointsId: " + pointsDataContentArray[j].pointId+", eq = "+ equalID);
		    	var checked = pointsDataContentArray[j].pointId-1;
		    	var FilledContentPaths = svgDoc.getElementById(checked);
		    	// console.log(FilledContentPaths);
		    	$(FilledContentPaths).css("fill", "#990033");
		    }

		    }
		    paths.style.cursor = "pointer";
		    $(paths).mouseenter(function(){
		    	$(this).css("transition", "0.5s");
		    	$(this).css("stroke-width", "6px");
		    	$(this).css("stroke","#000");


		    }).mouseout(function(){
		    	$(this).css("transition", "0.5s");
		    	$(this).css("stroke-width", "3px");
		    	$(this).css("stroke","#000");
		    });
		    // if(pointsDataContentArray[i].pointId === paths.id){
		    // 	console.log('Here is content at path N ' + paths );
		    // }
		    // else{
		    // 	console.log("no content on paths yet1");
		    // }
		  
		    paths.addEventListener("click", function() {

		        var Npoint = parseInt(this.id) + 1;
		        // if(getPointData[].pointId){
		        // 	editor.
		        // }
		        console.log(this);
		        var currentPath = this;
		        if (localStorage.getItem('PointsContent') != null) {
		            var getPointData = JSON.parse(localStorage.getItem('PointsContent'));
		          	console.log(getPointData);
		          	var PointLastData;

		          	// console.log(getPointData[Npoint].zoom);

		            for (var j = 0; j < getPointData.length; j++) {
		            		// document.getElementById("pointZoom").value = getPointData[j].zoom;
		                var count = getPointData[j].pointId == Npoint;
		                if(getPointData[j].pointId == Npoint){
		                	document.getElementById("pointZoom").value = getPointData[j].zoom;
		                	document.getElementById("pointTop").value = getPointData[j].top;
		                	document.getElementById("pointBottom").value = getPointData[j].bottom;
		                	document.getElementById("pointLeft").value = getPointData[j].left;
		                	document.getElementById("pointRight").value = getPointData[j].right;
		                }
		                console.log(count);
		                if (count) {
		                    // editor.setData(getPointData[j].data);
		                    PointLastData = getPointData[j].data;
		                    console.log(PointLastData);
		                }
		          }

		          editor.setData(PointLastData);

		        }
		        openNav(Npoint);
		        console.log(pointsDataContentArray);
		            // $("#pointZoom").val(parseInt(pointsDataContentArray.zoom));
		            // $("#pointTop").val(parseInt(pointsDataContentArray.top));
		            // $("#pointBottom").val(parseInt(pointsDataContentArray.bottom));
		            // $("#pointLeft").val(parseInt(pointsDataContentArray.left));
		            // $('#pointRight').val(parseInt(pointsDataContentArray.right));

		            console.log(document.getElementById("pointZoom").value,document.getElementById("pointTop").value,document.getElementById("pointBottom").value,document.getElementById("pointLeft").value,document.getElementById('pointRight').value);
		        document.getElementById("SavePointContent").onclick = function() {
		            var pointsDataContent = {
		                pointId: 0,
		                zoom: 0,
		                top: 0,
		                bottom: 0,
		                left: 0,
		                right: 0,
		                data: ""
		            };
		            var InputZoomValue = parseInt(document.getElementById("pointZoom").value);
		            var InputTopValue = parseInt(document.getElementById("pointTop").value);
		            var InputBottomValue = parseInt(document.getElementById("pointBottom").value);
		            var InputLeftValue = parseInt(document.getElementById("pointLeft").value);
		            var InputRightValue = parseInt(document.getElementById('pointRight').value);
		            console.log(InputZoomValue,InputTopValue,InputBottomValue,InputLeftValue,InputRightValue);

		            console.log(pointsDataContentArray);
		            // $(FilledPathContent).css("fill", "red");
		            pointsDataContent.pointId = Npoint;

		            pointsDataContent.zoom = InputZoomValue;
		            pointsDataContent.top = InputTopValue;
		            pointsDataContent.bottom = InputBottomValue;
		            pointsDataContent.left = InputLeftValue;
		            pointsDataContent.right = InputRightValue;




		            pointsDataContent.data = editor.getData();

		            for(var j = 0; j < pointsDataContentArray.length;j++){
		            	
		            	if(pointsDataContentArray[j].pointId == Npoint){
		            		pointsDataContentArray.splice(j,1);
		            		console.log(pointsDataContentArray);
		            	}
		            }	
		            pointsDataContentArray.push(pointsDataContent);
		            localStorage.setItem('PointsContent', JSON.stringify(pointsDataContentArray));
		            console.log(pointsDataContentArray);
		            $("#userNotification").fadeIn(200);
		            












		           $(currentPath).css("fill", "#990033");
		        };
		    });
		}
			// console.log(circlesOnPage);
			// $.each(circlesOnPage, function(el){
			// 	$(this).on("click", function(){
			// 		alert(1);
			// 	});
			// });





 			var pathLength = path.getTotalLength();
        console.log(pathLength);
        var stopsAtLength = [];

        for(var i=0;i<pathLength;i++){
        	var pathLengthAtPoint = path.getPointAtLength(i);
        	// console.log(pathLengthAtPoint);
        	var pointX = pathLengthAtPoint.x;
        	var pointY = pathLengthAtPoint.y;

        	// console.log(pointsArray[i].cy);
        	for(var j=0;j<pointsArray.length;j++){
        	// var resultX = Math.round(pointX) - Math.round(pointsArray[j].cx);
        	// var resultY = Math.round(pointY) - Math.round(pointsArray[j].cy);
        	// (Math.ceil(pointX) == Math.ceil(pointsArray[j].cx)  && Math.floor(pointY) == Math.floor(pointsArray[j].cy)) && 
        	  if( Math.round(pointX) == Math.round(pointsArray[j].cx)  && Math.round(pointY) == Math.round(pointsArray[j].cy)){
        	  	
        			// console.log('['+Math.round(pointX),Math.round(pointsArray[j].cx)+'], '+'['+Math.round(pointY), Math.round(pointsArray[j].cy)+']');
        			stopsAtLength.push(i);
        			
        		}

        	}



					localStorage.setItem("stopsAtLength", JSON.stringify(stopsAtLength));
					

        }
        		if(pointsArray.length !== stopsAtLength.length){
        			console.log("HERE IS THE DIFFERENCE: 1st array length = " + pointsArray.length + ', 2nd arr length= '+ stopsAtLength.length+""  );
        		}
        		else{
        			console.log('no DIFFERENCE between arr lengths');
        		}
        // console.log(stopsAtLength);





var CirclesArrayClone = [];
  for(var k=0;k<circlesArray.length;k++){
    CirclesArrayClone[k] = circlesArray[k]; 
  }
  console.log(CirclesArrayClone);


        for(var i=0;i<pathLength;i++){
            var pathLengthAtPoint = path.getPointAtLength(i);
            // console.log(pathLengthAtPoint);
            var pointX = pathLengthAtPoint.x;
            var pointY = pathLengthAtPoint.y;


            for(var j=0;j<CirclesArrayClone.length;j++){

              if( Math.abs(Math.round(pointX - CirclesArrayClone[j].cx)) <=8  && Math.abs(Math.round(pointY - CirclesArrayClone[j].cy)) <= 8){
                
                    console.log('['+Math.round(pointX),Math.round(CirclesArrayClone[j].cx)+'], '+'['+Math.round(pointY), Math.round(CirclesArrayClone[j].cy)+']');
                    CirclesArrayClone.splice(j,1);
                    // console.log(CirclesArrayClone);
                    circlesArray[j].id = j+1;
                }


        }

    }
    console.log(circlesArray);
















        // var result = [];
        // var subPathsCommonLength = 0;
        // var string = '';
        // string += ($(path).attr("d"));
        // var arr = string.split("T");


        // console.log(path.getTotalLength());

        // for (var i = 1; i < arr.length; i++) {
        //     arr[i] = "M" + arr[i];
        //     arr[i] += "T";

        // }
        // arr[0] += "T";

        // for (var i = 0; i < arr.length; i++) {
        //     var newPath = arr[i];
        //     // console.log(newPath);
        //     var SeparatePaths = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        //     $(SeparatePaths).attr('d', newPath);
        //     $(SeparatePaths).attr('fill', "none");
        //     $(SeparatePaths).attr('stroke', "#000");
        //     pathGroup.append(SeparatePaths);
        //     svgRoot.append(pathGroup);
        //     result.push(SeparatePaths.getTotalLength());
        //     subPathsCommonLength += SeparatePaths.getTotalLength();

        // }


    }, false);


    var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties'));
    console.log(WrapperProps);
    $.each(WrapperProps, function(prop, value) {
        $(".mapbg").css(prop, value);
    });

});
