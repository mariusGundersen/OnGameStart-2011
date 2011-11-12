Demo.event.onEnterFrame = function(t){
	camera.screen.clearRect(0, 0, camera.width, camera.height);
	camera.screen.strokeStyle = "red";
	camera.screen.font = "20px Sans-Serif";
	camera.screen.textBaseline = "middle";
	camera.screen.textAlign = "center";
	camera.screen.lineWidth = "2";
	Demo.mouse.z = Demo.mouse.z > 0 ? Demo.mouse.z : 0;
	Demo.mouse.z = Demo.mouse.z < 25 ? Demo.mouse.z : 25;
	var offset = (Demo.mouse.z)*20;
	
	camera.ry = -(Demo.mouse.x/camera.width - 0.5)*Math.PI*2;
	camera.rx = (Demo.mouse.y/camera.height - 0.5)*Math.PI;
	
	camera.y = -Math.sin(camera.rx)*(700);
	ryRadius = Math.cos(camera.rx)*(700);

	camera.x = Math.sin(camera.ry)*ryRadius;
	camera.z = -Math.cos(camera.ry)*ryRadius;

	
	for(var i=8; i<world.vertices.length; i++){
		var vertex= world.vertices[i];
		vertex.z = -offset + vertex.offset;
	}
	
	render(world, camera);
};
Demo.event.onGameStart = function(e){			
	
	Demo.mouse.z = 20;
	
	for(var i=0; i<world.lines.length; i++){
		var line = world.lines[i];
		line.p1 = world.vertices[line.p1];
		line.p2 = world.vertices[line.p2];
	}
	for(var i=0; i<world.points.length; i++){
		var point = world.points[i];
		point.p = world.vertices[point.p];
	}
	for(var i=0; i<world.texts.length; i++){
		var text = world.texts[i];
		text.p = world.vertices[text.p];
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
	
	for(var i=0; i<world.points.length; i++){
		var point = world.points[i];
		if(point.p.posZ){
			toDraw.push({
				type: "point",
				posX: point.p.posX,
				posY: point.p.posY,
				posZ: point.p.posZ,
				color: point.c || "red",
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
			camera.screen.fillRect(item.posX - 15*item.posZ, item.posY - 15*item.posZ, 30*item.posZ, 30*item.posZ);
		}else if(item.type == "text"){
			camera.screen.font = 20*item.posZ + "px Sans-Serif";
			camera.screen.fillStyle = item.color;
			camera.screen.fillText(item.text, item.posX, item.posY);
		}
	}
}


var world = {
	vertices:[
		{x:100, y:100, z: 100},
		{x:-100, y:100, z: 100},
		{x:-100, y:-100, z: 100},
		{x:100, y:-100, z: 100},
		{x:100, y:100, z: -100},
		{x:-100, y:100, z: -100},
		{x:-100, y:-100, z: -100},
		{x:100, y:-100, z: -100},
		
		{x: 50, y:40, z: -500, offset:0},
		{x: -50, y:40, z: -500, offset:0},
		{x: -50, y:-40, z: -500, offset:0},
		{x: 50, y:-40, z: -500, offset:0},
		{x: 0, y:0, z: -600, offset:-100},
		
		{x: 0, y:0, z: -400, offset:50},
		{x: 0, y:150, z: -600, offset:-100},
		{x: 150, y:0, z: -600, offset:-100},
		
	],
	points:[
		{p:0},
		{p:1},
		{p:2},
		{p:3},
		{p:4},
		{p:5},
		{p:6},
		{p:7}
	],
	texts:[
		{p:13, t:"Z", c:"#D00"},
		{p:14, t:"Y", c:"#0C0"},
		{p:15, t:"X", c:"#00D"},
	],
	lines:[
		{p1: 8, p2: 9, c:"#000"},
		{p1: 9, p2: 10, c:"#000"},
		{p1: 10, p2: 11, c:"#000"},
		{p1: 11, p2: 8, c:"#000"},
		
		{p1: 8, p2: 12, c:"#999"},
		{p1: 9, p2: 12, c:"#999"},
		{p1: 10, p2: 12, c:"#999"},
		{p1: 11, p2: 12, c:"#999"},
		
		
		{p1: 12, p2: 13, c:"#D00"},
		{p1: 12, p2: 14, c:"#0C0"},
		{p1: 12, p2: 15, c:"#00D"}
		
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