$(document).ready(function() {

    function getSettingFromStorage(setting) {
        var SettingsObject = JSON.parse(localStorage.getItem("Settings")) || {
            mapColor: "rgba(255, 204, 128, 1)",
            mapStrokeColor: "rgba(0, 0, 0, 1)",
            mapPointsColor: "rgba(0, 0, 255, 1)",
            mapPointsBorderColor: "rgba(0, 0, 0, 1)",
            mapRouteColor: "rgba(0, 0, 0, 1)",
            bodyBackgroundColor: "rgba(243, 229, 245, 1)",
            routeBorderWidth: "4",
            pointsRadius: "8",
            pointsBorderWidth: "1",
            contentWidth: "50",
            contentAlign: "flex-start",
            checkboxState: "false",
            defaultOption: "false",
            UserOption: "false",
            StartIcon: "",
            RouteStartIconColor: "rgba(0, 0, 0, 1)",
            RouteStartIconSize: "8"
        };
        if (SettingsObject[setting]) {
            return SettingsObject[setting];
        }
    }
    var kek = JSON.parse(localStorage.getItem("Settings"))
    // console.log(kek);
    function getSvgPointPosition(string) {
        string = string.slice(1);
        string = string.split("c");
        var substring = string.splice(1);
        substring = substring.join("c");
        return substring;
    }


    $('.modal').modal();
    $('ul.tabs').tabs('select_tab', 'tab_2');
    $("#menu").on("click", function() {
        if (!$(this).hasClass('.active')) {
            $(this).addClass("active");
            $('.tap-target').tapTarget('open');
        } else {
            $(this).removeClass("active");
            $('.tap-target').tapTarget('close');
        }
    })

    $('.button-collapse').sideNav({
        menuWidth: 300,
        edge: 'left',
        closeOnClick: false,
        draggable: true,
        onOpen: function() {},
        onClose: function() {
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

    function compareTime(objA, objB) {
        return objA.pointId - objB.pointId;
    }



    var a = document.getElementById('map');
    var map_url = JSON.parse(localStorage.getItem('map'));
    $('#map').attr('data', map_url);
    a.addEventListener("load", function() {
        var svgDoc = a.contentDocument;
        var svgRoot = svgDoc.documentElement;
        var MapPathsGroup = svgRoot.getElementById("mapPaths");
        var PathsArray = MapPathsGroup.getElementsByTagName('path');
        var wholeSvgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        $(wholeSvgGroup).attr("id", "wholeSvgGroup");



        for (var i = 0; i < PathsArray.length; i++) {
            PathsArray[i].style.fill = getSettingFromStorage("mapColor");
            PathsArray[i].style.stroke = getSettingFromStorage("mapStrokeColor");
        }


        var PathDirection = JSON.parse(localStorage.getItem('path'));

        if (PathDirection) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            $(path).attr('d', PathDirection);
            $(path).attr('fill', 'transparent');
            $(path).attr('stroke', getSettingFromStorage("mapRouteColor"));
            $(path).attr('stroke-width', getSettingFromStorage("routeBorderWidth"));
            $(path).attr("stroke-linecap", "round")
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
        MapPathsGroup.append(pathGroup);
        wholeSvgGroup.append(MapPathsGroup);
        svgRoot.append(wholeSvgGroup);
        var s = Snap(pathGroup);

        var circlesArray = JSON.parse(localStorage.getItem('circlesCoords'));
        var pathLength = path.getTotalLength();


        var startRouteFlag = JSON.parse(localStorage.getItem("StartRouteIcon"));



        var pathStartIcon = JSON.parse(localStorage.getItem("StartRouteIcon"));
        // console.log(pathStartIcon);
        var oParser = new DOMParser();
        var oDOM = oParser.parseFromString(pathStartIcon, "text/xml");
        // console.log(oDOM.documentElement);

        var parsedPathStartIcon = oDOM.documentElement;
        var iconOffsetX = $(parsedPathStartIcon).attr("data-offset-x");
        var iconOffsetY = $(parsedPathStartIcon).attr("data-offset-y");
        var iconScale = $(parsedPathStartIcon).attr("data-scale");

        var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        if (getSettingFromStorage("UserOption") == "true" && pathStartIcon) {

            $(parsedPathStartIcon).attr({
                fill: getSettingFromStorage("RouteStartIconColor"),
                transform: iconScale
            });
            // console.log(parsedPathStartIcon);



            $(group).attr("transform", "translate(" + (path.getPointAtLength(1).x - (getSettingFromStorage("RouteStartIconSize") / iconOffsetX)) + " " + (path.getPointAtLength(1).y - (getSettingFromStorage("RouteStartIconSize") / iconOffsetY)) + ") " + "scale(" + getSettingFromStorage("RouteStartIconSize") / 100 + ")");
            group.append(parsedPathStartIcon);

            pathGroup.append(group);
            wholeSvgGroup.append(pathGroup);
        }




        var CirclesArrayClone = [];
        var contentOfPoints = JSON.parse(localStorage.getItem('PointsContent')) || [];


        for (var k = 0; k < circlesArray.length; k++) {
            CirclesArrayClone[k] = circlesArray[k];
        }


        var circlesCounter = 1;

        for (var i = 0; i < pathLength; i++) {
            var pathLengthAtPoint = path.getPointAtLength(i);
            var pointX = pathLengthAtPoint.x;
            var pointY = pathLengthAtPoint.y;


            for (var j = 0; j < CirclesArrayClone.length; j++) {

                if (Math.abs(Math.round(pointX - CirclesArrayClone[j].cx)) <= 8 && Math.abs(Math.round(pointY - CirclesArrayClone[j].cy)) <= 8) {

                    for (var l = 0; l < circlesArray.length; l++) {

                        if (Math.abs(Math.round(circlesArray[l].cx - CirclesArrayClone[j].cx)) <= 4 && Math.abs(Math.round(circlesArray[l].cy - CirclesArrayClone[j].cy)) <= 4) {


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

            if (intersects.length == 0) {
                alert("Please, return to the previous step and draw points right on the route line");
                document.location.replace("http://127.0.0.1:8080/");
            } else {
                pointsObj.cx = intersects[0].x;
                pointsObj.cy = intersects[0].y;
            }


            pointsArray.push(pointsObj);

            intersects.forEach(function(el) {

                s.circle(el.x, el.y, 1);
            });

            localStorage.setItem('points', JSON.stringify(pointsArray));
        });



        var intersectionCircles = svgDoc.getElementsByTagName("circle");
        for (var i = 0; i < intersectionCircles.length; i++) {
            intersectionCircles[i].style.fill = "transparent";
        }

        if (getSettingFromStorage("checkboxState") == "true" && getSettingFromStorage("defaultOption") == "true") {
            var startCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            $(startCircle).attr({
                cx: path.getPointAtLength(1).x,
                cy: path.getPointAtLength(1).y,
                r: getSettingFromStorage("pointsRadius"),
                stroke: getSettingFromStorage("mapPointsBorderColor"),
                fill: getSettingFromStorage("mapPointsColor"),
                "stroke-width": getSettingFromStorage("pointsBorderWidth")
            });
            // console.log($(startCircle));
            svgRoot.append(startCircle);
        }



        if (localStorage.getItem('PointsContent') != null) {
            var pointsDataContentArray = JSON.parse(localStorage.getItem('PointsContent'));
        } else {
            var pointsDataContentArray = [];
        }
        for (var i = 0; i < circlesArray.length; i++) {
            var paths = svgDoc.getElementById(circlesArray[i].id);
            var circleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');


            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            $(text).attr({
                x: circlesArray[i].cx,
                y: circlesArray[i].cy + 20,
                "font-size": 12,
                "font-style": "italic",
                fill: "#ccccccc",
                class: "cityName"
            });

            circleGroup.append(paths);
            circleGroup.append(text);
            wholeSvgGroup.append(circleGroup);
            svgRoot.append(wholeSvgGroup);


            var equalTimeAttr = circlesArray[i].time;

            for (var j = 0; j < pointsDataContentArray.length; j++) {
                var pointText = pointsDataContentArray[j].data;
                // console.log();


                if (pointsDataContentArray[j].pointId == equalTimeAttr) {

                    var checked = pointsDataContentArray[j].pointId;


                    if (pointText.length != 0) {

                        var FilledContentPaths = svgDoc.getElementById(circlesArray[i].id);
                        var ClosestTextField = $(FilledContentPaths).parent().find("text");
                        // console.log(ClosestTextField);
                        if (pointsDataContentArray[j].cityName) {
                            // console.log(pointsDataContentArray[j].cityName);
                            $(ClosestTextField).text(pointsDataContentArray[j].cityName);
                        }

                        // console.log(circlesArray[i].id);
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

            var FullMapGroup = Snap(wholeSvgGroup);


            // console.log(pointsDataContentArray);
            var savedDisplacement = JSON.parse(localStorage.getItem("mapStyleProperties")) || {};

            var zoom, moveLeft, moveTop;

            if((savedDisplacement.transform).length > 0){
                // scaleImg = styleProps.transform;

                var transformString = (savedDisplacement.transform);
                // console.log(scaleImg);
                var regex = /[+-]?\d+(\.\d+)?/g;
                var StringValues = transformString.match(regex).map(function(v) {
                    return parseFloat(v); 
                });
                console.log(StringValues);

                scaleImg = StringValues[0];
                moveLeft = StringValues[1],
                moveTop = StringValues[2];
                console.log( scaleImg, moveLeft, moveTop);

                FullMapGroup.attr("transform", "scale(" + scaleImg + ") translate("+ moveLeft +" " + moveTop+ ")");
            }



            savedDisplacement.top = parseInt(savedDisplacement.top);
            savedDisplacement.left = parseInt(savedDisplacement.left);
            // console.log(savedDisplacement.top, savedDisplacement.left);


            paths.addEventListener("click", function() {
                $('.button-collapse').sideNav('show');
                $(".button-collapse").off('click').sideNav();

                var Npoint = parseInt(this.id);
                var dataTime = $(this).attr('data-time');
                document.getElementById("pointIndex").innerHTML = Npoint;
                var currentPath = this;
                var pointDataTime = $(this).attr('data-time');




                var getPointData = JSON.parse(localStorage.getItem('PointsContent')) || [];
                var pointsDefaultDisplacement = JSON.parse(localStorage.getItem("mapStyleProperties")) || {
                    transform: ""
                };

                console.log(FullMapGroup);
                if ((pointsDefaultDisplacement.transform).length > 0) {
                    // scaleImg = styleProps.transform;

                    transformString = (pointsDefaultDisplacement.transform);
                    // console.log(scaleImg);
                    var regex = /[+-]?\d+(\.\d+)?/g;
                    var StringValues = transformString.match(regex).map(function(v) {
                        return parseFloat(v);
                    });
                    console.log(StringValues);

                    zoom = StringValues[0];
                    moveLeft = StringValues[1],
                        moveTop = StringValues[2];

                }



                if (!getPointData[Npoint - 1]) {
                        var zoom = 1;
                        var moveTop = 0;
                        var moveLeft = 0;
                    // var savedZoom = zoom;
                    // savedDisplacement.top = moveTop;
                    // savedDisplacement.left = moveLeft;

                    // console.log(savedDisplacement.top + "%");
                    $("#pointName").html("");
                    // $('.mapbg').animate({
                    //     zoom: savedZoom + "%",
                    //     top: savedDisplacement.top + "%",
                    //     left: savedDisplacement.left + "%"
                    // });
                    FullMapGroup.animate({
                        transform: "scale(" + zoom + ") translate(" + (moveTop) + " " + (moveLeft) + ")"
                    }, 200);
                } else {

                    zoom = getPointData[Npoint - 1].zoom;
                    moveTop = getPointData[Npoint - 1].top;
                    moveLeft = getPointData[Npoint - 1].left;

                }

                // DisplacementObj.zoom = savedZoom;
                // DisplacementObj.top = savedDisplacement.top;
                // DisplacementObj.left = savedDisplacement.left;


                $("#plus").bind('click', function() {
                    zoom += 0.1;
                    DisplacementObj.zoom = zoom;
                    console.log(MapPathsGroup);
                    FullMapGroup.animate({ "transform": "scale(" + zoom +") translate(" + (moveLeft) + " " + moveTop + ")" }, 300);
                });

                $("#minus").bind('click', function() {
                    zoom -= 0.1;

                    if (zoom <= 1.0) {
                        zoom = 1.0;
                    }
                    DisplacementObj.zoom = zoom;
                    FullMapGroup.animate({ transform: "scale(" + zoom + ") translate(" + (moveLeft) + " " + moveTop + ")" }, 300);
                });


                $("#moveLeft").bind("click", function() {

                    moveLeft += 20;
                    DisplacementObj.left = moveLeft;
                    FullMapGroup.animate({ transform: "scale(" + zoom + ") translate(" + (moveLeft) + " " + moveTop + ")" }, 300);
                });
                $("#moveRight").bind("click", function() {
                    moveLeft -= 20;
                    DisplacementObj.left = moveLeft;
                    FullMapGroup.animate({ transform: "scale(" + zoom + ") translate(" + (moveLeft) + " " + moveTop + ")" }, 300);
                });
                $("#moveTop").bind("click", function() {
                    moveTop += 20;
                    DisplacementObj.top = moveTop;
                    FullMapGroup.animate({ transform: "scale(" + zoom + ") translate(" + (moveLeft) + " " + moveTop + ")" }, 300);
                });
                $("#moveBottom").bind("click", function() {
                    moveTop -= 20;
                    DisplacementObj.top = moveTop;
                    FullMapGroup.animate({ transform: "scale(" + zoom + ") translate(" + (moveLeft) + " " + moveTop + ")" }, 300);
                });




                if (localStorage.getItem('PointsContent') != null) {

                    var PointLastData;

                    for (var j = 0; j < getPointData.length; j++) {

                        var count = getPointData[j].pointId == dataTime;
                        if (getPointData[j].pointId == dataTime) {

                            FullMapGroup.animate({ 
                                transform: "scale(" + parseFloat(getPointData[j].zoom) + ") translate(" + (getPointData[j].left) + " " + getPointData[j].top + ")" 
                            }, 300);

                            // $('.mapbg').animate({
                            //     zoom: getPointData[j].transform,
                            // });

                            var PointCityName = getPointData[j].cityName;
                        }

                        if (count) {

                            PointLastData = getPointData[j].data;

                        }
                    }
                    $("#pointName").val(PointCityName);
                    editor.setData(PointLastData);

                }



                document.getElementById("SavePointContent").onclick = function() {

                    var pointsDataContent = {
                        pointId: 0,
                        cityName: "",
                        zoom: zoom,
                        left: moveLeft,
                        top: moveTop,
                        data: ""
                    };
                    // var InputZoomValue = parseInt(document.getElementById("pointZoom").value);
                    // var InputTopValue = parseInt(document.getElementById("pointTop").value);
                    // var InputBottomValue = parseInt(document.getElementById("pointBottom").value);
                    // var InputLeftValue = parseInt(document.getElementById("pointLeft").value);
                    // var InputRightValue = parseInt(document.getElementById('pointRight').value);

                    var PointName = $("#pointName").val();

                    pointsDataContent.pointId = pointDataTime;

                    pointsDataContent.cityName = PointName;



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
                        var textField = $(currentPath).parent().find("text");


                        $(textField).text(PointName);
                        //  console.log($(textField));
                        Materialize.toast('Your data is saved!', 2000);
                    }
                    pointsDataContentArray.sort(compareTime)
                    localStorage.setItem('PointsContent', JSON.stringify(pointsDataContentArray));
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
        if (stopsAtLength.length != pointsArray.length) {
            for (var i = 0; i < stopsAtLength.length; i++) {
                if (stopsAtLength[i + 1] - stopsAtLength[i] == 1) stopsAtLength.splice(i, 1);
            }
        }

        localStorage.setItem("stopsAtLength", JSON.stringify(stopsAtLength));

        if (pointsArray.length !== stopsAtLength.length) {
            console.log("HERE IS THE DIFFERENCE: 1st array length = " + pointsArray.length + ', 2nd arr length= ' + stopsAtLength.length + "");
        } else {
            console.log('no DIFFERENCE between arr lengths');
        }




    }, false);


    var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties'));


    // $(".mapbg").css("background-color", getSettingFromStorage("bodyBackgroundColor"));
    $("body").css("background-color", getSettingFromStorage("bodyBackgroundColor"));


    // $.each(WrapperProps, function(prop, value) {
    //     $(".mapbg").css(prop, value);
    // });

});