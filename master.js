window.requestAnimFrame = (function() {
	return (window.requestAnimationFrame	||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame			||
		window.oRequestAnimationFrame				||
		window.msRequestAnimationFrame			||
	function (callback) {
		return window.setTimeout(callback , 1000 / 120);
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
		paddle = {},
		stars = [],
		mediumStars = [],
		bigStars = [],
		bricks = [],
		tmpStars = 0,
		speed = 4,
		dx = 0,
		dy = 0,
		lvl = 0,
		life = 1,
		score = 0;

//canvas.addEventListener("mousemove", trackPosition, true);
//canvas.addEventListener("mousedown", click, true);

canvas.height = H;
canvas.width = W;
dx = speed;
dy = -speed;
bricks = [
	{x: 30, y: 30}, {x: 155, y: 30}, {x: 280, y: 30}, {x: 405, y: 30},
	{x: 530, y: 30}, {x: 655, y: 30},	{x: 30, y: 60}, {x: 155, y: 60},
	{x: 280, y: 60}, {x: 405, y: 60}, {x: 530, y: 60}, {x: 655, y: 60},
	{x: 30, y: 90}, {x: 155, y: 90}, {x: 280, y: 90}, {x: 405, y: 90},
	{x: 530, y: 90}, {x: 655, y: 90}, {x: 30, y: 120}, {x: 155, y: 120},
	{x: 280, y: 120}, {x: 405, y: 120}, {x: 530, y: 120}, {x: 655, y: 120}
];
function brickDraw() {
	ctx.beginPath();;
	ctx.fillStyle = "#fff";
	ctx.shadowColor = 'red';
	ctx.shadowBlur = 30;
	for(let i = 0; bricks[i]; i++)
		ctx.fillRect(bricks[i].x, bricks[i].y, 115, 20);
	ctx.closePath();;
};
ball = {
	x: 400, y: 300, w: 10, h: 0,
	draw: function() {
		ctx.beginPath();;
		ctx.fillStyle = "#fff";
		ctx.shadowColor = 'red';
		ctx.shadowBlur = 30;
		ctx.fillStyle = "#fff";
		ctx.arc(this.x, this.y, this.w, this.h, (Math.PI * 2), false);
		ctx.fill();
		ctx.closePath();;
	}
};
backgroundSpace = {
	w: 800, h: 600, x: 0, y:0,
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.fillStyle = "#fff";
		let i = 0, a, b;
		for(let i = 0; i < 300; i++)
			ctx.fillRect(stars[i].x, stars[i].y, 1, 1);
		for(let i = 20; i < 70; i++)
				ctx.fillRect(stars[i].x, stars[i].y, 2, 2);
		for(let i = 0; i < 20; i++)
			ctx.fillRect(stars[i].x, stars[i].y, 3, 3);
		for(let i = 0; mediumStars[i]; i++) {
			ctx.fillRect((mediumStars[i].x - 1), (mediumStars[i].y - 1), 3, 3);
			ctx.fillRect(mediumStars[i].x, (mediumStars[i].y - 4), 1, 9);
			ctx.fillRect((mediumStars[i].x - 2), mediumStars[i].y, 5, 1);
		}
		for(let i = 0; bigStars[i]; i++) {
			ctx.fillRect((bigStars[i].x - 1), (bigStars[i].y - 2), 3, 5);
			ctx.fillRect(bigStars[i].x, (bigStars[i].y - 5), 1, 11);
			ctx.fillRect((bigStars[i].x - 4), bigStars[i].y, 9, 1);
		}
		ctx.closePath();
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

function createStars() {
	for(let i = 0; i < 300; i++) {
		let x = Math.floor(Math.random() * Math.floor(W));
		let y = Math.floor(Math.random() * Math.floor(H));
		stars.push({x: x, y: y});
	}
};
function draw() {
	backgroundSpace.draw();
	brickDraw();
	ball.draw();
	update();
};
function update() {
	if (life == 0) gameOver();
	if (tmpStars == 300) {
		mediumStars = [];
		bigStars = [];
		for(let i = 0; i < 5; i++) {
			let tmp = Math.floor(Math.random() * Math.floor(300));
			mediumStars.push({x: stars[tmp].x, y: stars[tmp].y});
		}
		for(let i = 0; i < 2; i++) {
			let tmp = Math.floor(Math.random() * Math.floor(300));
			bigStars.push({x: stars[tmp].x, y: stars[tmp].y});
		}
		tmpStars = 0;
	} else tmpStars++;
	ballCollide();
	ball.x += dx;
	ball.y += dy;
};
function updateScore() {
	ctx.save();
	ctx.fillStyle = "#fff";
	ctx.font = "20px 'btn',arial,sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + score, 20, 20 );
	ctx.restore();
};
function ballCollide() {
	if(ball.x + dx > (W - ball.w) || ball.x + dx < ball.w)
		dx = -dx;
	if(ball.y + dy > (H - ball.w) || ball.y + dy < ball.w)
		dy = -dy;
};
function animLoop() {
	let init = requestAnimFrame(animLoop);
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
createStars();
animLoop();
