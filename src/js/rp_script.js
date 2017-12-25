$(document).ready(function() {
    // get editor settings
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
        contentWidth: "50",
        contentAlign: "flex-start"
    };

        if(SettingsObject[setting]){
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

    if(dataContent){
    dataContent.sort(compareId);
    }

    var text_cont = document.getElementById("boom");

    for (var i = 0; i < dataContent.length; i++) {
        var section = document.createElement('section');    // creation of page sections with it's content, tied to every point
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
    function hasSliderClass(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    }

    var sliderImg = $('.js-image');
    console.log(sliderImg);
    for(var i=0; i < sliderImg.length; i++){
        var src = sliderImg[i].getAttribute('src');
        var sliderImgSrc = src.slice(-9);
        var singleImgSrc = src.slice(-15);
        console.log(singleImgSrc);
        if(sliderImgSrc == "/preview/" && !hasSliderClass(sliderImg[i], "slick-item")){
            sliderImg[i].classList.add("slick-item");
        }
        if(singleImgSrc == "/preview/single" && !hasSliderClass(sliderImg[i], "slick-single")){
            sliderImg[i].classList.remove("slick-item")
            sliderImg[i].classList.add("slick-single");
        }
    }
    // console.log(sliderImg);

            $.fn.hasAttr = function(name) {  
           return this.attr(name) !== undefined;
        };
    var sections = $('.js-section');
    

    var sliderItem = $('.slick-single');

    if(sliderItem && sliderItem.length > 0){
        $.each(sliderItem, function(i,el){
            


        // if($(el).hasAttr('data-img-amout') && $(el).attr('data-img-amout') == "single_img"){
            var sliderWrap = document.createElement('div');
            $(sliderWrap).addClass('slick-current');
            $(el).wrap($(sliderWrap));
        // }


        });
    }






    $.each(sections, function(i,el){




    if($(el).find('.slick-item').length !== 0){
        console.log($(el));
        var slickItem =  $(el).find('.slick-item');
            if($(slickItem).hasAttr('data-img-amout') && $(slickItem).attr('data-img-amout') == "single_img"){
                var sliderWrap = document.createElement('div');
                // console.log("kek");
                $(sliderWrap).addClass('slick-current');
                $(slickItem).wrap($(sliderWrap));
            }  
        
        else if($(slickItem).attr('data-img-amout') == "" || !$(slickItem).hasAttr('data-img-amout')){

            var sliderWrap = document.createElement('div');
            $(sliderWrap).addClass('slider');
            $(slickItem).wrapAll($(sliderWrap));
        }

        // else{
        //     var sliderWrap = document.createElement('div');
        //     $(sliderWrap).addClass('slick-current');
        //     $(slickItem).wrapAll($(sliderWrap));            
        // }
        $(".slider").css("width", 100 + "%");
        $(".slider").parent().find('br').remove();
        // if($(".slider").parent().is("p")){
        //     $(".slider").unwrap();
        // }
    }

});

      $('.slider').slick({
       "slidesToShow": 1,
       "slidesToScroll": 1,
        // autoplay: true,
        // autoplaySpeed: 2000,
        prevArrow: true,
        nextArrow: true,
        // fade: true,
        // dots: true
      });


    $('.mapbg').css("zoom", "0%");
    $('.mapbg').css("right", "0");
    $('mapbg').css("bottom", "0");
    var a = document.getElementById('map');

    var map_url = JSON.parse(localStorage.getItem('map'));
    var map_url_true = map_url;
    // console.log(map_url_true);

    $('#map').attr('data', map_url_true); 

    a.addEventListener("load", function() { //loading map url from localstorage

        // console.log($("#map").attr('data'));
        var svgDoc = a.contentDocument;
        var svgRoot = svgDoc.documentElement;  //getting into object DOM

        var MapPathsGroup = svgRoot.getElementById("mapPaths");
        var PathsArray = MapPathsGroup.getElementsByTagName('path');


        var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties')) || { transform: ""};
             if((WrapperProps.transform).length > 0){
                // scaleImg = styleProps.transform;
                
                transformString = (WrapperProps.transform);
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

                $(MapPathsGroup).attr("transform", "scale(" + scaleImg + ") translate("+ moveLeft +" " + moveTop+ ")");
            }       


        for(var i = 0; i < PathsArray.length; i++){                         
            PathsArray[i].style.fill = getSettingFromStorage("mapColor");       //coloring map and map stroke from settings
            PathsArray[i].style.stroke = getSettingFromStorage("mapStrokeColor");
        }


        var PathDirection = JSON.parse(localStorage.getItem('path'));   // get  direction of main route




        // console.log(svgRoot);
        $(svgRoot).addClass("my-svg");

        if (PathDirection) {   // main route styling
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            $(path).attr('d', PathDirection);
            $(path).attr('fill', 'transparent');
            $(path).attr('stroke', getSettingFromStorage("mapRouteColor"));
            $(path).attr("opacity", '0.8');
            $(path).attr('stroke-width', getSettingFromStorage("routeBorderWidth"));
            $(path).attr("stroke-linecap","round")
            $(path).attr("id", "routePath");

        }




        var currentDisplacementTop = parseInt($("#IDmapbg")[0].style.top);  // map offset set up by user on 1st step
        var currentDisplacementLeft = parseInt($('#IDmapbg')[0].style.left);
        var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        $(path1).css('display', 'none');


        function sectionCounter() {
            $('.js-section').each(function(i) {

                var scrollCount = $(window).scrollTop();
                var topOffset = $(this).offset().top;
                var dataZoom = $(this).attr("data-zoom");
                var dataPosTop = parseInt($(this).attr("data-pos-top")) +  "%";
                var dataPosBottom = $(this).attr('data-pos-bottom');
                var dataPosLeft = parseInt($(this).attr("data-pos-left")) +"%";
                var dataPosRight = $(this).attr("data-pos-right");



                if (topOffset <= scrollCount && inWindow($(this))) { //Add class "active" if current section is inWindow

                    $(this).addClass("active");

                    $('.mapbg').stop().animate({ //animate map zoom and offset, set up by user on 2nd step, due to current section  
                        zoom: dataZoom,
                        left: dataPosLeft,
                        right: dataPosRight,
                        top: dataPosTop,
                        bottom: dataPosBottom
                    }, 700);

                }
                else{
                    $(this).removeClass("active");
                    if (!$('.js-section').hasClass("active") && $(window).scrollTop() < 20) {
                        $('.mapbg').stop().animate({
                            left: currentDisplacementLeft + "%",
                            top: currentDisplacementTop + "%",
                            zoom: "100%"
                        }, 400);

                    }

                }

            });

            var arrImgID = []; //array of page img elements
            // $('.js-image').each(function(i,el){
            //     if(!$(el).hasClass('.slick-item')){
            //         arrImgID.push($(el));
            //     }
            // });

            $('.slick-current').each(function(el) {

                arrImgID.push($(this));
                // console.log(arrImgID);
            });


            var CirclePathCoords = JSON.parse(localStorage.getItem('circlesCoords'));

            $(arrImgID).each(function(i, el) { //get coordinates of point which is tied with current img

                var imgParentID = $(this).closest('section')[0].id;

                imgParentID = parseInt(imgParentID[8]) - 1;
                if (imgParentID == CirclePathCoords[i].id-1) {
                    console.log(imgParentID);
                    $(this).attr({
                        'data-pos-x': CirclePathCoords[imgParentID].cx,
                        'data-pos-y': CirclePathCoords[imgParentID].cy
                    });
                }
            });

            var vis_count = 0;

            $(arrImgID).each(function() {  //if current img inWindow, than create a light from current point to img's border
                if (inWindow($(this))) {
                    console.log($(this));
                    vis_count++;

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
        pathGroup.append(path);     //group paths
        svgRoot.append(pathGroup);
        var s = Snap(pathGroup);


        var circlesArray = JSON.parse(localStorage.getItem('circlesCoords'));


        $.each(circlesArray, function(index, el) {
            
            var circle = s.circlePath(this.cx, this.cy, this.r).attr({ //set points attributes and styles from page settings
                fill: getSettingFromStorage("mapPointsColor"),
                stroke: getSettingFromStorage("mapPointsBorderColor"),
                "stroke-width": getSettingFromStorage("pointsBorderWidth"),
                id: index+1,
                class: "circleElement",
                style: "display:none"

            });


                 

            var intersects = Snap.path.intersection(circle, $(path).attr('d')); //draw circles and main route intersections

            intersects.forEach(function(el) {

                s.circle(el.x, el.y, 1);

            });

        

        });

        var ParentCicleGroup = svgRoot.getElementById("pathGroup");
        // console.log(ParentCicleGroup);
        for(var i=0; i < circlesArray.length; i++){
            var circleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            var currentPoint = svgRoot.getElementById(i+1);
            circleGroup.append(currentPoint);
            
            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            $(text).attr({                                                                  //name of point
                x: circlesArray[i].cx,
                y: circlesArray[i].cy + 20,
                "font-size": 12,
                "font-style": "italic",
                fill: "#ccccccc",
                "style": "display: none",
                class: "cityName"
            });
            $(text).text(dataContent[i].cityName);
            // console.log(text);
            circleGroup.append(text);
           
            ParentCicleGroup.append(circleGroup);   //group circles elements with their names(text elements)
            
            // console.log(currentPoint);
            
            svgRoot.append(circleGroup);  
        }


        var intersectionCircles = svgDoc.getElementsByTagName("circle");
        for(var i=0;i<intersectionCircles.length;i++){
            intersectionCircles[i].style.fill = "transparent"; //do not show intersection circles
        }            


            var pathStartIcon = JSON.parse(localStorage.getItem("StartRouteIcon")) ;


            var oParser = new DOMParser(); 
            var oDOM = oParser.parseFromString(pathStartIcon, "text/xml"); //Parsing string to html element


            var parsedPathStartIcon = oDOM.documentElement; 
            var iconOffsetX = $(parsedPathStartIcon).attr("data-offset-x");
            var iconOffsetY = $(parsedPathStartIcon).attr("data-offset-y");
            var iconScale = $(parsedPathStartIcon).attr("data-scale");

         var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        if(getSettingFromStorage("UserOption") == "true" && pathStartIcon){        //check 1st step trigger and set Route start Icon
            for(var i=0;i<pathStartIcon.length;i++){                
            
                $(parsedPathStartIcon).attr({
                    fill: getSettingFromStorage("RouteStartIconColor"),
                    transform: iconScale
                });       
            }
        

        //transform Route start Icon
        $(group).attr("transform", "translate("+(path.getPointAtLength(1).x - (getSettingFromStorage("RouteStartIconSize")/iconOffsetX)) + " " + (path.getPointAtLength(1).y - (getSettingFromStorage("RouteStartIconSize")/iconOffsetY) )+") " + "scale("+getSettingFromStorage("RouteStartIconSize")/100+")");
        group.append(parsedPathStartIcon);
        svgRoot.append(group);
        }
        








        if(getSettingFromStorage("checkboxState") == "true" && getSettingFromStorage("defaultOption") == "true"){ //set default style Route start Icon
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


        function drawPath() {   //Main route Draw animation
            var circleElements = svgDoc.querySelectorAll('.circleElement');
            // console.log(circleElements);
            var textElements = svgDoc.querySelectorAll('.cityName');
            // console.log(textElements);
            for (var i = 0; i < StopPoints.length; i++) {

                $.each($('.js-section'), function(i, el) {

                    // console.log($(path));
                    if ($(this).hasClass('active')) {

                        var $percentageComplete = (($(window).scrollTop() - $(this).offset().top) / $(this).height()) * 100; //calculate section offset from page top in percantage
                        var currentSectionID = $(this).attr("id");
                        currentSectionID = parseInt(currentSectionID[8]) - 1;
                        var $offsetUnit = $percentageComplete * (StopPoints[currentSectionID] / 100);
                        var CurrentPathCurrentLength;
                        CurrentPathCurrentLength = Math.floor($offsetUnit);


                        var currentCircle = svgDoc.getElementById(currentSectionID+1);
                        
                        

                        var curDashOffset = parseFloat($(path).css("stroke-dashoffset"));   
                        for(var j = 0; j < circleElements.length; j++){
                            
                            var currentCircleName = $(currentCircle).parent().find("text");

                            if(curDashOffset >= length - 20){   
                                $(circleElements[j]).fadeOut(900);
                                $(textElements[j]).fadeOut(900);
                                 // $(currentCircleName).fadeOut(900);
                            }
                            else {
                                 if(circleElements[j].id <= currentSectionID+1){                //Main route points display and fade out
                                    $(circleElements[j]).fadeIn(900);
                                    $(textElements[j]).fadeIn(900);
                                }
                                else if(circleElements[j].id > currentSectionID+1 ){
                                    $(circleElements[j]).fadeOut(900);
                                    $(textElements[j]).fadeOut(900);
                                }
                            }
                        }

                        if (CurrentPathCurrentLength < StopPoints[currentSectionID]) { //draw path

                            if (currentSectionID == 0 && CurrentPathCurrentLength < StopPoints[currentSectionID]) { // path drawing to first point
                                $(path).css("stroke-dashoffset", "" + (length - CurrentPathCurrentLength) + "px");                           
                            }


                            if (currentSectionID > 0 && CurrentPathCurrentLength < StopPoints[currentSectionID]) { // path drawing to next point
                                $(path).css("stroke-dashoffset", "" + (length - (StopPoints[currentSectionID - 1] + CurrentPathCurrentLength)) + "");
                            }

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


        $(window).on("scroll", scrolled);   //draw animation on scroll

    }, false);

 
    // console.log(WrapperProps);

        $("#IDmapbg").css("background-color", getSettingFromStorage("bodyBackgroundColor") );     //set page bg color from settings
        $("body").css("background-color", getSettingFromStorage("bodyBackgroundColor") ); 



    // $.each(WrapperProps, function(prop, value) {
    //     $("#IDmapbg").css(prop, value); //set offsets from 1st step
    // });

});