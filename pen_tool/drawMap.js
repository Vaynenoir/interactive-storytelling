$(document).ready(function(){
console.log(1);
var PathDirection = JSON.parse(localStorage.getItem('path'));
var BgMap = JSON.parse(localStorage.getItem('map'));
var element = document.getElementById('map');
var docContent = element.contentDocument;
var svgRoot  	= docContent.documentElement;
var svg = docContent.getElementById('Layer_1');
console.log(docContent);
//if(BgMap){
	console.log(BgMap);

var map_url = "maps/armeniaHigh_path.svg";

	$('#CurrentMap').find('g').load(map_url);
	// $('#map').attr("data", BgMap);
	// $('#map').attr("width", BgMap.width);
	// $('#map').attr("height", BgMap.height);
//}
// if(PathDirection.length){
	var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	$(path).attr('d', PathDirection);
	$(path).attr('fill', 'transparent');
	$(path).attr('stroke', '#000');
	console.log(path);
 	
// }
// console.log(svg);
$("#CurrentMap").append(path);
});