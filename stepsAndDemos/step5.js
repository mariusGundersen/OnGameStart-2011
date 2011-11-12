Demo.event.onEnterFrame = function(t){
	camera.screen.clearRect(0, 0, camera.width, camera.height);
	camera.screen.fillStyle = "red";
	
	camera.ry = (Demo.mouse.x/camera.width - 0.5)*Math.PI*2;
	
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
			var width = scale * vertex.sprite.w;
			var height = scale * vertex.sprite.h;
			
			toDraw.push({
				posX: posX - width / 2,
				posY: posY - height / 2,
				posZ: scale,
				width: width,
				height: height,
				sprite: vertex.sprite,
				ry: camera.ry - vertex.ry,
			});
		
			
		}
	}
	toDraw.sort(function(a, b){
		return a.posZ - b.posZ;
	});
	
	for(var i=0; i<toDraw.length; i++){
		var item = toDraw[i];
		var angle = (item.ry)%(Math.PI*2);
		while(angle < 0) angle += Math.PI*2;
		var ratio = angle / (Math.PI*2) * sprite.width;
		var x = (Math.round(ratio / item.sprite.w)*item.sprite.w) % sprite.width;
		camera.screen.drawImage(sprite, 
			x, item.sprite.y, item.sprite.w, item.sprite.h, 
			item.posX, item.posY, item.width, item.height);
	}
}

var sprite = new Image();
sprite.src = "gfx/spritesheet.png";

var world = {
	vertices:[
		{x:-140, y:20, z: 0, ry:Math.PI*0, sprite:{
			w:48,
			h:48,
			y:0
		}},
		{x:140, y:20, z: 0, ry:Math.PI*1, sprite:{
			w:48,
			h:48,
			y:48
		}},
		{x:0, y:20, z: 140, ry:Math.PI*1.5, sprite:{
			w:48,
			h:48,
			y:96
		}},
		{x:0, y:20, z: -140, ry:Math.PI*0.5, sprite:{
			w:48,
			h:48,
			y:144
		}},
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

