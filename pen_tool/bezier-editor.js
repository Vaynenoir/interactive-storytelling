
$(document).ready(function(){

	function getSettingFromStorage(setting){
		var SettingsObject = JSON.parse(localStorage.getItem("Settings")) || {
    	mapColor: "#ffcc80",
    	mapStrokeColor: "#000000",
    	mapPointsColor: "#0000ff",
    	mapPointsBorderColor: "#000000",
    	mapRouteColor: "#000000",
    	bodyBackgroundColor: "#f3e5f5",
    	routeBorderWidth: "4",
    	pointsRadius: "8"
    };
		if(SettingsObject[setting]){
			return SettingsObject[setting];
		}
	}

 			$(".wrap_map").css("background-color", getSettingFromStorage("bodyBackgroundColor"));



	$('#openMap').bind("click",function(){
		$('#gallery').fadeIn(2000);
	});
   $('a[href^="#"]').click(function () { 
     elementClick = $(this).attr("href");
     destination = $(elementClick).offset().top;
     
       $('body').animate( { scrollTop: destination }, 700 );
   
       $('html').animate( { scrollTop: destination }, 700 );
     
     return false;
   });
});




function goFullScreen(){

    var canvasWrapper = document.getElementById("full_screen");
    var canvas = document.getElementById("bezier-canvas");
    if(canvasWrapper.requestFullScreen){
        canvasWrapper.requestFullScreen();

      } 		
    else if(canvasWrapper.webkitRequestFullScreen)
        canvasWrapper.webkitRequestFullScreen();
    else if(canvasWrapper.mozRequestFullScreen){
        canvasWrapper.mozRequestFullScreen();
        }
			canvasWrapper.width = "1200";
 			canvasWrapper.height = "933";

 		

}

