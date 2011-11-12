Demo.event.onEnterFrame = function(t){
	camera.screen.clearRect(0, 0, camera.width, camera.height);
	camera.screen.strokeStyle = "red";
	
	camera.ry = -(Demo.mouse.x/camera.width - 0.5)*Math.PI*2;
	camera.rx = (Demo.mouse.y/camera.height)*Math.PI/2;
	
	camera.y = -Math.sin(camera.rx)*Math.pow(1.1, Demo.mouse.z) - 100;
	ryRadius = Math.cos(camera.rx)*Math.pow(1.1, Demo.mouse.z);
	
	camera.x = Math.sin(camera.ry)*ryRadius;
	camera.z = -Math.cos(camera.ry)*ryRadius;
	
	render(world, camera);
};
Demo.event.onGameStart = function(e){	
	Demo.mouse.z = 60;
	var w = 50;
	var l = 40;
	var xpos = 0;
	var zpos = 0;
	var th = Math.sqrt(0.75);
	var p = 0;
	for(var x=0; x<w; x++){
		for(var z=0; z<w; z++){
			xpos = l*(x*th - w/2);
			zpos = l*(z + (x%2)/2 - w/2);
			p = world.vertices.length;
			world.vertices.push({x:xpos, y:0, z:zpos});
			if(z>0){
				if(z < w-1 || x%2 == 0){
					world.lines.push({p1:p-1, p2:p});
				}
				if(x%2 == 1){
					world.lines.push({p1:p-w, p2:p-1});
					world.lines.push({p1:p-w-1, p2:p-1});
				}else if(x%2 == 0 && x>0){
					world.lines.push({p1:p-w-1, p2:p-1});
					world.lines.push({p1:p-w-1, p2:p});
				}
			}
		}
	}
	for(var i=0; i<world.lines.length; i++){
		var line = world.lines[i];
		line.p1 = world.vertices[line.p1];
		line.p2 = world.vertices[line.p2];
	}
	var mapImg = new Image();
	mapImg.src = "gfx/heightmap4.jpg";
	mapImg.onload = function(e){
		console.log("imageLoaded");
		var mapC = document.createElement("canvas");
		mapC.width = w;
		mapC.height = w;
		var ctx = mapC.getContext("2d");
		ctx.drawImage(mapImg, 0, 0, mapImg.width, mapImg.height, 0, 0, w, w);
		var map = ctx.getImageData(0, 0, w, w);
		for(var i=0; i<map.data.length; i+=4){
			world.vertices[i/4].y = -map.data[i];
		}
		
	}
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
		
	
		var scale = camera.depth / d3z;	
		vertex.posX = scale * d3x + camera.offsetX;
		vertex.posY = scale * d3y + camera.offsetY;
		vertex.posZ = scale;
	}
	
	for(var i=0; i<world.lines.length; i++){
		var line = world.lines[i];
		if(line.p1.posZ > 0 && line.p2.posZ > 0){
			toDraw.push({
				posX1: line.p1.posX,
				posY1: line.p1.posY,
				posX2: line.p2.posX,
				posY2: line.p2.posY,
				posZ: (line.p1.posZ + line.p2.posZ)/2
			});
		}
		
	}
	
	toDraw.sort(function(a, b){
		return a.posZ - b.posZ;
	});
	
	for(var i=0; i<toDraw.length; i++){
		camera.screen.beginPath();
		camera.screen.moveTo(toDraw[i].posX1, toDraw[i].posY1);
		camera.screen.lineTo(toDraw[i].posX2, toDraw[i].posY2);
		camera.screen.stroke();
	}
}


var world = {
	vertices:[],
	lines:[]
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

