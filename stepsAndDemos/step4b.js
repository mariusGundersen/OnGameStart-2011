Demo.event.onEnterFrame = function(t){
	camera.screen.clearRect(0, 0, camera.width, camera.height);
	camera.screen.fillStyle = "red";
	
	camera.ry = -(Demo.mouse.x/camera.width - 0.5)*Math.PI*2;
	
	camera.x = Math.sin(camera.ry)*300;
	camera.z = -Math.cos(camera.ry)*300;
	
	render(world, camera);
};
Demo.event.onGameStart = function(e){			
	
};


function render(world, camera){
	var toDraw = [];

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
			var width = scale * sprite.width;
			var height = scale * sprite.height;
			
			toDraw.push({
				posX: posX - width / 2,
				posY: posY - height / 2,
				posZ: scale,
				width: width,
				height: height				
			});
		
			
		}
	}
	toDraw.sort(function(a, b){
		return a.posZ - b.posZ;
	});
	
	for(var i=0; i<toDraw.length; i++){
		var item = toDraw[i];
		camera.screen.drawImage(sprite, 
			0, 0, sprite.width, sprite.height, 
			item.posX, item.posY, item.width, item.height);
	}
}

var sprite = new Image();
sprite.src = "gfx/tree.png";

var world = {
	vertices:[
		{x:-100, y:20, z: -100},
		{x:100, y:20, z: -100},
		{x:-100, y:20, z: 100},
		{x:100, y:20, z: 100},
	]
};

var camera = {
	x: 0,
	y: 0,
	z: 400,
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

