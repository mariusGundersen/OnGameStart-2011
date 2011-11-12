Demo.event.onGameStart = function(e){
	camera.screen.fillStyle = "red";
	render(world, camera);
};

function render(world, camera){
	for(var i=0; i<world.vertices.length; i++){
		var vertex = world.vertices[i];
		var scale = camera.depth / vertex.z;
		var posX = scale * vertex.x + camera.offsetX;
		var posY = scale * vertex.y + camera.offsetY;
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
		
	]
};

var camera = {
	depth: 350,
	screen: Demo.ctx,
	width: Demo.canvas.width,
	height: Demo.canvas.height,
	offsetX: Demo.canvas.width/2,
	offsetY: Demo.canvas.height/2
}

