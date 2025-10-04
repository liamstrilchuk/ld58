const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game = new Game(ctx);

window.addEventListener(
	"keydown",
	event => game.onKeyDown(event.key.toLowerCase())
);

window.addEventListener(
	"keyup",
	event => game.onKeyUp(event.key.toLowerCase())
);