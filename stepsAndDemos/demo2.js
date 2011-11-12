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
				if(x%2 == 1){
					world.triangles.push({p1:p-w, p2:p-1, p3:p-w-1, c:"#00D"});
					world.triangles.push({p1:p, p2:p-1, p3:p-w, c:"#00D"});
				}else if(x%2 == 0 && x>0){
					world.triangles.push({p1:p, p2:p-1, p3:p-w-1, c:"#00D"});
					world.triangles.push({p1:p-w-1, p2:p-w, p3:p, c:"#00D"});
				}
			}
		}
	}
	
	for(var i=0; i<world.triangles.length; i++){
		var triangle = world.triangles[i];
		triangle.p1 = world.vertices[triangle.p1];
		triangle.p2 = world.vertices[triangle.p2];
		triangle.p3 = world.vertices[triangle.p3];
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
		
		for(var i=0; i<world.triangles.length; i++){
			var triangle = world.triangles[i];
			var avgY = Math.round(-(triangle.p1.y + triangle.p2.y + triangle.p3.y)/3);
			triangle.avgY = avgY;
			if(avgY == 0){
				triangle.c = "#00D";
			}else{
				var red =  258 - avgY>>1;
				var green = 256 + avgY>>1 ;
				triangle.c = "rgb("+red+","+green+", "+0x33+")";
			}
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
	
	for(var i=0; i<world.triangles.length; i++){
		var triangle = world.triangles[i];
		if(triangle.p1.posZ > 0 && triangle.p2.posZ > 0 && triangle.p3.posZ > 0){
			
			var vector1 = {dx: triangle.p1.x - triangle.p2.x,
								dy: triangle.p1.y - triangle.p2.y,
								dz: triangle.p1.z - triangle.p2.z};
			var vector2 = {dx: triangle.p3.x - triangle.p2.x,
								dy: triangle.p3.y - triangle.p2.y,
								dz: triangle.p3.z - triangle.p2.z};
			var crossProduct = {dx: vector1.dy*vector2.dz - vector1.dz*vector2.dy,
										dy: vector1.dz*vector2.dx - vector1.dx*vector2.dz,
										dz: vector1.dx*vector2.dy - vector1.dy*vector2.dx};
			var cameraVector =  {dx: (camera.x - (triangle.p1.x + triangle.p2.x + triangle.p3.x)/3),
										dy: (camera.y - (triangle.p1.y + triangle.p2.y + triangle.p3.y)/3),
										dz: (camera.z - (triangle.p1.z + triangle.p2.z + triangle.p3.z)/3)};
			var dp = crossProduct.dx * cameraVector.dx + 
						crossProduct.dy * cameraVector.dy + 
						crossProduct.dz * cameraVector.dz;
			var length1 = Math.sqrt(cameraVector.dx*cameraVector.dx + cameraVector.dy*cameraVector.dy + cameraVector.dz*cameraVector.dz);
			var length2 = Math.sqrt(crossProduct.dx * crossProduct.dx + crossProduct.dy * crossProduct.dy + crossProduct.dz * crossProduct.dz);
			if(dp > 0){
				toDraw.push({
					posX1: triangle.p1.posX,
					posY1: triangle.p1.posY,
					posX2: triangle.p2.posX,
					posY2: triangle.p2.posY,
					posX3: triangle.p3.posX,
					posY3: triangle.p3.posY,
					posZ: (triangle.p1.posZ + triangle.p2.posZ + triangle.p3.posZ)/3,
					color: triangle.c,
					shade: 1-dp/length1/length2,
					avgY: triangle.avgY
				});
			}
		}
	}
	
	toDraw.sort(function(a, b){
		return a.posZ - b.posZ;
	});
	
	for(var i=0; i<toDraw.length; i++){
		camera.screen.beginPath();
		camera.screen.fillStyle = toDraw[i].color;
		camera.screen.moveTo(toDraw[i].posX1, toDraw[i].posY1);
		camera.screen.lineTo(toDraw[i].posX2, toDraw[i].posY2);
		camera.screen.lineTo(toDraw[i].posX3, toDraw[i].posY3);
		camera.screen.fill();
		camera.screen.fillStyle = "rgba(0, 0, 0,"+toDraw[i].shade+")";
		camera.screen.fill();
	}
}


var world = {
	vertices:[],
	triangles:[]
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

