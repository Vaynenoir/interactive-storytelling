$(document).ready(function() {
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
        pointsBorderWidth: "1",
        contentWidth: "100",
        contentAlign: "center"
    };





        if(SettingsObject[setting]){
            return SettingsObject[setting];
        }
    }

    var dataContent = JSON.parse(localStorage.getItem('PointsContent')) || [];
    var circleColor = JSON.parse(localStorage.getItem("SavedMapColors")) || {};
    // console.log(dataContent);

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

    if(dataContent){
    dataContent.sort(compareId);
    }
    var text_cont = document.getElementById("boom");

    for (var i = 0; i < dataContent.length; i++) {
        var section = document.createElement('section');
        $(section).addClass('js-section');

       
        $(section).attr({
            "data-zoom": dataContent[i].zoom + "%",
            "data-pos-top": dataContent[i].top + "%",
            "data-pos-bottom": dataContent[i].bottom + "%",
            "data-pos-left": dataContent[i].left + "%",
            "data-pos-right": dataContent[i].bottom + "%",
            "id": "section_" + (i+1)
        });
        

        section.insertAdjacentHTML('beforeend', dataContent[i].data);
        $(section).find('img').addClass('js-image');
        $(section).find('.js-image').attr('data-pos-x', 0);
        $(section).find('.js-image').attr('data-pos-y', 0);


        text_cont.append(section);
        $("div.text_wrapper").css("align-items", getSettingFromStorage("contentAlign") );
         $('.js-section').css("width", getSettingFromStorage("contentWidth") + "%");
    }



    // $('#textWrap p').addClass('kek');
    $('.mapbg').css("zoom", "0%");
    $('.mapbg').css("right", "0");
    $('mapbg').css("bottom", "0");
    var a = document.getElementById('map');

    var map_url = JSON.parse(localStorage.getItem('map'));
    var map_url_true = "../" + map_url;
    console.log(map_url_true);

    $('#map').attr('data', map_url_true);
    a.addEventListener("load", function() {

        console.log($("#map").attr('data'));
        var svgDoc = a.contentDocument;
        var svgRoot = svgDoc.documentElement;

        var MapPathsGroup = svgRoot.getElementById("mapPaths");
        var PathsArray = MapPathsGroup.getElementsByTagName('path');





        for(var i = 0; i < PathsArray.length; i++){
            PathsArray[i].style.fill = getSettingFromStorage("mapColor");
            PathsArray[i].style.stroke = getSettingFromStorage("mapStrokeColor");
        }


        var PathDirection = JSON.parse(localStorage.getItem('path'));




        // console.log(svgRoot);
        $(svgRoot).addClass("my-svg");

        if (PathDirection) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            $(path).attr('d', PathDirection);
            $(path).attr('fill', 'transparent');
            $(path).attr('stroke', getSettingFromStorage("mapRouteColor"));
            $(path).attr("opacity", '0.8');
            $(path).attr('stroke-width', getSettingFromStorage("routeBorderWidth"));
            $(path).attr("stroke-linecap","round")
            $(path).attr("id", "routePath");

        }




        var currentDisplacementTop = parseInt($("#IDmapbg")[0].style.top);
        var currentDisplacementLeft = parseInt($('#IDmapbg')[0].style.left);
        var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        $(path1).css('display', 'none');


        function sectionCounter() {
            $('.js-section').each(function(i) {

                var scrollCount = $(window).scrollTop();
                var topOffset = $(this).offset().top;
                var dataZoom = $(this).attr("data-zoom");
                var dataPosTop = parseInt($(this).attr("data-pos-top")) + currentDisplacementTop + "%";
                var dataPosBottom = $(this).attr('data-pos-bottom');
                var dataPosLeft = parseInt($(this).attr("data-pos-left")) + currentDisplacementLeft + "%";
                var dataPosRight = $(this).attr("data-pos-right");



                if (topOffset <= scrollCount && inWindow($(this))) {

                    $(this).addClass("active");

                    $('.mapbg').stop().animate({
                        zoom: dataZoom,
                        left: dataPosLeft,
                        right: dataPosRight,
                        top: dataPosTop,
                        bottom: dataPosBottom
                    }, 700);

                    var pathName = svgDoc.getElementById(i+1);
                    
                    var pathNameText = $(pathName).parent().find("text");
                    // console.log(pathNameText);
                    $(pathNameText).fadeIn(900);

                } else {
                    $(this).removeClass("active");
                    if (!$('.js-section').hasClass("active") && $(window).scrollTop() < 20) {
                        $('.mapbg').stop().animate({
                            left: currentDisplacementLeft + "%",
                            top: currentDisplacementTop + "%",
                            zoom: "100%"
                        }, 400);

                        var pathName = svgDoc.getElementById(i+1);
                        
                        var pathNameText = $(pathName).parent().find("text");
                        console.log(pathNameText);

                        $(pathNameText).fadeOut(900);   
                    }

                }

            });

            var arrImgID = [];
            $('.js-image').each(function(el) {

                arrImgID.push($(this));
            });


            var CirclePathCoords = JSON.parse(localStorage.getItem('circlesCoords'));

            $(arrImgID).each(function(i, el) {

                var imgParentID = $(this).closest('section')[0].id;

                imgParentID = parseInt(imgParentID[8]) - 1;
                if (imgParentID == CirclePathCoords[i].id-1) {
                    $(this).attr({
                        'data-pos-x': CirclePathCoords[imgParentID].cx,
                        'data-pos-y': CirclePathCoords[imgParentID].cy
                    });
                }
            });


            var vis_count = 0;

            $(arrImgID).each(function() {
                if (inWindow($(this))) {
                    vis_count++;
                    //          console.log($(this));
                    // console.log($(this));
                    var cx = $(this).attr('data-pos-x');
                    var cy = $(this).attr('data-pos-y');

                    var Coordinates = $(this)[0].getBoundingClientRect();
                    var bottomOffsetImg = Coordinates.top + $(this).height();
                    $(path1).attr('d', "M" + cx + " " + cy + " L" + (-Coordinates.left-100) + " " + (Coordinates.top - 110) + " L" + (-Coordinates.left-100) + " " + (Coordinates.bottom - 160));
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
                fill: getSettingFromStorage("mapPointsColor"),
                stroke: getSettingFromStorage("mapPointsBorderColor"),
                "stroke-width": getSettingFromStorage("pointsBorderWidth"),
                id: index+1,
                class: "circleElement",
                style: "display:none"

            });


                 

            var intersects = Snap.path.intersection(circle, $(path).attr('d'));

            intersects.forEach(function(el) {

                s.circle(el.x, el.y, 1);

            });

        

        });

        var ParentCicleGroup = svgRoot.getElementById("pathGroup");
        console.log(ParentCicleGroup);
        for(var i=0; i < circlesArray.length; i++){
            var circleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            var currentPoint = svgRoot.getElementById(i+1);
            circleGroup.append(currentPoint);
            
            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            $(text).attr({
                x: circlesArray[i].cx,
                y: circlesArray[i].cy + 20,
                "font-size": 12,
                "font-style": "italic",
                fill: "#ccccccc",
                "style": "display: none"
            });
            $(text).text(dataContent[i].cityName);
            console.log(text);
            circleGroup.append(text);
           
            ParentCicleGroup.append(circleGroup);
            
            console.log(currentPoint);
            

            
            
            
            svgRoot.append(circleGroup);  
        }


        var intersectionCircles = svgDoc.getElementsByTagName("circle");
        for(var i=0;i<intersectionCircles.length;i++){
            intersectionCircles[i].style.fill = "transparent";
        }            


            var pathStartIcon = JSON.parse(localStorage.getItem("StartRouteIcon")) || [];
            // console.log(pathStartIcon);
            var oParser = new DOMParser();
            var oDOM = oParser.parseFromString(pathStartIcon, "text/xml");
            // console.log(oDOM.documentElement);

            var parsedPathStartIcon = oDOM.documentElement;
            var iconOffsetX = $(parsedPathStartIcon).attr("data-offset-x");
            var iconOffsetY = $(parsedPathStartIcon).attr("data-offset-y");
            var iconScale = $(parsedPathStartIcon).attr("data-scale");

         var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        if(getSettingFromStorage("UserOption") == "true" && getSettingFromStorage("StartIcon").length > 0){
            for(var i=0;i<pathStartIcon.length;i++){
                
            
                $(parsedPathStartIcon).attr({
                    fill: getSettingFromStorage("RouteStartIconColor"),
                    transform: iconScale
                });
                // console.log(parsedPathStartIcon);
            // $(newPath).attr("cy", path.getPointAtLength(1).y);
            
            }
        }

        $(group).attr("transform", "translate("+(path.getPointAtLength(1).x - (getSettingFromStorage("RouteStartIconSize")/iconOffsetX)) + " " + (path.getPointAtLength(1).y - (getSettingFromStorage("RouteStartIconSize")/iconOffsetY) )+") " + "scale("+getSettingFromStorage("RouteStartIconSize")/100+")");
        group.append(parsedPathStartIcon);
        svgRoot.append(group);










        if(getSettingFromStorage("checkboxState") == "true" && getSettingFromStorage("defaultOption") == "true"){
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
                
        // svgDoc.getElementsByTagName('circle').style.opacity = "0";

        text_cont.style.display = "block";

        var length = path.getTotalLength();
        // console.log(length);
        var offsetDash = $(path).css({
            "stroke-dashoffset": length,
            "stroke-dasharray": length + " " + length
        });

        var StopPoints = JSON.parse(localStorage.getItem('stopsAtLength'));


        function drawPath() {
            var circleElements = svgDoc.querySelectorAll('.circleElement');
            // console.log(circleElements);
            for (var i = 0; i < StopPoints.length; i++) {

                $.each($('.js-section'), function(i, el) {

                    // console.log($(path));
                    if ($(this).hasClass('active')) {

                        var $percentageComplete = (($(window).scrollTop() - $(this).offset().top) / $(this).height()) * 100;
                        var currentSectionID = $(this).attr("id");
                        currentSectionID = parseInt(currentSectionID[8]) - 1;
                        var $offsetUnit = $percentageComplete * (StopPoints[currentSectionID] / 100);
                        var CurrentPathCurrentLength;
                        CurrentPathCurrentLength = Math.floor($offsetUnit);

                        // console.log(CurrentPathCurrentLength);
                        

                        var currentCircle = svgDoc.getElementById(currentSectionID+1);
                        
                        

                        var curDashOffset = parseFloat($(path).css("stroke-dashoffset"));
                        for(var j = 0; j < circleElements.length; j++){
                            
                            var currentCircleName = $(currentCircle).parent().find("text");
                            // console.log(currentCircleName);
                            // console.log("curDashOffset: ", curDashOffset);
                            // console.log("length: ", length);

                            if(curDashOffset >= length - 20){
                                $(circleElements[j]).fadeOut(900);
                                 // $(currentCircleName).fadeOut(900);
                            }
                            else {
                                 if(circleElements[j].id <= currentSectionID+1){
                                    $(circleElements[j]).fadeIn(900);
                                    $(currentCircleName).fadeIn(900);
                                }
                                else if(circleElements[j].id > currentSectionID+1 ){
                                    $(circleElements[j]).fadeOut(900);
                                     // $(currentCircleName).fadeOut(900);
                                }
                            }
                        }
                        // $(currentCircle).fadeIn(1000);
                        // console.log(currentSectionID);
                        // fadeIn(currentCircle);

                        if (CurrentPathCurrentLength < StopPoints[currentSectionID]) {


                            if (currentSectionID == 0 && CurrentPathCurrentLength < StopPoints[currentSectionID]) { // path drawing to first point
                                $(path).css("stroke-dashoffset", "" + (length - CurrentPathCurrentLength) + "px");
                                // svgDoc.getElementById(currentSectionID).attr('opacity', '1');
                                // currentCircle.fadeIn(200);
                                // console.log("first if");
                                
                            }


                            if (currentSectionID > 0 && CurrentPathCurrentLength < StopPoints[currentSectionID]) { // path drawing to next point

                                $(path).css("stroke-dashoffset", "" + (length - (StopPoints[currentSectionID - 1] + CurrentPathCurrentLength)) + "");
                                // console.log("second if");
                                
                            }

                        }

                        if (StopPoints[currentSectionID - 1] + CurrentPathCurrentLength > StopPoints[currentSectionID]) { //Stop path drawing while section inWindow

                            $(path).css("stroke-dashoffset", "" + (length - StopPoints[currentSectionID]) + "px");
                            // console.log("third if");

                        }

                    }

                });
            }
        }




        function scrolled(e) {
            drawPath();
            sectionCounter();
        }


        $(window).on("scroll", scrolled);

    }, false);

    var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties'));
    console.log(WrapperProps);
    var SavedMapColors = JSON.parse(localStorage.getItem("SavedMapColors")) || {};
    
    if(SavedMapColors.bodyBackgroundColor){
        $("#IDmapbg").css("background-color", SavedMapColors.bodyBackgroundColor );
    }



    $.each(WrapperProps, function(prop, value) {
        $("#IDmapbg").css(prop, value);
    });

});