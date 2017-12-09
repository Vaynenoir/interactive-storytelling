$(document).ready(function() {





// $("#minus").bind('click',function(){
//     scaleImg -=0.3;
//     if(scaleImg < 1.1){
//         scaleImg = 1;
//     }
//     $("#map_bg").css("transform", "scale("+scaleImg+")");
//     styleProps.transform =  "scale("+scaleImg+")";
//     localStorage.setItem('zoom', JSON.stringify(scaleImg));
// });







    function getSettingFromStorage(setting){
        var SettingsObject = JSON.parse(localStorage.getItem("Settings")) || {
        mapColor: "rgba(255, 204, 128, 1)",
        mapStrokeColor: "rgba(0, 0, 0, 1)",
        mapPointsColor: "rgba(0, 0, 255, 1)",
        mapPointsBorderColor: "rgba(0, 0, 0, 1)",
        mapRouteColor: "rgba(0, 0, 0, 1)",
        bodyBackgroundColor: "rgba(243, 229, 245, 1)",
        routeBorderWidth: "4",
        pointsRadius: "8",
        pointsBorderWidth: "1"
    };
        if(SettingsObject[setting]){
            return SettingsObject[setting];
        }
    }


      $('ul.tabs').tabs('select_tab', 'tab_2');
        $("#menu").on("click", function(){
    if(!$(this).hasClass('.active')){
        $(this).addClass("active");
         $('.tap-target').tapTarget('open');
    }
    else{
        $(this).removeClass("active");
         $('.tap-target').tapTarget('close');
    }
  })

    $('.button-collapse').sideNav({
      menuWidth: 300,
      edge: 'left', 
      closeOnClick: false, 
      draggable: true,
      onOpen: function(){},
      onClose: function(){
        $("#slide-out").css("transform", "translateX(-100%)");
        $("div").remove("#sidenav-overlay");
        $('.button-collapse').sideNav('hide');
        $("#slide-out").css("transform", "translateX(-100%)");
        console.log("kek");
      }

    });
        $('.collapsible').collapsible();

     $(".side-nav").resizable({
        handles: 'e',
        maxWidth: 1200,
        minWidth: 300
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
        var MapPathsGroup = svgRoot.getElementById("mapPaths");
        var PathsArray = MapPathsGroup.getElementsByTagName('path');


            var ColorMapData = JSON.parse(localStorage.getItem('SavedMapColors')) || [];


        for(var i = 0; i < PathsArray.length; i++){
            PathsArray[i].style.fill = getSettingFromStorage("mapColor");
            PathsArray[i].style.stroke = getSettingFromStorage("mapStrokeColor");
        }

            // var RouteWidth;
            // var pathColor;
            // var circleColor = JSON.parse(localStorage.getItem("SavedMapColors")) || {};

            // if(circleColor.mapRouteColor){
            //     pathColor = circleColor.mapRouteColor;
            // }
            // else{
            //     pathColor = "#000000";
            // }

            // if(circleColor.routeBorderWidth){
            //     RouteWidth = circleColor.routeBorderWidth;
            // }else{
            // RouteWidth = 3;
            // }



        var PathDirection = JSON.parse(localStorage.getItem('path'));

        if (PathDirection) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            $(path).attr('d', PathDirection);
            $(path).attr('fill', 'transparent');
            $(path).attr('stroke', getSettingFromStorage("mapRouteColor"));
            $(path).attr('stroke-width', getSettingFromStorage("routeBorderWidth"));
            $(path).attr("stroke-linecap","round")
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
        // console.log(circlesArray);
        var CirclesArrayClone = [];
        // var pointsDataContentNew  = [];
        var contentOfPoints = JSON.parse(localStorage.getItem('PointsContent')) || [];




        for (var k = 0; k < circlesArray.length; k++) {
            CirclesArrayClone[k] = circlesArray[k];
        }


        var circlesCounter = 1;
        // console.log(circlesArray);
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
                fill: getSettingFromStorage("mapPointsColor"),
                stroke: getSettingFromStorage("mapPointsBorderColor"),
                "stroke-width": getSettingFromStorage("pointsBorderWidth"),
                id: el.id,
                "data-time": el.time
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

                // console.log(pointsArray);
            intersects.forEach(function(el) {

                s.circle(el.x, el.y, 1);
            });

            localStorage.setItem('points', JSON.stringify(pointsArray));
        });

            

            var intersectionCircles = svgDoc.getElementsByTagName("circle");
            for(var i=0;i<intersectionCircles.length;i++){
                intersectionCircles[i].style.fill = "transparent";
            }
            



        if (localStorage.getItem('PointsContent') != null) {
            var pointsDataContentArray = JSON.parse(localStorage.getItem('PointsContent'));
        } else {
            var pointsDataContentArray = [];
        }
        for (var i = 0; i < circlesArray.length; i++) {
            var paths = svgDoc.getElementById(circlesArray[i].id);

            var equalTimeAttr = circlesArray[i].time;
            // console.log(equalTimeAttr);
            for (var j = 0; j < pointsDataContentArray.length; j++) {
                var pointText  = pointsDataContentArray[j].data;
                // console.log();


                if (pointsDataContentArray[j].pointId == equalTimeAttr) {
                    // console.log("pointsId: " + pointsDataContentArray[j].pointId + ", eq = " + equalTimeAttr);
                    var checked = pointsDataContentArray[j].pointId;
                    // console.log(checked);

                    if(pointText.length != 0 ){
                        console.log(pointText);
                        var FilledContentPaths = svgDoc.getElementById(circlesArray[i].id);
                        $(FilledContentPaths).css("fill", "#990033");
                    }
                }

            }
            $(paths).addClass('button-collapse');
            $(paths).attr('data-activates', "slide-out");
            $(paths).attr('href', "#");
            paths.style.cursor = "pointer";
            $(paths).mouseenter(function() {
                $(this).css("transition", "0.5s");
                $(this).css("stroke-width", "6px");
                $(this).css("stroke", getSettingFromStorage("mapPointsBorderColor"));


            }).mouseout(function() {
                $(this).css("transition", "0.5s");
                $(this).css("stroke-width", "3px");
                $(this).css("stroke", getSettingFromStorage("mapPointsBorderColor"));
            });

                var DisplacementObj = {
                    zoom: 100,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                };

                console.log(pointsDataContentArray);
                
                var savedDisplacement = JSON.parse(localStorage.getItem("mapStyleProperties")) || {};

                savedDisplacement.top = parseInt(savedDisplacement.top);
                savedDisplacement.left = parseInt(savedDisplacement.left);
                console.log(savedDisplacement.top, savedDisplacement.left);


           paths.addEventListener("click", function() {
                $('.button-collapse').sideNav('show');
                $(".button-collapse").off('click').sideNav();

                // $("#slide-out").css("transform", "translateX(0%)");
                var Npoint = parseInt(this.id);
                var dataTime = $(this).attr('data-time');
                document.getElementById("pointIndex").innerHTML = Npoint;
                var currentPath = this;
                var pointDataTime = $(this).attr('data-time');




                var getPointData = JSON.parse(localStorage.getItem('PointsContent')) || [];


                        if(!getPointData[Npoint-1]){
                            var savedZoom = 100;
                            savedDisplacement.top =  0;
                            savedDisplacement.left =  0;
                            $('.mapbg').animate({
                                zoom: savedZoom + "%",
                                top: savedDisplacement.top + "%",

                                left: savedDisplacement.left + "%"
                                // right: (getPointData[j].left - getPointData[j].right)+ "%"
                            });
                        }else{
                                console.log(getPointData[Npoint-1]);
                                savedZoom = getPointData[Npoint-1].zoom;
                                savedDisplacement.top = getPointData[Npoint-1].top;
                                savedDisplacement.left = getPointData[Npoint-1].left;
                        }

                            DisplacementObj.zoom = savedZoom;
                            DisplacementObj.top = savedDisplacement.top;
                            DisplacementObj.left = savedDisplacement.left;


                            $("#plus").bind('click', function() {
                                savedZoom += 3;
                                DisplacementObj.zoom = savedZoom;
                                $(".mapbg").css("zoom", savedZoom + "%");
                                console.log(DisplacementObj);
                            });

                            $("#minus").bind('click', function() {
                                savedZoom -= 3;

                                if (savedZoom <= 100) {
                                    savedZoom = 100;
                                }
                                DisplacementObj.zoom = savedZoom;
                                $(".mapbg").css("zoom", savedZoom + "%");
                            });


                            $("#moveLeft").bind("click", function() {

                                savedDisplacement.left += 2;
                                DisplacementObj.left = savedDisplacement.left;
                                $(".mapbg").css("left", "" + savedDisplacement.left + "%");
                            });
                            $("#moveRight").bind("click", function() {
                                savedDisplacement.left -= 2;
                                DisplacementObj.left = savedDisplacement.left;
                                $(".mapbg").css("left", "" + savedDisplacement.left + "%");
                            });
                            $("#moveTop").bind("click", function() {
                                savedDisplacement.top += 2;
                                DisplacementObj.top = savedDisplacement.top;
                                $(".mapbg").css("top", "" + savedDisplacement.top + "%");
                            });
                            $("#moveBottom").bind("click", function() {
                                savedDisplacement.top -= 2;
                                DisplacementObj.top = savedDisplacement.top;
                                $(".mapbg").css("top", "" + savedDisplacement.top + "%");
                            });
                
                
                    



                if (localStorage.getItem('PointsContent') != null) {
                    
                    var PointLastData;



                    for (var j = 0; j < getPointData.length; j++) {

                        var count = getPointData[j].pointId == dataTime;
                        if (getPointData[j].pointId == dataTime) {
                            console.log(getPointData[j].zoom);

                            $("#pointZoom").val(getPointData[j].zoom);
                           $("#pointTop").val(getPointData[j].top);
                            $("#pointBottom").val(getPointData[j].bottom);
                            $("#pointLeft").val(getPointData[j].left);
                            $("#pointRight").val(getPointData[j].right);

                            $('.mapbg').animate({
                                zoom: getPointData[j].zoom + "%",
                                top: getPointData[j].top + "%",

                                left: getPointData[j].left + "%"
                                // right: (getPointData[j].left - getPointData[j].right)+ "%"
                            });
                            console.log(getPointData[j]);
                        } 
                        // else {
                        //     console.log("KEK PRIKIN");
                        //     document.getElementById("pointZoom").value = "100";
                        //     document.getElementById("pointTop").value = "0";
                        //     document.getElementById("pointBottom").value = "0";
                        //     document.getElementById("pointLeft").value = "0";
                        //     document.getElementById("pointRight").value = "0";
                        // }

                        if (count) {

                            PointLastData = getPointData[j].data;

                        }
                    }

                    editor.setData(PointLastData);

                }

                // openNav(Npoint);
                // $('.button-collapse').sideNav({
                //     onOpen: function(Npoint){
                //         document.getElementById("pointIndex").innerHTML = Npoint;
                //     }
                // });

                document.getElementById("SavePointContent").onclick = function() {

                    var pointsDataContent = {
                        pointId: 0,
                        zoom: DisplacementObj.zoom,
                        top: DisplacementObj.top,
                        // bottom:  DisplacementObj.bottom,
                        left: DisplacementObj.left,
                        // right: DisplacementObj.right,
                        data: ""
                    };
                    var InputZoomValue = parseInt(document.getElementById("pointZoom").value);
                    var InputTopValue = parseInt(document.getElementById("pointTop").value);
                    var InputBottomValue = parseInt(document.getElementById("pointBottom").value);
                    var InputLeftValue = parseInt(document.getElementById("pointLeft").value);
                    var InputRightValue = parseInt(document.getElementById('pointRight').value);


                    pointsDataContent.pointId = pointDataTime;

                    // pointsDataContent.zoom = DisplacementObj.zoom;
                    // pointsDataContent.top = DisplacementObj.top;
                    // pointsDataContent.bottom = DisplacementObj.bottom;
                    // pointsDataContent.left = DisplacementObj.left;
                    // pointsDataContent.right = DisplacementObj.right;




                    pointsDataContent.data = editor.getData();

                    for (var j = 0; j < pointsDataContentArray.length; j++) {

                        if (pointsDataContentArray[j].pointId == pointDataTime) {
                            pointsDataContentArray.splice(j, 1);

                        }
                    }
                    if (pointsDataContent.data.length == 0) {
                        Materialize.toast('No data in point!', 2000);
                    } else {
                        console.log(pointsDataContent);
                        pointsDataContentArray.push(pointsDataContent);
                        Materialize.toast('Your data is saved!', 2000);
                    }
                    localStorage.setItem('PointsContent', JSON.stringify(pointsDataContentArray));
                    // console.log(pointsDataContentArray);
                    // $("#userNotification").fadeIn(200);
                    var overlay = $('#sidenav-overlay');
                    $(overlay).css("background-color", "none");
                    $(overlay).remove();




                    if (pointsDataContent.data.length > 0) {
                        $(currentPath).css("fill", "#990033");
                    } else if (pointsDataContent.data.length == 0) {
                        $(currentPath).css("fill", getSettingFromStorage("mapPointsColor"));
                    }

                    $('.button-collapse').sideNav('hide');

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
        // console.log(stopsAtLength);
        localStorage.setItem("stopsAtLength", JSON.stringify(stopsAtLength));

        if (pointsArray.length !== stopsAtLength.length) {
            console.log("HERE IS THE DIFFERENCE: 1st array length = " + pointsArray.length + ', 2nd arr length= ' + stopsAtLength.length + "");
        } else {
            console.log('no DIFFERENCE between arr lengths');
        }





    }, false);


    var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties'));
  
   
        $(".mapbg").css("background-color", getSettingFromStorage("bodyBackgroundColor"));
        $("body").css("background-color", getSettingFromStorage("bodyBackgroundColor"));
    

    $.each(WrapperProps, function(prop, value) {
        $(".mapbg").css(prop, value);
    });

});