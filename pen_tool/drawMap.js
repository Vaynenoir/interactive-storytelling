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
        resize: function(event,ui){
            ui.size.width += ui.size.width - ui.originalSize.width;
            if(ui.size.width > 900){
                ui.size.width == 900;
            }
        },
        handles: 'e'

    });



    function compareId(objA, objB) {
        return objA.id - objB.id;
    }




    var a = document.getElementById('map');
    var map_url = JSON.parse(localStorage.getItem('map'));
    $('#map').attr('data', map_url);
    a.addEventListener("load", function() {
        var svgDoc = a.contentDocument;
        var svgRoot = svgDoc.documentElement;
        var PathDirection = JSON.parse(localStorage.getItem('path'));

        if (PathDirection) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            $(path).attr('d', PathDirection);
            $(path).attr('fill', 'transparent');
            $(path).attr('stroke', '#000');

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
        var pathLength = path.getTotalLength();
        console.log(circlesArray);
        var CirclesArrayClone = [];



        for (var k = 0; k < circlesArray.length; k++) {
            CirclesArrayClone[k] = circlesArray[k];
        }


        var circlesCounter = 0;
        console.log(circlesArray);
        for (var i = 0; i < pathLength; i++) {
            var pathLengthAtPoint = path.getPointAtLength(i);
            var pointX = pathLengthAtPoint.x;
            var pointY = pathLengthAtPoint.y;


            for (var j = 0; j < CirclesArrayClone.length; j++) {

                if (Math.abs(Math.round(pointX - CirclesArrayClone[j].cx)) <= 8 && Math.abs(Math.round(pointY - CirclesArrayClone[j].cy)) <= 8) {

                    for (var l = 0; l < circlesArray.length; l++) {
                             
                        if (Math.abs(Math.round(circlesArray[l].cx - CirclesArrayClone[j].cx)) <=4 && Math.abs(Math.round(circlesArray[l].cy - CirclesArrayClone[j].cy)) <=4) {
                                
                                 

                            circlesArray[l].id = circlesCounter++;

                             

                        }


                    }
CirclesArrayClone.splice(j, 1);
                   
                }

            }
        }

        circlesArray.sort(compareId);
        console.log(circlesArray);

        localStorage.setItem('circlesCoords', JSON.stringify(circlesArray));




        var circlesArray = JSON.parse(localStorage.getItem('circlesCoords'));
        var pointsArray = [];
        var stringArr = '';


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
                id: el.id
            });

            var intersects = Snap.path.intersection(circle, $(path).attr('d'));
            
            if(intersects.length == 0){
                alert("Please, return to the previous step and draw points right on the route line");
                document.location.replace("http://127.0.0.1:8080/");
            }
            else{
            pointsObj.cx = intersects[0].x;
            pointsObj.cy = intersects[0].y;
            }


            pointsArray.push(pointsObj);

                console.log(pointsArray);
            intersects.forEach(function(el) {

                s.circle(el.x, el.y, 1);

            });

            localStorage.setItem('points', JSON.stringify(pointsArray));
        });

            
                
            



        if (localStorage.getItem('PointsContent') != null) {
            var pointsDataContentArray = JSON.parse(localStorage.getItem('PointsContent'));
        } else {
            var pointsDataContentArray = [];
        }
        for (var i = 0; i < circlesArray.length; i++) {
            var paths = svgDoc.getElementById(i);

            var equalID = i + 1;

            for (var j = 0; j < pointsDataContentArray.length; j++) {

                if (pointsDataContentArray[j].pointId == equalID) {
                    console.log("pointsId: " + pointsDataContentArray[j].pointId + ", eq = " + equalID);
                    var checked = pointsDataContentArray[j].pointId - 1;
                    var FilledContentPaths = svgDoc.getElementById(checked);
                    $(FilledContentPaths).css("fill", "#990033");
                }

            }
            paths.style.cursor = "pointer";
            $(paths).mouseenter(function() {
                $(this).css("transition", "0.5s");
                $(this).css("stroke-width", "6px");
                $(this).css("stroke", "#000");


            }).mouseout(function() {
                $(this).css("transition", "0.5s");
                $(this).css("stroke-width", "3px");
                $(this).css("stroke", "#000");
            });

            paths.addEventListener("click", function() {

                var Npoint = parseInt(this.id) + 1;
                var currentPath = this;
                if (localStorage.getItem('PointsContent') != null) {
                    var getPointData = JSON.parse(localStorage.getItem('PointsContent'));
                    var PointLastData;



                    for (var j = 0; j < getPointData.length; j++) {

                        var count = getPointData[j].pointId == Npoint;
                        if (getPointData[j].pointId == Npoint) {
                            document.getElementById("pointZoom").value = getPointData[j].zoom;
                            document.getElementById("pointTop").value = getPointData[j].top;
                            document.getElementById("pointBottom").value = getPointData[j].bottom;
                            document.getElementById("pointLeft").value = getPointData[j].left;
                            document.getElementById("pointRight").value = getPointData[j].right;
                        }

                        if (count) {

                            PointLastData = getPointData[j].data;

                        }
                    }

                    editor.setData(PointLastData);

                }

                openNav(Npoint);

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


                    pointsDataContent.pointId = Npoint;

                    pointsDataContent.zoom = InputZoomValue;
                    pointsDataContent.top = InputTopValue;
                    pointsDataContent.bottom = InputBottomValue;
                    pointsDataContent.left = InputLeftValue;
                    pointsDataContent.right = InputRightValue;




                    pointsDataContent.data = editor.getData();

                    for (var j = 0; j < pointsDataContentArray.length; j++) {

                        if (pointsDataContentArray[j].pointId == Npoint) {
                            pointsDataContentArray.splice(j, 1);

                        }
                    }
                    pointsDataContentArray.push(pointsDataContent);
                    localStorage.setItem('PointsContent', JSON.stringify(pointsDataContentArray));
                    // console.log(pointsDataContentArray);
                    $("#userNotification").fadeIn(200);




                    $(currentPath).css("fill", "#990033");
                };
            });
        }



        var pathLength = path.getTotalLength();

        var stopsAtLength = [];

        for (var i = 0; i < pathLength; i++) {
            var pathLengthAtPoint = path.getPointAtLength(i);

            var pointX = pathLengthAtPoint.x;
            var pointY = pathLengthAtPoint.y;


            for (var j = 0; j < pointsArray.length; j++) {


                if (Math.abs(Math.round(pointX - pointsArray[j].cx)) <= 0 && Math.abs(Math.round(pointY - pointsArray[j].cy)) <= 0) {

                    stopsAtLength.push(i);

                }

            }




            


        }
        if(stopsAtLength.length != pointsArray.length){
            for(var i=0; i< stopsAtLength.length; i++){
                    if(stopsAtLength[i+1] - stopsAtLength[i] == 1 ) stopsAtLength.splice(i,1);
            }
        }
        console.log(stopsAtLength);
        localStorage.setItem("stopsAtLength", JSON.stringify(stopsAtLength));

        if (pointsArray.length !== stopsAtLength.length) {
            console.log("HERE IS THE DIFFERENCE: 1st array length = " + pointsArray.length + ', 2nd arr length= ' + stopsAtLength.length + "");
        } else {
            console.log('no DIFFERENCE between arr lengths');
        }





    }, false);


    var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties'));
    $.each(WrapperProps, function(prop, value) {
        $(".mapbg").css(prop, value);
    });

});