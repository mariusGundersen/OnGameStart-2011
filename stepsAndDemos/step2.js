Demo.event.onEnterFrame = function(t){
	camera.screen.clearRect(0, 0, camera.width, camera.height);
	camera.screen.fillStyle = "red";
	
	camera.x += (Demo.key.isDown(39) - Demo.key.isDown(37))*5;
	camera.y += (Demo.key.isDown(40) - Demo.key.isDown(38))*5;
	camera.z += (Demo.key.isDown(32) - Demo.key.isDown(13))*5;
	
	render(world, camera);
};
Demo.event.onGameStart = function(e){
	Demo.key.init(	37,//left
			38,//up
			39,//right
			40,//down
			32,//space
			13);//enter
			
};


function render(world, camera){
	for(var i=0; i<world.vertices.length; i++){
		var vertex = world.vertices[i];
		
		var dx = vertex.x - camera.x;
		var dy = vertex.y - camera.y;
		var dz = vertex.z - camera.z;
	
	
		var scale = camera.depth / dz;	
		var posX = scale * dx + camera.offsetX;
		var posY = scale * dy + camera.offsetY;
		var size = scale * 10;
	
		camera.screen.fillRect(posX - size / 2, posY - size / 2, size, size);
	}
}

var world = {
	vertices:[
		{x:100, y:100, z: 500},
		{x:-100, y:100, z: 500},
		{x:-100, y:-100, z: 500},
		{x:100, y:-100, z: 500},
		{x:100, y:100, z: 300},
		{x:-100, y:100, z: 300},
		{x:-100, y:-100, z: 300},
		{x:100, y:-100, z: 300},
		
		
		{x:100, y:100, z: 900},
		{x:-100, y:100, z: 900},
		{x:-100, y:-100, z: 900},
		{x:100, y:-100, z: 900},
		{x:100, y:100, z: 1000},
		{x:-100, y:100, z: 1000},
		{x:-100, y:-100, z: 1000},
		{x:100, y:-100, z: 1000},
		
	]
};

var camera = {
	x: 0,
	y: 0,
	z: 0,
	depth: 350,
	screen: Demo.ctx,
	width: Demo.canvas.width,
	height: Demo.canvas.height,
	offsetX: Demo.canvas.width/2,
	offsetY: Demo.canvas.height/2
}

