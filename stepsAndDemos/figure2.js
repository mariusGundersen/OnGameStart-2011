Demo.event.onEnterFrame = function(t){
	camera.screen.clearRect(0, 0, camera.width, camera.height);
	camera.screen.strokeStyle = "red";
	camera.screen.lineWidth = "2";
	
	if(Demo.mouse.isDown){
		
		world.triRy = -((Demo.mouse.x - triMouse.x)/camera.width - 0.5)*Math.PI*2;
		for(var i=0; i<3; i++){
			var vertex = world.vertices[i];
			vertex.x = Math.sin(world.triRy)*vertex.l;
			vertex.z = -Math.cos(world.triRy)*vertex.l + 300;
		}
		var vertex = world.vertices[8];
		vertex.z = -Math.sin(world.triRy)*vertex.l+300;
		vertex.x = -Math.cos(world.triRy)*vertex.l;
		
		var norm = {dx: vertex.x,
						dy: vertex.y,
						dz: vertex.z - 300};
		var cam = {dx: 0,
						dy: 0,
						dz: -900};
		var l = Math.sqrt(cam.dx*cam.dx + cam.dy*cam.dy + cam.dz*cam.dz);
		cam.dx /= l;
		cam.dy /= l;
		cam.dz /= l;
		var dp = norm.dx*cam.dx + norm.dy*cam.dy + norm.dz*cam.dz;
		var vertex = world.vertices[10];
		vertex.z = -dp+300;
		
		camMouse.x = -(-camera.ry/Math.PI/2 + 0.5)*camera.width + Demo.mouse.x;
		camMouse.y = -(camera.rx/Math.PI + 0.5)*camera.height + Demo.mouse.y;
	}else{
		camera.ry = -((Demo.mouse.x - camMouse.x)/camera.width - 0.5)*Math.PI*2;
		camera.rx = ((Demo.mouse.y - camMouse.y)/camera.height - 0.5)*Math.PI;
		
		camera.y = -Math.sin(camera.rx)*900;
		ryRadius = Math.cos(camera.rx)*900;
		
		camera.x = Math.sin(camera.ry)*ryRadius;
		camera.z = -Math.cos(camera.ry)*ryRadius;
		triMouse.x = -(-world.triRy/Math.PI/2 + 0.5)*camera.width + Demo.mouse.x;
		triMouse.y = Demo.mouse.y;
	}
	render(world, camera);
};
var camMouse = {x:0, y:0};
var triMouse = {x:0, y:0};
Demo.event.onGameStart = function(e){			
	
	Demo.key.init([32]);
	
	for(var i=0; i<world.lines.length; i++){
		var line = world.lines[i];
		line.p1 = world.vertices[line.p1];
		line.p2 = world.vertices[line.p2];
	}
	for(var i=0; i<world.texts.length; i++){
		var text = world.texts[i];
		text.p = world.vertices[text.p];
	}
	for(var i=0; i<world.triangles.length; i++){
		var triangle = world.triangles[i];
		triangle.p1 = world.vertices[triangle.p1];
		triangle.p2 = world.vertices[triangle.p2];
		triangle.p3 = world.vertices[triangle.p3];
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
				type: "line",
				posX1: line.p1.posX,
				posY1: line.p1.posY,
				posX2: line.p2.posX,
				posY2: line.p2.posY,
				posZ: (line.p1.posZ + line.p2.posZ)/2,
				color: line.c || "#333",
			});
		}
	}
	
	for(var i=0; i<world.texts.length; i++){
		var text = world.texts[i];
		if(text.p.posZ){
			toDraw.push({
				type: "text",
				posX: text.p.posX,
				posY: text.p.posY,
				posZ: text.p.posZ,
				text: text.t,
				color: text.c || "#333",
			});
		}
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
			triangle.crossProduct = {dx: vector1.dy*vector2.dz - vector1.dz*vector2.dy,
										dy: vector1.dz*vector2.dx - vector1.dx*vector2.dz,
										dz: vector1.dx*vector2.dy - vector1.dy*vector2.dx};
			
			var dp = triangle.crossProduct.dx * (camera.x - (triangle.p1.x + triangle.p2.x + triangle.p3.x)/3) + 
						triangle.crossProduct.dy * (camera.y - (triangle.p1.y + triangle.p2.y + triangle.p3.y)/3) + 
						triangle.crossProduct.dz * (camera.z - (triangle.p1.z + triangle.p2.z + triangle.p3.z)/3);
			
			//if(dp > 0){
				toDraw.push({
					type: "polygon",
					posX1: triangle.p1.posX,
					posY1: triangle.p1.posY,
					posX2: triangle.p2.posX,
					posY2: triangle.p2.posY,
					posX3: triangle.p3.posX,
					posY3: triangle.p3.posY,
					posZ: (triangle.p1.posZ + triangle.p2.posZ + triangle.p3.posZ)/3,
					color: triangle.c
				});
			//}
		}
	}
	
	toDraw.sort(function(a, b){
		return a.posZ - b.posZ;
	});
	
	for(var i=0; i<toDraw.length; i++){
		var item = toDraw[i];
		camera.screen.beginPath();
		if(item.type == "line"){
			camera.screen.strokeStyle = item.color;
			camera.screen.moveTo(item.posX1, item.posY1);
			camera.screen.lineTo(item.posX2, item.posY2);
			camera.screen.stroke();
		}else if(item.type == "point"){
			camera.screen.fillStyle = item.color;
			camera.screen.fillRect(item.posX - 5*item.posZ, item.posY - 5*item.posZ, 10*item.posZ, 10*item.posZ);
		}else if(item.type == "text"){
			camera.screen.fillStyle = item.color;
			camera.screen.fillText(item.text, item.posX, item.posY);
		}else if(item.type == "polygon"){
			camera.screen.fillStyle = item.color;
			camera.screen.moveTo(item.posX1, item.posY1);
			camera.screen.lineTo(item.posX2, item.posY2);
			camera.screen.lineTo(item.posX3, item.posY3);
			camera.screen.fill();
		}
	}
}


var world = {
	triRy:Math.PI/2,
	vertices:[
		{x:300, y:300, z: 300, l:300},
		{x:-300, y:300, z: 300, l:-300},
		{x:0, y:-425, z: 300, l:0},
		
		{x: 50, y:40, z: -500},
		{x: -50, y:40, z: -500},
		{x: -50, y:-40, z: -500},
		{x: 50, y:-40, z: -500},
		{x: 0, y:0, z: -600},
		
		{x: 0, y:0, z: 0, l:300},
		{x: 0, y:0, z: 300},
		
		{x: 0, y:0, z: 300, l:300},
		
	],
	triangles:[
		{p1:0, p2:1, p3:2, c:"rgba(255, 204, 0, 0.5)"},
	],
	texts:[
	],
	lines:[
		{p1: 3, p2: 4, c:"#000"},
		{p1: 4, p2: 5, c:"#000"},
		{p1: 5, p2: 6, c:"#000"},
		{p1: 6, p2: 3, c:"#000"},
		
		{p1: 3, p2: 7, c:"#666"},
		{p1: 4, p2: 7, c:"#666"},
		{p1: 5, p2: 7, c:"#666"},
		{p1: 6, p2: 7, c:"#666"},
		
		
		{p1: 7, p2: 10, c:"#D00"},
		{p1: 8, p2: 9, c:"#B90"},
		
		{p1: 0, p2: 1, c:"#EB0"},
		{p1: 0, p2: 2, c:"#EB0"},
		
		{p1: 9, p2: 10, c:"#00D"},
		{p1: 8, p2: 10, c:"#0D0"},
		
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