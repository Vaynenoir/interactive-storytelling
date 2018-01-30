$(document).ready(function() {
    // get editor settings
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
            contentAlign: "flex-start"
        };

        if (SettingsObject[setting]) {
            return SettingsObject[setting];
        }

    }

    var dataContent = JSON.parse(localStorage.getItem('PointsContent')) || [];
    var circleColor = JSON.parse(localStorage.getItem("SavedMapColors")) || {};

    function inWindow(s) { // check if element is visible in browser window
        if (!$(s).length) return false; // element not found

        var img_top_offset = $(s).offset().top;
        var img_bottom = $(s).offset().top + $(s).outerHeight();
        var bottomOfScreen = $(window).scrollTop() + $(window).height();
        var topOfScreen = $(window).scrollTop();

        return (bottomOfScreen > img_top_offset) && (topOfScreen < img_bottom);
    }

    function compareId(objA, objB) { //sort points id by ascending
        return objA.pointId - objB.pointId;
    }

    // if(dataContent){
    // // dataContent.sort(compareId);
    // }

    var text_cont = document.getElementById("boom");

    for (var i = 0; i < dataContent.length; i++) {
        var section = document.createElement('section'); // creation of page sections with it's content, tied to every point
        $(section).addClass('js-section');


        $(section).attr({
            "data-zoom": dataContent[i].zoom,
            "data-pos-top": dataContent[i].top,
            "data-pos-left": dataContent[i].left,
            "id": "section_" + (i + 1)
        });


        section.insertAdjacentHTML('beforeend', dataContent[i].data);
        $(section).find('img').addClass('js-image');
        $(section).find('.js-image').attr('data-pos-x', 0);
        $(section).find('.js-image').attr('data-pos-y', 0);




        text_cont.append(section);
        $("div.text_wrapper").css("align-items", getSettingFromStorage("contentAlign"));
        $('.js-section').css("width", getSettingFromStorage("contentWidth") + "%");
    }

    function hasSliderClass(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    }

    var sliderImg = $('.js-image');

    $.fn.hasAttr = function(name) {
        return this.attr(name) !== undefined;
    };
    var sections = $('.js-section');

    $.each(sections, function(i, el) {

        var slider = $(el).find('.slick-gallery');
        if ($(slider).find("img.slick-item").length == 0) {
            console.log($(slider));
            $(slider).remove();

        }
        var singleImage = $(el).find(".single_image");
        if (!$(singleImage).hasClass(".slick-current")) {
            $(singleImage).addClass("slick-current");
        }
        $(slider).find('br').remove();
        $('br').remove();
        $(slider).text().replace(/&nbsp;/g, '');
    });

    $('.slick_gallery').slick({
        "slidesToShow": 1,
        "slidesToScroll": 1,
        // autoplay: true,
        // autoplaySpeed: 2000,
        prevArrow: true,
        nextArrow: true,
        // fade: true,
        // dots: true
    });

    var a = document.getElementById('map');
    var map_url = JSON.parse(localStorage.getItem('map'));
    var map_url_true = map_url;
    $('#map').attr('data', map_url_true);

    a.addEventListener("load", function() { //loading map url from localstorage

        var svgDoc = a.contentDocument;
        var svgRoot = svgDoc.documentElement; //getting into object DOM
        svgRoot.setAttribute("x", "520px");
        svgRoot.setAttribute("y", "300px");
        var MapPathsGroup = svgRoot.getElementById("mapPaths");
        var PathsArray = MapPathsGroup.getElementsByTagName('path');
        var wholeSvgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        wholeSvgGroup.append(MapPathsGroup);
        $(wholeSvgGroup).attr("id", "wholeSvgGroup");
        var FullMapGroup = Snap(wholeSvgGroup);
        var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties')) || { transform: "scale(" + 1 + ") translate(" + 0 + " " + 0 + ")" };
        var pathDisplacement = Snap(pathGroup);
        if ((WrapperProps.transform).length > 0) {

            transformString = (WrapperProps.transform);
            var regex = /[+-]?\d+(\.\d+)?/g;
            var StringValues = transformString.match(regex).map(function(v) {
                return parseFloat(v);
            });
            console.log(StringValues);
            scaleImg = StringValues[0];
            moveLeft = StringValues[1],
            moveTop = StringValues[2];
            console.log(scaleImg, moveLeft, moveTop);
            FullMapGroup.attr("transform", "scale(" + scaleImg + ") translate(" + moveLeft + " " + moveTop + ")");
        }

        for (var i = 0; i < PathsArray.length; i++) {
            PathsArray[i].style.fill = getSettingFromStorage("mapColor"); //coloring map and map stroke from settings
            PathsArray[i].style.stroke = getSettingFromStorage("mapStrokeColor");
        }

        var PathDirection = JSON.parse(localStorage.getItem('path')); // get  direction of main route
        $(svgRoot).addClass("my-svg");

        if (PathDirection) { // main route styling
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            var pathClone = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            $(path).attr('d', PathDirection);
            $(path).attr('fill', 'transparent');
            $(path).attr('stroke', getSettingFromStorage("mapRouteColor"));
            $(path).attr("opacity", '0.8');
            $(path).attr('stroke-width', getSettingFromStorage("routeBorderWidth"));
            $(path).attr("stroke-linecap", "round")
            $(path).attr("id", "routePath");

            if (getSettingFromStorage("routeShadow") == "true" && getSettingFromStorage("routeType") == "dashed") {
                $(pathClone).attr({
                    d: PathDirection,
                    fill: "transparent",
                    stroke: "#ccc",
                    "stroke-dashoffset": "300px",
                    "stroke-dasharray": "12px",
                    opacity: "0.4",
                    "stroke-width": getSettingFromStorage("routeBorderWidth"),
                    "stroke-linecap": "round",
                    id: "routePathClone"
                });
                wholeSvgGroup.append(pathClone);
            }
            if (getSettingFromStorage("routeShadow") == "true" && getSettingFromStorage("routeType") == "dotted") {
                $(pathClone).attr({
                    d: PathDirection,
                    fill: "transparent",
                    stroke: "#ccc",
                    "stroke-dashoffset": "300px",
                    "stroke-dasharray": "4px",
                    opacity: "0.4",
                    "stroke-width": getSettingFromStorage("routeBorderWidth"),
                    "stroke-linecap": "round",
                    id: "routePathClone"
                });
                wholeSvgGroup.append(pathClone);
            }
            if (getSettingFromStorage("routeShadow") == "true" && getSettingFromStorage("routeType") == "line") {
                $(pathClone).attr({
                    d: PathDirection,
                    fill: "transparent",
                    stroke: "#ccc",
                    opacity: "0.4",
                    "stroke-width": getSettingFromStorage("routeBorderWidth"),
                    "stroke-linecap": "round",
                    id: "routePathClone"
                });
                wholeSvgGroup.append(pathClone);
            }
        }


        var currentDisplacementTop = parseInt($("#IDmapbg")[0].style.top); // map offset set up by user on 1st step
        var currentDisplacementLeft = parseInt($('#IDmapbg')[0].style.left);
        var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        $(path1).css('display', 'none');

        var arrImgID = []; //array of page img elements
        $('.lightOn').each(function(el) {
            arrImgID.push($(this));
        });

        var CirclePathCoords = JSON.parse(localStorage.getItem('circlesCoords'));

        $(arrImgID).each(function(i, el) { //get coordinates of point which is tied with current img
            var imgParentID = $(el).closest('section')[0].id;
            imgParentID = parseInt(imgParentID[8]) - 1;
            console.log(i);
            // console.log((CirclePathCoords[i].id-1));
            if (imgParentID == (CirclePathCoords[imgParentID].id - 1)) {
                // console.log(imgParentID);
                $(el).attr({
                    'data-pos-x': CirclePathCoords[imgParentID].cx,
                    'data-pos-y': CirclePathCoords[imgParentID].cy
                });
            }
        });

        function sectionCounter() {
            $('.js-section').each(function(i) {
                var scrollCount = $(window).scrollTop();
                var topOffset = $(this).offset().top;
                var dataZoom = $(this).attr("data-zoom");
                var dataPosTop = parseInt($(this).attr("data-pos-top"));
                var dataPosBottom = $(this).attr('data-pos-bottom');
                var dataPosLeft = parseInt($(this).attr("data-pos-left"));
                var dataPosRight = $(this).attr("data-pos-right");

                if (topOffset <= scrollCount && inWindow($(this))) { //Add class "active" if current section is inWindow

                    $(this).addClass("active");
                    $(path).css("display", "block");
                    FullMapGroup.animate({ //animate map zoom and offset, set up by user on 2nd step, due to current section  
                        transform: "scale(" + dataZoom + ") translate(" + (dataPosLeft) + " " + dataPosTop + ")"
                    }, 700);
                } else {
                    $(this).removeClass("active");
                    if (!$('.js-section').hasClass("active") && $(window).scrollTop() < 20) {
                        $(path).css("display", "none");
                        FullMapGroup.animate({ //animate map zoom and offset, set up by user on 2nd step, due to current section  
                            transform: "scale(" + scaleImg + ") translate(" + (moveLeft) + " " + (moveTop) + ")" ///CHANGE
                        }, 700);
                        var transportIcons = $('.map_transport');
                        $(transportIcons).attr("opacity", "0");
                    }
                }
            });


            function svgPoint(element, x, y) {
                var pt = svgRoot.createSVGPoint();
                pt.x = x;
                pt.y = y;
                return pt.matrixTransform(element.getScreenCTM().inverse());
            }

            var vis_count = 0;

            $(arrImgID).each(function() { //if current img inWindow, than create a light from current point to img's border
                if (inWindow($(this))) {

                    vis_count++;
                    var cx = $(this).attr('data-pos-x');
                    var cy = $(this).attr('data-pos-y');
                    var currentSection = this.closest("section");
                    var currentZoom = $(currentSection).attr("data-zoom");
                    var currentTopOffset = $(currentSection).attr("data-pos-top");
                    var currentLeftOffset = $(currentSection).attr("data-pos-left");
                    var Coordinates = $(this)[0].getBoundingClientRect();
                    var bottomOffsetImg = Coordinates.top + $(this).height();
                    var right_top_X = -(+Coordinates.left + +Coordinates.width) / 1920 * 1400;
                    var right_top_Y = (+Coordinates.top / 1200 * 900);
                    var right_bottom_X = -(+Coordinates.left + +Coordinates.width) / 1920 * 1400;
                    var right_bottom_Y = (Coordinates.bottom) / 1200 * 900;
                    var svg_right_top = svgPoint(svgRoot, right_top_X, right_top_Y);
                    var svg_right_bottom = svgPoint(svgRoot, right_bottom_X, right_bottom_Y);
                    var group_right_top = svgPoint(wholeSvgGroup, right_top_X, right_top_Y);
                    var group_right_bottom = svgPoint(wholeSvgGroup, right_bottom_X, right_bottom_Y);

                    $(path1).css('position', "relative");
                    if (getSettingFromStorage("contentAlign") == "flex-start") {
                        $(path1).attr('d', "M" + cx + " " + cy + " L" + (svg_right_top.x - right_top_X) + " " + (right_top_Y) + " L" + (svg_right_bottom.x - right_bottom_X) + " " + (right_bottom_Y - currentTopOffset) + " Z");
                        $(path1).attr('fill', 'url(#gradient)'); //47DBB4

                    } else if (getSettingFromStorage("contentAlign") == "flex-end") {
                        $(path1).attr('fill', 'url(#gradient_reverse)'); //47DBB4
                        $(path1).attr('d', "M" + cx + " " + cy + " L" + (-svg_right_top.x - right_top_X) + " " + (right_top_Y) + " L" + (-svg_right_bottom.x - right_bottom_X) + " " + (right_bottom_Y - currentTopOffset) + " Z");
                    }
                    $(path1).attr('opacity', '.3');
                }
            });

            $(wholeSvgGroup).prepend(path1);
            svgRoot.append(wholeSvgGroup);
            $(wholeSvgGroup).prepend(MapPathsGroup);
            svgRoot.append(wholeSvgGroup);
            if (vis_count > 0) {
                $(path1).fadeIn(900);
            } else {
                $(path1).fadeOut(900);
            }
        }

        Snap.plugin(function(Snap, Element, Paper, global) { // create circles by path elements in svg
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
        pathGroup.append(path); //group paths

        $(wholeSvgGroup).append(pathGroup);
        svgRoot.append(wholeSvgGroup);
        var s = Snap(pathGroup);

        function clickCircle(e) {
            console.log(e.offsetX, e.offsetY);
        }

        var circlesArray = JSON.parse(localStorage.getItem('circlesCoords'));

        $.each(circlesArray, function(index, el) {

            var circle = s.circlePath(this.cx, this.cy, this.r).attr({ //set points attributes and styles from page settings
                fill: getSettingFromStorage("mapPointsColor"),
                stroke: getSettingFromStorage("mapPointsBorderColor"),
                "stroke-width": getSettingFromStorage("pointsBorderWidth"),
                id: index + 1,
                class: "circleElement",
                style: "display:none",
                onclick: "clickCircle()"
            });
            var intersects = Snap.path.intersection(circle, $(path).attr('d')); //draw circles and main route intersections

            intersects.forEach(function(el) {
                s.circle(el.x, el.y, 1);
            });

        });

        var ParentCicleGroup = svgRoot.getElementById("pathGroup");

        for (var i = 0; i < circlesArray.length; i++) {
            var circleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            var currentPoint = svgRoot.getElementById(i + 1);
            circleGroup.append(currentPoint);
            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            $(text).attr({ //name of point
                x: circlesArray[i].cx,
                y: circlesArray[i].cy + 20,
                "font-size": 12,
                "font-style": "italic",
                fill: "#ccccccc",
                "style": "display: none",
                class: "cityName"
            });
            $(text).text(dataContent[i].cityName);
            circleGroup.append(text);
            ParentCicleGroup.append(circleGroup); //group circles elements with their names(text elements)
            wholeSvgGroup.append(ParentCicleGroup);
            svgRoot.append(wholeSvgGroup);
        }

        var intersectionCircles = svgDoc.getElementsByTagName("circle");
        for (var i = 0; i < intersectionCircles.length; i++) {
            intersectionCircles[i].style.fill = "transparent"; //do not show intersection circles
        }

        var pathStartIcon = JSON.parse(localStorage.getItem("StartRouteIcon"));
        var oParser = new DOMParser();
        var oDOM = oParser.parseFromString(pathStartIcon, "text/xml"); //Parsing string to html element
        var parsedPathStartIcon = oDOM.documentElement;
        var iconOffsetX = $(parsedPathStartIcon).attr("data-offset-x");
        var iconOffsetY = $(parsedPathStartIcon).attr("data-offset-y");
        var iconScale = $(parsedPathStartIcon).attr("data-scale");
        var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        if (getSettingFromStorage("UserOption") == "true" && pathStartIcon) { //check 1st step trigger and set Route start Icon
            for (var i = 0; i < pathStartIcon.length; i++) {
                $(parsedPathStartIcon).attr({
                    fill: getSettingFromStorage("RouteStartIconColor"),
                    transform: iconScale
                });
            }
            //transform Route start Icon
            $(group).attr("transform", "translate(" + (path.getPointAtLength(1).x - (getSettingFromStorage("RouteStartIconSize") / iconOffsetX)) + " " + (path.getPointAtLength(1).y - (getSettingFromStorage("RouteStartIconSize") / iconOffsetY)) + ") " + "scale(" + getSettingFromStorage("RouteStartIconSize") / 100 + ")");
            group.append(parsedPathStartIcon);
            wholeSvgGroup.append(group);
            svgRoot.append(wholeSvgGroup);
        }

        if (getSettingFromStorage("checkboxState") == "true" && getSettingFromStorage("defaultOption") == "true") { //set default style Route start Icon
            var startCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            $(startCircle).attr({
                cx: path.getPointAtLength(1).x,
                cy: path.getPointAtLength(1).y,
                r: getSettingFromStorage("pointsRadius"),
                stroke: getSettingFromStorage("mapPointsBorderColor"),
                fill: getSettingFromStorage("mapPointsColor"),
                "stroke-width": getSettingFromStorage("pointsBorderWidth")
            });
            MapPathsGroup.append(startCircle);
            wholeSvgGroup.append(MapPathsGroup);
            svgRoot.append(wholeSvgGroup);
        }
        text_cont.style.display = "block";

        var StopPoints = JSON.parse(localStorage.getItem('stopsAtLength'));
        var subpathIcons = JSON.parse(localStorage.getItem('subpathIcons')) || [];
        subpathIcons.sort(compareId);
        var length = StopPoints[StopPoints.length - 1];
        var offsetDash = $(path).css({
            "stroke-dashoffset": length,
            "stroke-dasharray": length + " " + length
        });
        var movingIcon = JSON.parse(localStorage.getItem("movingIcon"));
        var map = Snap(wholeSvgGroup);
        var pointIcons = [];

        for (var i = 0; i < subpathIcons.length; i++) {
            pointIcons.push(subpathIcons[i].pointId);
            var oParser = new DOMParser;
            var group_content = oParser.parseFromString(subpathIcons[i].icon, "image/svg+xml");
            var parsed_group_content = group_content.documentElement;
            var snap_group = Snap(parsed_group_content);
            var transport = map.g(snap_group);
            transport.attr({ "id": "transport_" + subpathIcons[i].pointId, "data-scale": subpathIcons[i].size * 0.01, "data-id": subpathIcons[i].pointId, class: "map_transport", fill: subpathIcons[i].color, opacity: 0 });
            var transport_zoom = parseFloat(transport.attr("data-scale"));
            pathGroup.prepend(transport);
            wholeSvgGroup.append(pathGroup);
            var first_point = path.getPointAtLength(StopPoints[i]);
            transport.transform("matrix(" + transport_zoom + ",0,0," + transport_zoom + "," + first_point.x + "," + first_point.y + ")");
        }

        function drawPath() { //Main route Draw animation
            var circleElements = svgDoc.querySelectorAll('.circleElement');
            var textElements = svgDoc.querySelectorAll('.cityName');
            for (var i = 0; i < StopPoints.length; i++) {

                $.each($('.js-section'), function(i, el) {

                    if ($(this).hasClass('active')) {
                        var $percentageComplete = (($(window).scrollTop() - $(this).offset().top) / $(this).height()) * 100; //calculate section offset from page top in percantage
                        var currentSectionID = $(this).attr("id");
                        currentSectionID = parseInt(currentSectionID[8]) - 1;
                        var $offsetUnit = $percentageComplete * (StopPoints[currentSectionID] / 100);
                        var CurrentPathCurrentLength;
                        CurrentPathCurrentLength = Math.floor($offsetUnit);
                        var LengthPoint = path.getPointAtLength(CurrentPathCurrentLength);
                        var currentCircle = svgDoc.getElementById(currentSectionID + 1);
                        var moveToPoint = Snap.path.getPointAtLength(movingTransport);
                        var curDashOffset = parseFloat($(path).css("stroke-dashoffset"));

                        for (var j = 0; j < circleElements.length; j++) {

                            var currentCircleName = $(currentCircle).parent().find("text");
                            if (curDashOffset >= length - 20) {
                                $(circleElements[j]).fadeOut(900);
                                $(textElements[j]).fadeOut(900);
                            } else {
                                if (circleElements[j].id <= currentSectionID + 1) { //Main route points display and fade out
                                    $(circleElements[j]).fadeIn(900);
                                    $(textElements[j]).fadeIn(900);
                                } else if (circleElements[j].id > currentSectionID + 1) {
                                    $(circleElements[j]).fadeOut(900);
                                    $(textElements[j]).fadeOut(900);
                                }
                            }
                        }

                        if (CurrentPathCurrentLength < StopPoints[currentSectionID]) { //draw path

                            if (currentSectionID == 0 && CurrentPathCurrentLength < StopPoints[currentSectionID]) { // path drawing to first point
                                $(path).css("stroke-dashoffset", "" + (length - CurrentPathCurrentLength) + "px");
                                var movingTransport = map.select("#transport_" + pointIcons[0]);
                                movingTransport.animate({ opacity: "0" }, 100);
                            }


                            if (currentSectionID > 0 && CurrentPathCurrentLength < StopPoints[currentSectionID]) { // path drawing to next point
                                $(path).css("stroke-dashoffset", "" + (length - (StopPoints[currentSectionID - 1] + CurrentPathCurrentLength)) + "");
                                for (var k = 0; k < pointIcons.length; k++) {
                                    if (currentSectionID == parseInt(pointIcons[k] - 1)) {
                                        var route = (StopPoints[parseInt(pointIcons[k]) - 2] + CurrentPathCurrentLength);
                                        var route_points = path.getPointAtLength(route);
                                        var circle_route_points = path.getPointAtLength(route + 2);
                                        var slope = (route_points.y - circle_route_points.y) / (route_points.x - circle_route_points.x);
                                        var angle = Math.atan2((route_points.y - circle_route_points.y), (route_points.x - circle_route_points.x)) * 180 / Math.PI;
                                        var x0 = route_points.x + 100;
                                        var y0 = slope * (x0 - route_points.x) + route_points.y;
                                        var movingTransport = map.select("#transport_" + pointIcons[k]);
                                        var transport_zoom = parseFloat(movingTransport.attr("data-scale"));
                                        console.log(transport_zoom);
                                        var bbox = movingTransport.getBBox();
                                        var cx = bbox.x + (bbox.width / 2),
                                            cy = bbox.y + (bbox.height / 2);
                                        console.log(movingTransport, cx, cy, route_points.x, route_points.y);
                                        movingTransport.animate({ opacity: "1" }, 100);
                                        if (route > StopPoints[pointIcons[k] - 1]) {
                                            console.log("IF");
                                            movingTransport.animate({ opacity: "0" }, 100);
                                        }
                                        if (route < StopPoints[pointIcons[k] - 1]) {

                                            var myMatrix = new Snap.Matrix();
                                            myMatrix.scale(transport_zoom, transport_zoom);
                                            myMatrix.rotate(angle + 180, circle_route_points.x * 20, circle_route_points.y * 20);
                                            myMatrix.translate((route_points.x * 20), ((route_points.y - 12) * 20));
                                            movingTransport.animate({ transform: myMatrix }, 10);
                                            movingTransport.animate({ transform: myMatrix }, 10);
                                            if (route > StopPoints[pointIcons[0]]) {
                                                var fadeTransport = map.select("#transport_" + pointIcons[0]);
                                                fadeTransport.animate({ opacity: "0" }, 100);
                                                console.log("opacity 0");
                                            }
                                        }
                                    }
                                    if (pointIcons[k] > currentSectionID + 1) {
                                        var movingTransport = map.select("#transport_" + pointIcons[k]);
                                        movingTransport.animate({ opacity: "0" }, 100);
                                    }
                                }
                            } // end of path drawing to next point condition
                        }

                        if (StopPoints[currentSectionID - 1] + CurrentPathCurrentLength > StopPoints[currentSectionID]) { //Stop path drawing while section inWindow

                            $(path).css("stroke-dashoffset", "" + (length - StopPoints[currentSectionID]) + "px");

                        }
                    }
                });
            }
        }

        function scrolled(e) {
            drawPath();
            sectionCounter();
        }

        $(window).on("scroll", scrolled); //draw animation on scroll

    }, false);

    $("#IDmapbg").css("background-color", getSettingFromStorage("bodyBackgroundColor")); //set page bg color from settings
    $("body").css("background-color", getSettingFromStorage("bodyBackgroundColor"));
    
});