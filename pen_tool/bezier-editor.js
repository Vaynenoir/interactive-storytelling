
$(document).ready(function(){
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
    var canvas = document.getElementById("bezier-canvas");
    if(canvas.requestFullScreen)
        canvas.requestFullScreen(); 		
    else if(canvas.webkitRequestFullScreen)
        canvas.webkitRequestFullScreen();
    else if(canvas.mozRequestFullScreen){
        canvas.mozRequestFullScreen();
        }
 				
			canvas.width = "1200";
 			canvas.height = "933";
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
				if(e.ctrlKey == true) {
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
// function getZoomCompensatedBoundingRect(fabricObject){

//   //fabricObject is the object you want to get the boundingRect from
//   var canvas = document.getElementById('bezier-canvas');
//   fabricObject.setCoords();
//   var boundingRect = fabricObject.getBoundingRect();
  
//   var viewportMatrix = canvas.viewportTransform;
  
//   //there is a bug in fabric that causes bounding rects to not be transformed by viewport matrix
//   //this code should compensate for the bug for now
  
//   boundingRect.top = (boundingRect.top - viewportMatrix[5]) / zoom;
//   boundingRect.left = (boundingRect.left - viewportMatrix[4]) / zoom;
//   boundingRect.width /= zoom;
//   boundingRect.height /= zoom;
  
//   return boundingRect;

// }


			/* Fix the drag cursor bug. When selection start, cursor will be set to "text"*/
			this.canvas.onselectstart = function () { return false; }
			this.ctx = this.canvas.getContext("2d");
			// var Transform = require('canvas-get-transform');
			this.halfPointSize = this.pointSize / 2;

					var circlesArr = [];
			this.canvas.onmousedown = function(e) {
																var circles = {
							cx: 0,
							cy: 0,
							r: 8
					};
				editor.state.down = true;
				if(e.ctrlKey == true || e.altKey == true) {
					editor.state.dragMode = e.ctrlKey * 2 + e.altKey;
					editor.select(e);
				}

				else if(e.altKey == true || e.shiftKey == true){

						var zoom = JSON.parse(localStorage.getItem('zoom'));
					var clickX = 0;
					var	clickY = 0;
					var canvas = document.getElementById("bezier-canvas");
					var svg = document.getElementById("map_bg");
					console.log(svg);
					var pos = getMousePos(svg,e);
					if(zoom){
					clickX = pos.x/zoom; 
					clickY = pos.y/zoom;				
					}
					else{
					clickX = pos.x; 
					clickY = pos.y;
					}
					circles.cx = clickX;
					circles.cy = clickY;
					circlesArr.push(circles);
					console.log(circlesArr);
					localStorage.setItem('circlesCoords', JSON.stringify(circlesArr));
					console.log(clickX,clickY);
					var r = 8;
					var ctx = this.getContext('2d');
					 ctx.fillStyle = "#2980b9";
  						ctx.beginPath();
 								 ctx.arc(clickX, clickY, 8, 0, 2 * Math.PI);
 										 ctx.fill();
 										 console.log(ctx);
				}
				else {
					var _nodes = editor.nodes;
					
					
					for(var i = 0; i < _nodes.length; ++i) {
						// var scale = this.ctx.currentTransform;
						// var curX = scale.e;
						// var curY = scale.f;
						// var deltaX = pt.x - dragStart.x;
						// var deltaY = pt.y - dragStart.y;
						// var $editorOffset = this.canvas.offset();
						var x = e.offsetX;
						var y =	e.offsetY;
						// var ZoomedX = e.clientX;
						// var ZoomedY = e.clientY;
						// if(global.zoom.scale > 1){
						// 	x = (x-ZoomedX)/global.zoom.scale;
						// 	y = (y-ZoomedY)/global.zoom.scale;
						// }
						// x= ZoomedX + x;
						// y = ZoomedY + y;
						
						if(x > _nodes[i].x - editor.halfPointSize && x < _nodes[i].x + editor.halfPointSize && y > _nodes[i].y - editor.halfPointSize && y < _nodes[i].y + editor.halfPointSize) {
							editor.deleteNode(_nodes[i]);
							editor.draw();
							return;
						}
					}
					// console.log('x: '+ x, 'y: ' + y);
					// console.log('zoomedX: ' + ZoomedX, 'zoomedY: ' + ZoomedY);

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
			
			// for(var i = 0; i < nodes.length; ++i) {
				// _ctx.beginPath();
				// _ctx.moveTo(nodes[i].x, nodes[i].y);
				// _ctx.lineTo(nodes[i].controls[0].x, nodes[i].controls[0].y);
				// _ctx.moveTo(nodes[i].x, nodes[i].y);
				// _ctx.lineTo(nodes[i].controls[1].x, nodes[i].controls[1].y);
				// _ctx.stroke();
			// }
			_ctx.fillStyle="#FFFF00";
			for(var i = 0; i < nodes.length; ++i) {
				_ctx.fillRect(nodes[i].x-this.halfPointSize, nodes[i].y-this.halfPointSize, this.pointSize, this.pointSize);
				//_ctx.fillRect(nodes[i].controls[0].x-this.halfPointSize, nodes[i].controls[0].y-this.halfPointSize, this.pointSize, this.pointSize);
				//_ctx.fillRect(nodes[i].controls[1].x-this.halfPointSize, nodes[i].controls[1].y-this.halfPointSize, this.pointSize, this.pointSize);
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
			_ctx.strokeStyle="#FF0000";

			if(nodes.length > 1)
				for(var i = 0; i < nodes.length - 1; ++i) {
					_ctx.beginPath();
					_ctx.moveTo(nodes[i].x, nodes[i].y);
					_ctx.bezierCurveTo(nodes[i].controls[1].x, nodes[i].controls[1].y, nodes[i + 1].controls[0].x, nodes[i + 1].controls[0].y, nodes[i + 1].x, nodes[i + 1].y);
					_ctx.stroke();
				}
			_ctx.strokeStyle="#00FF00";
			// if(this.fakeNode && this.state.down == false) {
				// var _lastIndex = nodes.length - 1;
				// _ctx.beginPath();
				// _ctx.moveTo(nodes[_lastIndex].x, nodes[_lastIndex].y);
				// _ctx.bezierCurveTo(nodes[_lastIndex].controls[1].x, nodes[_lastIndex].controls[1].y, this.fakeNode.x, this.fakeNode.y, this.fakeNode.x, this.fakeNode.y);
				// _ctx.stroke();
			// }

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
		exportBezier: function(time) {
			var exportString = ".stop()";
			var string = "M";
			var result = this.getLength();
			for(var i = 0; i < this.nodes.length - 1; ++i) {
				var n1 = this.nodes[i];
				var n2 = this.nodes[i + 1];
				var p1 = [n1.x, n1.y];
				var p2 = [n1.controls[1].x, n1.controls[1].y];
				var p3 = [n2.controls[0].x, n2.controls[0].y];
				var p4 = [n2.x, n2.y];
				exportString += '.animate({path:new bezier({start: [' + p1[0] + ', ' + p1[1] + '],' +
					'c1:['+p2[0]+', '+p2[1]+'],'+
					'end: ['+p4[0]+','+p4[1]+'],'+
					'c2:['+p3[0]+', '+p3[1]+'],})}, ' + result[i] * time + ' ,"linear")';



					string += ' ' + p1[0] + ', ' + p1[1] + ' C'  +
					' '+p2[0]+', '+p2[1]+', ' +
					+p3[0]+', '+p3[1]+', '+
					''+p4[0]+', '+p4[1]+' T';

			}
			localStorage.setItem('path', JSON.stringify(string));
			return	string;
		},
		// drawZoom: function(scale, translatePos){
		// 	var context = this.ctx;
		// 	context.translate(translatePos.x, translatePos.y);
		// 	context.scale(scale, scale);
		// 	context.restore();

		// },
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