var createNode = function(x, y, control1, control2) {
	if(typeof(control1) != 'object')
		control1 = {
			x: x,
			y: y,
		};
	if(typeof(control2) != 'object')
		control2 = {
			x: x,
			y: y,
		};
	return  {
			x : x,
			y : y,
			controls: [control1, control2],
			lock: true,
		}
};
//for debug
var p = function(text) {
	if(typeof(text) == 'undefined')
		text = 'got it';
	console.log(text);
}
var bezierEditor = function(id) {
	var editor = {
		state: {
			down: false,
			current: null,
			selectedNode: null,
			selectType: null,
			dragMode: 0,
		},
		nodes: [],
		canvas: null,
		pointSize: 8,
		halfPointSize : 0,
		backgroudImage: null,
		ctx : null,
		init : function(id) {
			//history
			window.onpopstate = function(e) {
				if(e.state) {
					editor.nodes = e.state.nodes;
					editor.state = e.state.state;
					editor.draw();
				}
			}
			this.canvas = document.getElementById(id);









			//hook Ctrl+Z and Ctrl+Y of the canvas
			window.onkeypress = function(e) {
				if(e.altKey == true){
					console.log('lol');
				}
				if(e.ctrlKey == true) {
					console.log("ctrl");
					switch(e.keyCode) {
					case 26:	// Ctrl+Z	Undo
						editor.undo();
						break;
					case 25:	// Ctrl+Y	Redo
						editor.redo();
						break;
					case 86:
						console.log(1);
						editor.increaseScreen();
						break;
					}
				}
			}
			function getMousePos(svg, evt) {
  var rect = svg.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}



			this.canvas.onselectstart = function () { return false; }
			this.ctx = this.canvas.getContext("2d");

			this.halfPointSize = this.pointSize / 2;

					var counter = 0;
					var deleteCounter = 0;
			


			this.canvas.onmousedown = function(e) {
				var SettingsObj = JSON.parse(localStorage.getItem('Settings'))  || {
		    	mapColor: "#ffcc80",
		    	mapStrokeColor: "#000000",
		    	mapPointsColor: "#0000ff",
		    	mapPointsBorderColor: "#000000",
		    	mapRouteColor: "#000000",
		    	bodyBackgroundColor: "#f3e5f5",
		    	routeBorderWidth: "4",
		    	pointsRadius: "8"
		    };

					var circles = {
							cx: 0,
							cy: 0,
							r: SettingsObj.pointsRadius,
							id: 0
					};

   		 
				editor.state.down = true;
				if(e.ctrlKey == true) {
					editor.state.dragMode = e.ctrlKey * 2 + e.altKey;
					editor.select(e);
				}

				else if(e.shiftKey == true){
					try{
						var circlesArr = JSON.parse(localStorage.getItem('circlesCoords')) || [];
					}catch(err){

					};
					
					editor.state.down = false;
					var zoom = JSON.parse(localStorage.getItem('zoom'));
					var clickX = 0;
					var	clickY = 0;
					var canvas = document.getElementById("bezier-canvas");
					var svg = document.getElementById("map_bg");
					console.log(svg);

					var pos = getMousePos(svg,e);
					if(zoom || zoom>0){
					clickX = pos.x/zoom; 
					clickY = pos.y/zoom;				
					}
					else{
					clickX = pos.x; 
					clickY = pos.y;
					}

			
						counter++;
					
					circles.cx = clickX;
					circles.cy = clickY;
					var pointDate = new Date();
					circles.time = pointDate.getTime();
					console.log(counter);
					// circles.ex_id = counter;
					circlesArr.push(circles);
					console.log(circlesArr);
					localStorage.setItem('circlesCoords', JSON.stringify(circlesArr));
					console.log(clickX,clickY);

					var r = SettingsObj.pointsRadius;
					var ctx = this.getContext('2d');
					 

  						ctx.beginPath();

  							ctx.fillStyle = SettingsObj.mapPointsColor;


 								 ctx.arc(clickX, clickY, r, 0, 2 * Math.PI);
 								 ctx.lineWidth = 2;
 								 ctx.strokeStyle = SettingsObj.mapPointsBorderColor;
 								 ctx.stroke();
 								 ctx.fill();
 								 console.log(ctx);
				}


				else if (e.altKey == true) {
					
					
					try{
					var circlesArrRemove = JSON.parse(localStorage.getItem('deleteCircles')) || [];
				  }catch(err){};

				    editor.state.down = false;
				    console.log('lol');

				    var circlesToDelete = {
				        cx: 0,
				        cy: 0,
				        r: 8,
				        id: 0
				    };



				    var zoom = JSON.parse(localStorage.getItem('zoom'));
				    var clickX = 0;
				    var clickY = 0;
				    var canvas = document.getElementById("bezier-canvas");
				    var svg = document.getElementById("map_bg");
				    console.log(svg);

				    var pos = getMousePos(svg, e);
				    if (zoom || zoom > 0) {
				        clickX = pos.x / zoom;
				        clickY = pos.y / zoom;
				    } else {
				        clickX = pos.x;
				        clickY = pos.y;
				    }


				    deleteCounter++;

				    circlesToDelete.cx = clickX;
				    circlesToDelete.cy = clickY;
				    console.log(deleteCounter);
				    // circles.id = counter;
				    circlesArrRemove.push(circlesToDelete);
				    console.log(circlesArrRemove);
				    localStorage.setItem('deleteCircles', JSON.stringify(circlesArrRemove));
				    console.log(clickX, clickY);
				    var r = 8;
				    var ctx = this.getContext('2d');

				    ctx.beginPath();
				    ctx.fillStyle = "red";
				    ctx.arc(clickX, clickY, 8, 0, 2 * Math.PI);
				    ctx.fill();
				    console.log(ctx);
				   	editor.draw();

				}



				else {
					var _nodes = editor.nodes;
					
					
					for(var i = 0; i < _nodes.length; ++i) {
						var x = e.offsetX;
						var y =	e.offsetY;

						if(x > _nodes[i].x - editor.halfPointSize && x < _nodes[i].x + editor.halfPointSize && y > _nodes[i].y - editor.halfPointSize && y < _nodes[i].y + editor.halfPointSize) {
							editor.deleteNode(_nodes[i]);
							editor.draw();
							return;
						}
					}

					editor.addNode(e);	
				}
			};
			




			this.canvas.onmousemove = function(e) {
						var x = e.offsetX;
						var y =	e.offsetY;

				if(editor.state.down == true) {
					if(editor.selectedNode)
						editor.cursor("all-scroll");
					switch(editor.state.selectType) {
						case 'node': 
							editor.dragNode(x, y);
							break;
						case 'control0':
							editor.dragControlPoint(x, y, 0);
							break;
						case 'control1':
							editor.dragControlPoint(x, y, 1);
							break;
						default:
							editor.createControlPoint(x, y);
					}
				}

				else {
					var _nodes = editor.nodes;
					for(var i = 0; i < _nodes.length; ++i) {
						var x = e.offsetX;
						var y = e.offsetY;
						if(x > _nodes[i].x - editor.halfPointSize && x < _nodes[i].x + editor.halfPointSize && y > _nodes[i].y - editor.halfPointSize && y < _nodes[i].y + editor.halfPointSize) {
							if(!e.ctrlKey)
								editor.cursor("alias");
							else
								editor.cursor("all-scroll");
								
							return;
						}
					}
					editor.cursor("default");
				}

				if(e.shiftKey == true){
					editor.cursor("url(https://cdn0.iconfinder.com/data/icons/feather/96/circle-add-20.png) 10 10, auto ");
				}
				
				if(e.altKey == true){
					editor.cursor("url(https://cdn0.iconfinder.com/data/icons/feather/96/circle-cross-20.png) 10 10, auto");
				}



			};
			this.canvas.onmouseup = function(e) {
				editor.mouseup(e);
			};
		},
		
		cursor: function(type) {
			this.canvas.style.cursor = type;
		},
		
		loadImage: function(imageURL) {
			// var bgImg = new Image();
			// bgImg.src = imageURL;
			// bgImg.onload = function(){
			// 	this.backgroundImage = bgImg;
			// }
			localStorage.removeItem('imgSize');
			var imgSize = [];
			this.backgroundImage = new Image();
			this.backgroundImage.src = imageURL;
	
			this.draw();
		},
		save: function() {
			history.pushState({nodes:this.nodes,state:this.state}, location.href);
		},

		increaseScreen: function(){
			document.getElementById("bezier-canvas").requestFullscreen();
		},

		undo: function() {
			history.back();
		},
		
		redo: function() {
			history.forward();
		},

		addNode :function(e) {
			var x = e.offsetX;
			var y = e.offsetY;
			var _node = createNode(x, y, {x:x, y:y}, {x:x, y:y});
			this.nodes.push(_node);
			this.state.current = _node;
			this.save();
			this.draw();
		},
		
		deleteNode: function(node) {
			var _nodes = this.nodes;
			for(var i = 0; i < _nodes.length; ++i) {
				if(_nodes[i] === node) {
					if(node === this.state.current)
						this.state.current = null;
					_nodes.splice(i, 1);
					this.draw();
					return;
				}
			}
		},
		
		dragNode: function(x, y) {
			var _node = this.state.selectedNode;
			if(!_node)
				return false;
			var deltaX = x - _node.x;
			var deltaY = y - _node.y;
			_node.controls[0].x += deltaX;
			_node.controls[0].y += deltaY;
			_node.controls[1].x += deltaX;
			_node.controls[1].y += deltaY;
			_node.x = x;
			_node.y = y;
			this.draw();
		},
		dragControlPoint: function(x, y, index) {
			var _node = this.state.selectedNode;
			//Select point
			var a = _node.controls[index];
			//The other point
			var b = _node.controls[1 - index];
			if(this.state.dragMode == 3 ||(this.state.dragMode == 2 && _node.lock)) {
				var angleInit = Math.atan((a.y - _node.y) / (a.x - _node.x));
				var angleA = Math.atan((y - _node.y) / (x - _node.x));
				if(a.x < _node.x)
					angleInit += Math.PI;
				if(x < _node.x)
					angleA += Math.PI;
				var temp = {};
				temp.x = (b.x - _node.x) * Math.cos(angleA - angleInit) - (b.y - _node.y) * Math.sin(angleA - angleInit) + _node.x;
				temp.y = (b.x - _node.x) * Math.sin(angleA - angleInit) + (b.y -_node.y)* Math.cos(angleA - angleInit) + _node.y;
				_node.controls[1 - index] = temp;
			}
			a.x = x;
			a.y = y;
			this.draw();
		},
		createControlPoint: function(x, y) {
			var _node = this.state.current;
			_node.controls[1].x = x;
			_node.controls[1].y = y;
			_node.controls[0].x = 2 * _node.x - x;
			_node.controls[0].y = 2 * _node.y - y;

			this.draw();
		},
		mouseup: function() {
			this.state.down = false;
			if(this.state.dragMode == 1 && this.state.selectedNode)
				this.state.selectedNode.lock = false;
			this.state.dragMode = 0;
			this.state.selectedNode = null;
			this.state.selectType = null;
			this.cursor("default");
		},
		select: function(e) {
			var _nodes = this.nodes;
			for(var i = 0; i < _nodes.length; ++i) {
				var x = e.offsetX;
				var y = e.offsetY;
				if(x > _nodes[i].x - this.halfPointSize && x < _nodes[i].x + this.halfPointSize && y > _nodes[i].y - this.halfPointSize && y < _nodes[i].y + this.halfPointSize) {
					this.cursor("all-scroll");
					this.state.selectedNode = _nodes[i];
					this.state.selectType = 'node';
					this.draw();
					return true;
				}
			}
			for(var i = 0; i < _nodes.length; ++i) {
				var x = e.offsetX;
				var y = e.offsetY;
				if(x > _nodes[i].controls[0].x - this.halfPointSize && x < _nodes[i].controls[0].x + this.halfPointSize 
				&& y > _nodes[i].controls[0].y - this.halfPointSize && y < _nodes[i].controls[0].y + this.halfPointSize) {
					this.cursor("all-scroll");
					this.state.selectedNode = _nodes[i];
					this.state.selectType = 'control0';
					this.draw();
					return true;
				}
				if(x > _nodes[i].controls[1].x - this.halfPointSize && x < _nodes[i].controls[1].x + this.halfPointSize 
				&& y > _nodes[i].controls[1].y - this.halfPointSize && y < _nodes[i].controls[1].y + this.halfPointSize) {
					this.cursor("all-scroll");
					this.state.selectedNode = _nodes[i];
					this.state.selectType = 'control1';
					this.draw();
					return true;
				}
			}
			this.state.selectedNode = null;
			this.state.selectType = null;
			return false;
		},
		draw : function() {
			var SettingsObj = JSON.parse(localStorage.getItem('Settings'))  || {
    	mapColor: "#ffcc80",
    	mapStrokeColor: "#000000",
    	mapPointsColor: "#0000ff",
    	mapPointsBorderColor: "#000000",
    	mapRouteColor: "#000000",
    	bodyBackgroundColor: "#f3e5f5",
    	routeBorderWidth: "4",
    	pointsRadius: "8"
    };
			var _ctx = this.ctx;
			_ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
			_ctx.save();


			if(this.backgroundImage)
				_ctx.drawImage(this.backgroundImage, 0, 0);
			_ctx.save();
			_ctx.strokeStyle="transparent";
			_ctx.beginPath();
			_ctx.moveTo(0,0);
			_ctx.lineTo(640,0);
			_ctx.lineTo(640,480);
			_ctx.lineTo(0,480);
			_ctx.lineTo(0,0);
			_ctx.stroke();
			_ctx.strokeStyle="#00FF00";
			var nodes = this.nodes;
			if(this.state.current) {
				_ctx.beginPath();
				_ctx.moveTo(this.state.current.x, this.state.current.y);
				_ctx.lineTo(this.state.current.controls[0].x, this.state.current.controls[0].y);
				_ctx.moveTo(this.state.current.x, this.state.current.y);
				_ctx.lineTo(this.state.current.controls[1].x, this.state.current.controls[1].y);
				_ctx.stroke();
				_ctx.fillStyle="#FFFF00";
				_ctx.fillRect(this.state.current.controls[0].x-this.halfPointSize, this.state.current.controls[0].y-this.halfPointSize, this.pointSize, this.pointSize);
				_ctx.fillRect(this.state.current.controls[1].x-this.halfPointSize, this.state.current.controls[1].y-this.halfPointSize, this.pointSize, this.pointSize);
			}
			_ctx.save();
			

			_ctx.fillStyle="#FFFF00";
			for(var i = 0; i < nodes.length; ++i) {
				_ctx.fillRect(nodes[i].x-this.halfPointSize, nodes[i].y-this.halfPointSize, this.pointSize, this.pointSize);
			
			}
			if(this.state.selectedNode != null) {
				_ctx.fillStyle="#000";
				_ctx.beginPath();
				_ctx.arc(this.state.selectedNode.controls[0].x, this.state.selectedNode.controls[0].y, this.halfPointSize, 0, 2 * Math.PI, true);
				_ctx.closePath();
				_ctx.fill();
				_ctx.beginPath();
				_ctx.arc(this.state.selectedNode.controls[1].x, this.state.selectedNode.controls[1].y, this.halfPointSize, 0, 2 * Math.PI, true);
				_ctx.closePath();
				_ctx.fill();
				_ctx.beginPath();
				_ctx.fillRect(this.state.selectedNode.x-this.halfPointSize, this.state.selectedNode.y-this.halfPointSize, this.pointSize, this.pointSize);
				_ctx.moveTo(this.state.selectedNode.x, this.state.selectedNode.y);
				_ctx.lineTo(this.state.selectedNode.controls[0].x, this.state.selectedNode.controls[0].y);
				_ctx.moveTo(this.state.selectedNode.x, this.state.selectedNode.y);
				_ctx.lineTo(this.state.selectedNode.controls[1].x, this.state.selectedNode.controls[1].y);
				_ctx.stroke();
			}
			_ctx.strokeStyle=SettingsObj.mapRouteColor;

			if(nodes.length > 1)
				for(var i = 0; i < nodes.length - 1; ++i) {
					_ctx.beginPath();
					_ctx.moveTo(nodes[i].x, nodes[i].y);
					_ctx.bezierCurveTo(nodes[i].controls[1].x, nodes[i].controls[1].y, nodes[i + 1].controls[0].x, nodes[i + 1].controls[0].y, nodes[i + 1].x, nodes[i + 1].y);
					_ctx.stroke();
				}
			_ctx.strokeStyle= SettingsObj.mapRouteColor;
				// 		for(var i = 0; i < this.nodes.length - 1; ++i) {
				// var n1 = this.nodes[i];
				// var n2 = this.nodes[i + 1];
				// var p1 = [n1.x, n1.y];
				// var p2 = [n1.controls[1].x, n1.controls[1].y];
				// var p3 = [n2.controls[0].x, n2.controls[0].y];
				// var p4 = [n2.x, n2.y];
				var SavedMapLines = JSON.parse(localStorage.getItem('SavedCurves'));
				if(SavedMapLines){

				for(var i = 0; i < SavedMapLines.length; ++i) {
					_ctx.beginPath();
					_ctx.moveTo(SavedMapLines[i].p1[0], SavedMapLines[i].p1[1]);
					_ctx.bezierCurveTo(SavedMapLines[i].p2[0], SavedMapLines[i].p2[1], SavedMapLines[i].p3[0], SavedMapLines[i].p3[1], SavedMapLines[i].p4[0], SavedMapLines[i].p4[1]);
					_ctx.stroke();
				}
					_ctx.strokeStyle = SettingsObj.mapRouteColor;


				}



			var savedMapCoords = JSON.parse(localStorage.getItem('circlesCoords')) || [];
			var deleteMapCoords = JSON.parse(localStorage.getItem('deleteCircles')) || [];

			if(savedMapCoords.length > 0){
					for(var i=0; i<savedMapCoords.length; i++){

						for(var j = 0; j< deleteMapCoords.length; j++){
							if(Math.abs(Math.round(savedMapCoords[i].cx - deleteMapCoords[j].cx)) <= 8 && Math.abs(Math.round(savedMapCoords[i].cy - deleteMapCoords[j].cy)) <= 8){
								savedMapCoords.splice(i,1);
							}

						}

					}
					console.log(savedMapCoords);
}

				deleteMapCoords.length = null;
				localStorage.setItem('deleteCircles', JSON.stringify(deleteMapCoords));
				localStorage.setItem('circlesCoords', JSON.stringify(savedMapCoords));




			for(var i=0;i<savedMapCoords.length;i++){
			if(savedMapCoords){
  						_ctx.beginPath();
  						_ctx.fillStyle = SettingsObj.mapPointsColor;

 								_ctx.arc(savedMapCoords[i].cx, savedMapCoords[i].cy, SettingsObj.pointsRadius, 0, 2 * Math.PI);

 								 _ctx.fill();
 								 _ctx.strokeStyle =  SettingsObj.mapPointsBorderColor;
 								 _ctx.stroke();



 										 
			}
			}




		},
		
		getLength: function() {
			var coefficient = function(t) {
				return {
					f1: t*t*t,
					f2: 3*t*t*(1-t),
					f3: 3*t*(1-t)*(1-t),
					f4: (1-t)*(1-t)*(1-t),
				}
			};
			var length = function(a, b) {
				return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
			};
			var total = 0;
			var lengths = [];
			for(var i = 0; i < this.nodes.length - 1; ++i) {
				var n1 = this.nodes[i];
				var n2 = this.nodes[i + 1];
				var p1 = [n1.x, n1.y];
				var p2 = [n1.controls[1].x, n1.controls[1].y];
				var p3 = [n2.controls[0].x, n2.controls[0].y];
				var p4 = [n2.x, n2.y];
				var lastPoint = [n1.x, n1.y];
				var totalLength = 0;
				for(var j = 0; j < 1; j+=0.01) {
					var c = coefficient(j);
					var point = [0, 0];
					point[0] = p1[0] * c.f1 + p2[0] * c.f2 + p3[0] * c.f3 + p4[0] * c.f4;
					point[1] = p1[1] * c.f1 + p2[1] * c.f2 + p3[1] * c.f3 + p4[1] * c.f4;
					totalLength += length(lastPoint, point);
					lastPoint = point;
				}
				lengths.push(totalLength);
				total += totalLength;
			}
			var result = [];
			for(var i = 0; i < this.nodes.length - 1; ++i) {
				result.push(lengths[i] / total);
			}
			return result;
		},
		exportBezier: function() {
			var ArrLines = [];
			
			var string = "M";
			var SavedLines = '';
			var result = this.getLength();
			for(var i = 0; i < this.nodes.length - 1; ++i) {
				var n1 = this.nodes[i];
				var n2 = this.nodes[i + 1];
				var p1 = [n1.x, n1.y];
				var p2 = [n1.controls[1].x, n1.controls[1].y];
				var p3 = [n2.controls[0].x, n2.controls[0].y];
				var p4 = [n2.x, n2.y];

				var LineObj = {};

						LineObj.p1 = p1;
						LineObj.p2 = p2;
						LineObj.p3 = p3;
						LineObj.p4 = p4;
						ArrLines.push(LineObj);


					string += ' ' + p1[0] + ', ' + p1[1] + ' C'  +
					' '+p2[0]+', '+p2[1]+', ' +
					+p3[0]+', '+p3[1]+', '+
					''+p4[0]+', '+p4[1]+' T';

			}
			
			return	string;
		},
		ReturnSavedPath: function(){
			var ArrLines = JSON.parse(localStorage.getItem('SavedCurves')) || [];
			var SavedLines = "";
			var result = this.getLength();
			for(var i = 0; i < this.nodes.length - 1; ++i) {
				var n1 = this.nodes[i];
				var n2 = this.nodes[i + 1];
				var p1 = [n1.x, n1.y];
				var p2 = [n1.controls[1].x, n1.controls[1].y];
				var p3 = [n2.controls[0].x, n2.controls[0].y];
				var p4 = [n2.x, n2.y];

						var LineObj = {};
						LineObj.p1 = p1;
						LineObj.p2 = p2;
						LineObj.p3 = p3;
						LineObj.p4 = p4;
						ArrLines.push(LineObj);
						SavedLines += ' ' + p1[0] + ', ' + p1[1] + ' C'  +
					' '+p2[0]+', '+p2[1]+', ' +
					+p3[0]+', '+p3[1]+', '+
					''+p4[0]+', '+p4[1]+' T';
			}
				localStorage.setItem('SavedSvgPath', JSON.stringify(SavedLines));

			return	ArrLines;
		},


		clearBezier: function(){
			var _ctx = this.ctx;
			editor.nodes = [];
			_ctx.clearRect(0, 0, editor.width, editor.height)
			console.log(_ctx);
			console.log(editor);

			return editor;


		},
		


	};
	editor.init(id);
	return editor;

}
