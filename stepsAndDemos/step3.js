Demo.event.onEnterFrame = function(t){
	camera.screen.clearRect(0, 0, camera.width, camera.height);
	camera.screen.fillStyle = "red";
	
	camera.ry += (Demo.key.isDown(39) - Demo.key.isDown(37))/40;
	camera.rz += (Demo.key.isDown(40) - Demo.key.isDown(38))/40;
	camera.rx += (Demo.key.isDown(32) - Demo.key.isDown(13))/40;
	
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
		
		var d1x = Math.cos(camera.ry)*dx + Math.sin(camera.ry)*dz;
		var d1y = dy;
		var d1z = Math.cos(camera.ry)*dz - Math.sin(camera.ry)*dx;
		
		var d2x = d1x;
		var d2y = Math.cos(camera.rx)*d1y - Math.sin(camera.rx)*d1z;
		var d2z = Math.cos(camera.rx)*d1z + Math.sin(camera.rx)*d1y;
		
		var d3x = Math.cos(camera.rz)*d2x + Math.sin(camera.rz)*d2y;
		var d3y = Math.cos(camera.rz)*d2y - Math.sin(camera.rz)*d2x;
		var d3z = d2z;
		
		if(d3z > 0){
		
			var scale = camera.depth / d3z;	
			var posX = scale * d3x + camera.offsetX;
			var posY = scale * d3y + camera.offsetY;
			var size = scale * 10;
		
			camera.screen.fillRect(posX - size / 2, posY - size / 2, size, size);
		}
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
		
		{x:100, y:100, z: -500},
		{x:-100, y:100, z: -500},
		{x:-100, y:-100, z: -500},
		{x:100, y:-100, z: -500},
		{x:100, y:100, z: -300},
		{x:-100, y:100, z: -300},
		{x:-100, y:-100, z: -300},
		{x:100, y:-100, z: -300},
		
		{x:500, y:100, z: 100},
		{x:300, y:100, z: 100},
		{x:300, y:-100, z: 100},
		{x:500, y:-100, z: 100},
		{x:500, y:100, z: -100},
		{x:300, y:100, z: -100},
		{x:300, y:-100, z: -100},
		{x:500, y:-100, z: -100},
		
		{x:-500, y:100, z: 100},
		{x:-300, y:100, z: 100},
		{x:-300, y:-100, z: 100},
		{x:-500, y:-100, z: 100},
		{x:-500, y:100, z: -100},
		{x:-300, y:100, z: -100},
		{x:-300, y:-100, z: -100},
		{x:-500, y:-100, z: -100},
		
	]
};

var camera = {
	x: 0,
	y: 0,
	z: 0,
	rx: 0,
	ry: 0,
	rz: 0,
	depth: 350,
	screen: Demo.ctx,
	width: Demo.canvas.width,
	height: Demo.canvas.height,
	offsetX: Demo.canvas.width/2,
	offsetY: Demo.canvas.height/2
}

