$(document).ready(function(){
console.log(1);
var PathDirection = JSON.parse(localStorage.getItem('path'));

if(PathDirection.length){
	var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	$(path).attr('d', PathDirection);
	$(path).attr('fill', 'transparent');
	$(path).attr('stroke', '#000');
	console.log(path);
 	
}
$('.svg_bg').append(path);
});