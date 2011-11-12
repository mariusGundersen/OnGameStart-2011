var Demo = {};
Demo.canvas = document.getElementById("c");
Demo.ctx = Demo.canvas.getContext("2d");

Demo.key = {};
Demo.key.keys = [];

Demo.mouse = {};
Demo.mouse.isDown = false;
Demo.mouse.x = 0;
Demo.mouse.y = 0;
Demo.mouse.z = 0;

Demo.rawEvent = {};
Demo.rawEvent.onLoad = function(e){
	

	window.addEventListener("keydown", Demo.rawEvent.onKeyDown, false);
	window.addEventListener("keyup", Demo.rawEvent.onKeyUp, false);
	document.addEventListener("mousemove", Demo.rawEvent.onMouseMove, false);
	document.addEventListener("mousedown", Demo.rawEvent.onMouseDown, false);
	document.addEventListener("mouseup", Demo.rawEvent.onMouseUp, false);
	document.addEventListener("mousewheel", Demo.rawEvent.onMouseScroll, false);
	document.addEventListener("DOMMouseScroll", Demo.rawEvent.onMouseScroll, false);
	window.addEventListener("hashchange", Demo.rawEvent.onHashChange, false);
	
	Demo.rawEvent.onHashChange();
	Demo.startAnimation();
};
Demo.rawEvent.onHashChange = function(e){
	Demo.key.keys = [];


	var file = document.location.hash.substr(1);
	console.log("hashChange: "+file);
	if(file === ""){
		file = "step1";
	}
	var elm = document.getElementById("demoJS");
	if(elm){
		elm.parentNode.removeChild(elm);
	}
	elm = document.createElement("script");
	elm.src = "stepsAndDemos/"+file+".js";
	elm.id = "demoJS";
	elm.onload = Demo.rawEvent.onGameStart;
	document.body.appendChild(elm);
};

Demo.rawEvent.onGameStart = function(e){
	if(Demo.event.onGameStart){
		Demo.event.onGameStart();
	}
};

Demo.rawEvent.onKeyDown = function(e){

	var key = e.keyCode || e.which;
	
	if(key in Demo.key.keys){
		Demo.key.keys[key] = 1;
		e.preventDefault();
		return false;
	}else if(Demo.event.onKeyDown){
		return Demo.event.onKeyDown(e);
	}else{
		return true;
	}	
};
Demo.rawEvent.onKeyUp = function(e){
	var key = e.keyCode || e.which;
	
	if(key in Demo.key.keys){
		Demo.key.keys[key] = 0;
		e.preventDefault();
		return false;
	}else if(Demo.event.onKeyUp){
		return Demo.event.onKeyUp(e);
	}else{
		return true;
	}	
};
Demo.rawEvent.onMouseMove = function(e){

	Demo.mouse.x = e.layerX;
	Demo.mouse.y = e.layerY;
	if(Demo.event.onMouseMove){
		return Demo.event.onMouseMove(e);
	}else{
		e.preventDefault();
		return false;
	}	
};
Demo.rawEvent.onMouseDown = function(e){

	Demo.mouse.isDown = true;
	if(Demo.event.onMouseDown){
		return Demo.event.onMouseDown(e);
	}else{
		e.preventDefault();
		return false;
	}	
};
Demo.rawEvent.onMouseUp = function(e){

	Demo.mouse.isDown = false;;
	if(Demo.event.onMouseUp){
		return Demo.event.onMouseUp(e);
	}else{
		e.preventDefault();
		return false;
	}	
};
Demo.rawEvent.onMouseScroll = function(e){
	var delta = e.wheelDelta || e.detail || 0;
	Demo.mouse.z += delta == 0 ? 0 : Math.abs(delta)/delta;
	if(Demo.event.onMouseScroll){
		return Demo.event.onMouseScroll(e);
	}else{
		e.preventDefault();
		return false;
	}	
};

Demo.event = {};


Demo.key.init = function(keys){
	for(var i=0; i<arguments.length; i++){
		Demo.key.keys[arguments[i]] = 0;
	}
}

Demo.key.isDown = function(key){
	return Demo.key.keys[key] === 1 ? 1 : 0;
};


Demo.startAnimation = function(){
	
	var requestFrame = (function(){
		return window.requestAnimationFrame	|| 
		window.webkitRequestAnimationFrame	|| 
		window.mozRequestAnimationFrame		|| 
		window.oRequestAnimationFrame		|| 
		window.msRequestAnimationFrame		|| 
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	var lastFrameTime = +new Date();
	var frameRequested = function(t){
		if(Demo.event.onEnterFrame){
			Demo.event.onEnterFrame(t-lastFrameTime);
		}
		requestFrame(frameRequested);
		lastFrameTime = t;
	};
	requestFrame(frameRequested);

};
(function(){
		
	})();

window.addEventListener("load", Demo.rawEvent.onLoad, true);
