Demo.event.onEnterFrame = function(){
	Demo.canvas.width = Demo.canvas.width;
	Demo.ctx.lineWidth = "2";
	drawCam(Demo.canvas.width/2, Demo.canvas.height/2);
	drawItem(Demo.mouse.x, Demo.mouse.y);
	drawTriangle(Demo.canvas.width/2, Demo.canvas.height/2, Demo.mouse.x, Demo.mouse.y);
	drawProjection(Demo.canvas.width/2, Demo.canvas.height/2, Demo.mouse.x, Demo.mouse.y);
		
};

Demo.event.onGameStart = function(){
	
};


function drawCam(x, y){
	Demo.ctx.beginPath();
	var w = 100;
	Demo.ctx.strokeStyle = "grey";
	Demo.ctx.moveTo(x+w*1.5, y-w);
	Demo.ctx.lineTo(x, y);
	Demo.ctx.lineTo(x+w*1.5, y+w);
	Demo.ctx.stroke();
	Demo.ctx.beginPath();
	Demo.ctx.moveTo(x+w*1.5, y-w);
	Demo.ctx.lineTo(x+w*1.5, y+w);
	Demo.ctx.strokeStyle = "black";
	Demo.ctx.stroke();
};

function drawItem(x, y){
	Demo.ctx.beginPath();
	Demo.ctx.fillStyle = "red";
	Demo.ctx.fillRect(x - 20/2, y-20/2, 20, 20);
}
function drawTriangle(cx, cy, ix, iy){
	Demo.ctx.beginPath();
	Demo.ctx.moveTo(cx, cy);
	Demo.ctx.lineTo(ix, cy);
	Demo.ctx.lineTo(ix, iy);
	Demo.ctx.lineTo(cx, cy);
	Demo.ctx.stroke();
};

function drawProjection(cx, cy, ix, iy){
	var px = cx + 150;
	var py = 150/(ix - cx)*(iy - cy);
	Demo.ctx.beginPath();
	Demo.ctx.moveTo(cx, cy);
	Demo.ctx.lineTo(px, cy +py);
	Demo.ctx.stroke();
	Demo.ctx.fillRect(px - 10/2, cy + py-10/2, 10, 10);
}

var world = {
	items:[
		{x: 50, y: -150},
		{x: 50, y: -250},
		{x: -50, y: -250},
		{x: -50, y: -150},
	
	]

};