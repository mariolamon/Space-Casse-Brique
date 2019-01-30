window.requestAnimFrame = (function() {
	return (window.requestAnimationFrame	||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame			||
		window.oRequestAnimationFrame				||
		window.msRequestAnimationFrame			||
	function (callback) {
		return window.setTimeout(callback , 1000 / 60);
	});
})();
window.cancelRequestAnimFrame = (function() {
	return (window.cancelAnimationFrame 				||
		window.webkitCancelRequestAnimationFrame 	||
		window.mozCancelRequestAnimationFrame 		||
		window.oCancelRequestAnimationFrame 			||
		window.msCancelRequestAnimationFrame 			||
		clearTimeout);
})();
let canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		H = 600,
		W = 800,
		restartBtn = {},
		backgroundSpace = {},
		mouse = {},
		ball = {},
		brick = [],
		lvl = 0,
		score = 0,
		init;

canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", click, true);

canvas.height = H;
canvas.width = W;

brick = [];
backgroundSpace = {
	w: 800, h: 600, x: 0, y:0,
	draw: function() {
		ctx.save();
		ctx.fillStyle = "#fff";
		for(let i = 0; i < 100; i++) {
			let x = Math.floor(Math.random() * Math.floor(this.w));
			let y = Math.floor(Math.random() * Math.floor(this.h));
			ctx.fillRect(x, y, 1, 1);
		}
		ctx.restore();
	}
};
restartBtn = {
	w: 100, h: 50, x: (W / 2 - 50), y: (H / 2 - 50),
	draw: function() {
		ctx.save();
		ctx.strokeStyle = "#fff";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.font = "20px arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "#fff";
		ctx.fillText("Restart", (W / 2), (H / 2 - 25));
		ctx.restore();
	}
};

function draw() {
	backgroundSpace.draw();
	update();
};
function update() {
	if (life == 0) gameOver();
};
function updateScore() {
	ctx.save();
	ctx.fillStyle = "#fff";
	ctx.font = "20px 'btn',arial,sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + point, 20, 20 );
	ctx.restore();
};
function animLoop() {
	init = requestAnimFrame(animLoop);
	draw();
};
function gameOver() {
	ctx.save();
	ctx.font = "20px 'over',arial,sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseligne = "middle";
	ctx.fillStyle = "#fff";
	ctx.fillText("Game Over - You scored " + point + " points !", (W / 2), (H / 2 + 25));
	ctx.restore();
	cancelRequestAnimFrame(init);
	over = 1;
	restartBtn.draw();
};
