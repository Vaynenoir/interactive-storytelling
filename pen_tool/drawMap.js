$(document).ready(function(){

var a = document.getElementById('map');
	  var map_url = JSON.parse(localStorage.getItem('map'));
    $('#map').attr('data', map_url);
a.addEventListener("load",function(){
	  var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg
    var svgRoot  = svgDoc.documentElement;
    var PathDirection = JSON.parse(localStorage.getItem('path'));
   		//now we can query stuff with jquery like this
      //note that we pass in the svgRoot as the context node!
    $("foo bar",svgRoot);
    console.log(svgRoot);

	if(PathDirection.length){
		var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		$(path).attr('d', PathDirection);
		$(path).attr('fill', 'transparent');
		$(path).attr('stroke', '#000');
		console.log(path);
	}

svgRoot.append(path);


},false);
  

});