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
                    contentWidth: "100",
                    contentAlign: "flex-start",
                    checkboxState: "false",
                    defaultOption: "false",
                    UserOption: "false",
                    StartIcon: "",
                    RouteStartIconColor: "rgba(0, 0, 0, 1)",
                    RouteStartIconSize: "10"
                };




                if (SettingsObject[setting]) {
                    return SettingsObject[setting];
                }
            }

            console.log(getSettingFromStorage("mapColor"));
            // localStorage.clear();
            var editor = new bezierEditor("bezier-canvas");
            editor.draw();

            $('#clear').bind("click", function() {

                console.log(editor.clearBezier());
                $("#dataMap").attr("data", "");
                localStorage.clear();
                editor.draw();
                window.location.reload();

            });

            $('#redraw').bind("click", function() {

                editor.draw();
                Materialize.toast('Editor redrawn!', 2000);

            })

            $('#screen').bind("click", function() {
                goFullScreen();
                editor.draw();
            });



            $('#export').bind("click", function() {
                editor.draw();

                var PathCurves = editor.ReturnSavedPath();
                localStorage.setItem('SavedCurves', JSON.stringify(PathCurves));
                var FirstRoute = JSON.parse(localStorage.getItem('path'));


                if (FirstRoute) {
                    var newRoute = editor.exportBezier();
                    newRoute = newRoute.slice(1);
                    FirstRoute += newRoute;
                    localStorage.setItem('path', JSON.stringify(FirstRoute));
                    console.log(newRoute);
                    console.log(FirstRoute);
                } else {
                    var DrawnPath = editor.exportBezier();

                    localStorage.setItem('path', JSON.stringify(DrawnPath));
                }

                console.log(styleProps);

                localStorage.setItem("mapStyleProperties", JSON.stringify(styleProps));

            });

            var editor = new bezierEditor("bezier-canvas");

            function handleFileSelect(evt) {
                var files = evt.target.files;
                var f = files[0];
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {
                        editor.loadImage(e.target.result);
                        editor.draw();

                    };
                })(f);
                reader.readAsDataURL(f);
            }
            $('.img_item').bind("click", function() {
                var src = $(this).attr('src');



                var svgMap = document.getElementById("dataMap");
                $("#dataMap").attr("data", src);
                loadMap(svgMap);
                localStorage.setItem('map', JSON.stringify(src));


                Materialize.toast('Map is selected!', 2000);


                $('.button-collapse').sideNav('hide');

            });
            editor.draw();

            console.log(JSON.parse(localStorage.getItem("Settings")));

            function loadMap(map_container) {
                map_container.addEventListener("load", function() {
                    var svgDoc = map_container.contentDocument; //get the inner DOM of alpha.svg
                    console.log(svgDoc);
                    var svgRoot = svgDoc.documentElement;
                    var MapPathsGroup = svgRoot.getElementById("mapPaths");
                    var PathsArray = MapPathsGroup.getElementsByTagName('path');
                    // console.log(PathsArray);

                    var SettingsObj = JSON.parse(localStorage.getItem("Settings")) || {
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
                        contentAlign: "flex-start",
                        checkboxState: "false",
                        defaultOption: "false",
                        UserOption: "false",
                        StartIcon: "",
                        RouteStartIconColor: "rgba(0, 0, 0, 1)",
                        RouteStartIconSize: "2"
                    };

                    var MapColor = document.getElementById("mapColorPicker");
                    var MapStrokeColor = document.getElementById("mapStrokeColorPicker");
                    var MapPointsColor = document.getElementById("mapPointsColorPicker");
                    var MapPointsBorderColor = document.getElementById("mapPointsBorderColorPicker");
                    var MapRouteColor = document.getElementById("mapRouteColorPicker");
                    var PageBodyColor = document.getElementById("bodyColorPicker");

                    var ColorCollection = $(".colorPicker");

                    var color_change = $("#color_change");




                    MapColor.style.display = "block";
                    MapStrokeColor.style.display = "block";
                    MapPointsColor.style.display = "block";
                    MapPointsBorderColor.style.display = "block";
                    MapRouteColor.style.display = "block";
                    PageBodyColor.style.display = "block";




                    MapColor.value = getSettingFromStorage("mapColor");
                    MapStrokeColor.value = getSettingFromStorage("mapStrokeColor");
                    MapPointsColor.value = getSettingFromStorage("mapPointsColor");
                    MapPointsBorderColor.value = getSettingFromStorage("mapPointsBorderColor");
                    MapRouteColor.value = getSettingFromStorage("mapRouteColor");
                    PageBodyColor.value = getSettingFromStorage("bodyBackgroundColor");
                    $("#PathStartIconColor").val(getSettingFromStorage("RouteStartIconColor"));

                    $('#test6').value = getSettingFromStorage("pointsRadius") * 2;

                    for (var i = 0; i < PathsArray.length; i++) {
                        PathsArray[i].style.fill = getSettingFromStorage("mapColor");
                        PathsArray[i].style.stroke = getSettingFromStorage("mapStrokeColor");
                    }


                    $('#circle_example').css({
                        width: getSettingFromStorage("pointsRadius") * 2,
                        height: getSettingFromStorage("pointsRadius") * 2,
                        "background-color": getSettingFromStorage("mapPointsColor"),
                        border: getSettingFromStorage("pointsBorderWidth") + "solid" + getSettingFromStorage("mapPointsBorderColor")
                    });

                    $(".routeExample").css({
                        height: getSettingFromStorage("routeBorderWidth"),
                        "background-color": getSettingFromStorage("mapRouteColor")
                    });

                    $("#iconTest").attr({
                        width: getSettingFromStorage("RouteStartIconSize"),
                        height: getSettingFromStorage("RouteStartIconSize")
                    });




                    var RangeInputs = $("input[type=range]");
                    var RouteStartCheckbox = $("input[type=checkbox]");


                    var mapForSettings = document.getElementById("mapSettings");
                    var currentMap = JSON.parse(localStorage.getItem("map"));
                    $("#mapSettings").attr("data", currentMap);


                    mapForSettings.addEventListener("load", function() {
                        var svgDoc = mapForSettings.contentDocument; //get the inner DOM of alpha.svg
                        var svgRoot = svgDoc.documentElement;
                        var changedMap = svgRoot.getElementsByTagName('path');;
                        // var SettingMapPathsArray = MapPathsGroup.getElementsByTagName('path');
                        // console.log(changedMap);

                        $(".map_settings_block").css("background-color", getSettingFromStorage("bodyBackgroundColor"));

                        for (var i = 0; i < changedMap.length; i++) {
                            // console.log(PathsArray[i]);
                            changedMap[i].style.fill = getSettingFromStorage("mapColor");
                            changedMap[i].style.stroke = getSettingFromStorage("mapStrokeColor");
                        }


                        $(RangeInputs).change(function(el) {
                            var optionSelected = $("option:selected", this);
                            var valueSelected = this.value;
                            var name = this.name;
                            SettingsObj[name] = valueSelected;

                            var circlesArray = JSON.parse(localStorage.getItem('circlesCoords'));

                            for (var i = 0; i < circlesArray.length; i++) {
                                circlesArray[i].r = SettingsObj.pointsRadius;
                            }

                            $('#circle_example').css({
                                width: SettingsObj.pointsRadius * 2,
                                height: SettingsObj.pointsRadius * 2,
                                border: SettingsObj.pointsBorderWidth + "px solid " + SettingsObj.mapPointsBorderColor,

                            });

                            $(".routeExample").css("height", SettingsObj.routeBorderWidth);
                            $(".content_block").css("width", SettingsObj.contentWidth + "%");

                            localStorage.setItem('circlesCoords', JSON.stringify(circlesArray));
                            localStorage.setItem('Settings', JSON.stringify(SettingsObj));
                        });

                        $('input[name = contentAlign]').on("click", function() {
                            var checkedRadio = $(this).prop('checked', true);
                            var alignClass = checkedRadio[0].id;
                            console.log($(this).val());
                            $('.test_block').css("justify-content", $(this).val());
                            SettingsObj.contentAlign = $(this).val();
                            localStorage.setItem('Settings', JSON.stringify(SettingsObj));
                        });


                        $(ColorCollection).minicolors({
                            opacity: true,
                            format: "rgb",
                            rgbaString: false,
                            change: function(hsl, rgb) {
                                var rgbaString = 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + rgb.a + ')';
                                console.log(rgbaString);
                            },
                            swatches: ['rgba(154, 9, 173, 1)','rgba(240, 17, 17, 1)','rgba(0, 255, 21, 1)','rgba(15, 43, 255, 1)','rgba(255, 239, 13, 1)'],
                            showSpeed: 100
                        });


                        $(ColorCollection).minicolors("rgbaString");

                        $(ColorCollection).change(function(el) {
                            var optionSelected = $("option:selected", this);
                            var valueSelected = this.value;
                            // console.log(optionSelected);

                            var name = this.name;
                            // console.log(optionSelected);
                            // console.log(valueSelected);
                            SettingsObj[name] = valueSelected;

                            // console.log(SettingsObj);


                            for (var i = 0; i < PathsArray.length; i++) {
                                PathsArray[i].style.fill = SettingsObj.mapColor;
                                PathsArray[i].style.stroke = SettingsObj.mapStrokeColor;
                            }
                            for (var j = 0; j < changedMap.length; j++) {
                                changedMap[j].style.fill = SettingsObj.mapColor;
                                changedMap[j].style.stroke = SettingsObj.mapStrokeColor;
                            }
                            $(".map_settings_block").css("background-color", SettingsObj.bodyBackgroundColor);

                            $('#circle_example').css({
                                border: "" + SettingsObj.pointsBorderWidth + "px solid " + SettingsObj.mapPointsBorderColor,
                                "background-color": SettingsObj.mapPointsColor
                            });
                            $(".routeExample").css("background-color", SettingsObj.mapRouteColor);
                            $(".wrap_map").css("background-color", SettingsObj.bodyBackgroundColor);


                            localStorage.setItem('Settings', JSON.stringify(SettingsObj));

                        });




                    });




                    $(RouteStartCheckbox).attr("checked", JSON.parse(getSettingFromStorage("checkboxState")));
                    $("#defaultOption").attr("checked", JSON.parse(getSettingFromStorage("defaultOption")));
                    $("#UserOption").attr("checked", JSON.parse(getSettingFromStorage("UserOption")));



                    if ($(RouteStartCheckbox).is(":checked")) {
                        $(".centered_form").show().css('display', 'flex');
                        if ($("#UserOption").is(":checked")) {

                            $(".additional_settings").show();
                            var icon = "" + getSettingFromStorage("StartIcon");
                            var icon_cont = document.getElementById("iconTest");
                            if (icon.length > 0) {

                                $("#iconTest").attr("data", icon);
                                loadIcon(icon_cont);
                            } else {
                                $("#iconTest").attr("data", "");
                            }
                        } else if ($("#defaultOption").is(":checked")) {
                            $(".additional_settings").hide();
                        }
                    } else {
                        $(".additional_settings").hide();
                        $(".centered_form").hide();
                    }



                    $(RouteStartCheckbox).on("click", function() {
                        if ($(this).is(":checked")) {
                            SettingsObj.checkboxState = "true";
                            localStorage.setItem('Settings', JSON.stringify(SettingsObj));
                            console.log(SettingsObj);
                            $(".centered_form").show().css('display', 'flex');

                        } else {
                            $(".centered_form").hide();
                            SettingsObj.checkboxState = "false";
                            $(".additional_settings").hide();
                            localStorage.setItem('Settings', JSON.stringify(SettingsObj));
                        }
                    });

                    $("#UserOption").on("click", function() {
                        SettingsObj.UserOption = "true";
                        SettingsObj.defaultOption = "false";
                        localStorage.setItem("Settings", JSON.stringify(SettingsObj));
                        $(".additional_settings").show();
                        var icon_container = document.getElementById("iconTest");
                        $("#iconTest").attr("data", getSettingFromStorage("StartIcon"));
                        loadIcon(icon_container);

                    });


                    $("#defaultOption").on("click", function() {
                        SettingsObj.UserOption = "false";
                        SettingsObj.defaultOption = "true";
                        localStorage.setItem("Settings", JSON.stringify(SettingsObj));
                        $(".additional_settings").hide();

                    });



                    $(".icon_gallery__item").on("click", function() {
                        var iconSRC = $(this).attr("src");
                        console.log(iconSRC);
                        var icon_container = document.getElementById("iconTest");
                        $("#iconTest").attr("data", iconSRC);
                        loadIcon(icon_container);
                        SettingsObj.StartIcon = iconSRC;
                        localStorage.setItem("Settings", JSON.stringify(SettingsObj));
                    });




                    function loadIcon(icon_container) {
                        icon_container.addEventListener("load", function() {
                            var svgDoc = icon_container.contentDocument; //get the inner DOM of alpha.svg
                            var svgRoot = svgDoc.documentElement;
                            var paths = svgRoot.getElementsByTagName("path");
                            var s = new XMLSerializer();

                            var iconObj = document.getElementById("iconTest");

                            var iconPathsArray = [];
                            for (var i = 0; i < paths.length; i++) {
                                paths[i].style.fill = SettingsObj.RouteStartIconColor;
                                var pathDir = s.serializeToString(paths[i]);
                                console.log(pathDir);
                                iconPathsArray.push(pathDir);
                            }
                            console.log(iconPathsArray);
                            localStorage.setItem("StartRouteIcon", JSON.stringify(iconPathsArray));
                            $("input[name=RouteStartIconColor]").change(function(el) {
                                var optionSelected = $("option:selected", this);
                                var valueSelected = this.value;

                                var name = this.name;

                                SettingsObj[name] = valueSelected;
                                for (var i = 0; i < paths.length; i++) {
                                    paths[i].style.fill = SettingsObj.RouteStartIconColor;
                                }
                            });

                            $("input[name = RouteStartIconSize]").change(function() {
                                var optionSelected = $("option:selected", this);
                                var valueSelected = this.value;
                                var name = this.name;
                                SettingsObj[name] = valueSelected;
                                $("#iconTest").attr({
                                    width: SettingsObj.RouteStartIconSize,
                                    height: SettingsObj.RouteStartIconSize
                                });
                                svgRoot.setAttribute("width", $(iconObj).attr("width"));
                                svgRoot.setAttribute("height", $(iconObj).attr("height"));
                                console.log(svgRoot);
                                console.log(SettingsObj);
                            });

                        });
                    }




                });
            }


            var savedMap = JSON.parse(localStorage.getItem('map')) || []; // get map from ls if it exists

            if (savedMap) {
                var svgMap = document.getElementById("dataMap");
                $("#dataMap").attr("data", savedMap);
                loadMap(svgMap);

                var WrapperProps = JSON.parse(localStorage.getItem('mapStyleProperties')) || [];
                var mapBg = document.getElementById("mapbg");


                if (WrapperProps) {

                    $.each(WrapperProps, function(prop, value) {
                        $("#map_bg").css(prop, value);
                    });

                }
            }



            var styleProps = JSON.parse(localStorage.getItem("mapStyleProperties")) || {
                transform: "",
                top: "",
                left: ""
            };
            console.log(styleProps);
            var scaleImg = 1.1;
            $("#plus").bind('click', function() {
                scaleImg += 0.3;
                $("#map_bg").css("transform", "scale(" + scaleImg + ")");
                styleProps.transform = "scale(" + scaleImg + ")";
                // console.log(styleProps);
                localStorage.setItem('zoom', JSON.stringify(scaleImg));
            });
            $("#minus").bind('click', function() {
                scaleImg -= 0.3;
                if (scaleImg < 1.1) {
                    scaleImg = 1;
                }
                $("#map_bg").css("transform", "scale(" + scaleImg + ")");
                styleProps.transform = "scale(" + scaleImg + ")";
                localStorage.setItem('zoom', JSON.stringify(scaleImg));
            });
            var moveLeft = 2;
            var moveTop = 2;
            var moveLeftDefault = 0;
            var moveTopDefault = 0;
            $("map_bg").css("left", "" + moveLeftDefault + "%");
            $("map_bg").css("top", "" + moveTopDefault + "%");
            styleProps.left = "" + moveLeftDefault + "%";
            styleProps.top = "" + moveTopDefault + "%";
            $("#moveLeft").bind("click", function() {
                moveLeft += 3;
                $("#map_bg").css("left", "" + moveLeft + "%");
                styleProps.left = "" + moveLeft + "%";

            });
            $("#moveRight").bind("click", function() {
                moveLeft -= 3;
                $("#map_bg").css("left", "" + moveLeft + "%");
                styleProps.left = "" + moveLeft + "%";
            });
            $("#moveTop").bind("click", function() {
                moveTop += 3;
                $("#map_bg").css("top", "" + moveTop + "%");
                styleProps.top = "" + moveTop + "%";
            });
            $("#moveBottom").bind("click", function() {
                moveTop -= 3;
                $("#map_bg").css("top", "" + moveTop + "%");
                styleProps.top = "" + moveTop + "%";
            });


        });


        $(document).ready(function() { //Materialize.js plugins
            $('.modal').modal();
            $('select').material_select();




            var projectInfo = JSON.parse(localStorage.getItem("ProjectInfo")) || {
                projectName: "",
                projectDescription: ""
            };

            $('.modal2').modal({
                dismissable: false,
                ready: function(modal, trigger) {
                    if (projectInfo) {
                        $("#projectName").val(projectInfo.projectName);
                        $("#projectDescription").val(projectInfo.projectDescription)
                    }

                },
                complete: function() {
                    var NameInput = $("#projectName").val();
                    var DescriptionInput = $("#projectDescription").val();
                    if (NameInput.length > 0 && DescriptionInput.length > 0) {
                        projectInfo.projectName = NameInput;
                        projectInfo.projectDescription = DescriptionInput;
                    } else {
                        projectInfo.projectName = "";
                        projectInfo.projectDescription = "";
                    }
                    localStorage.setItem("ProjectInfo", JSON.stringify(projectInfo));
                }
            });




            $('.button-collapse').sideNav({
                menuWidth: 1200,
                edge: 'left',
                closeOnClick: true,
                draggable: true
            });

            $("#menu").on("click", function() {
                if (!$(this).hasClass('.active')) {
                    $(this).addClass("active");
                    $('.tap-target').tapTarget('open');
                } else {
                    $(this).removeClass("active");
                    $('.tap-target').tapTarget('close');
                }
            })


        });