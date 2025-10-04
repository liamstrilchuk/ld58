let game: Game;

window.addEventListener("load", () => {
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.imageSmoothingEnabled = false;

	game = new Game(ctx);
	game.start();

	window.addEventListener(
		"keydown",
		event => game.onKeyDown(event.key.toLowerCase())
	);

	window.addEventListener(
		"keyup",
		event => game.onKeyUp(event.key.toLowerCase())
	);

	window.addEventListener(
		"mousedown",
		() => game.onMouseDown()
	);

	window.addEventListener(
		"mouseup",
		() => game.onMouseUp()
	);

	window.addEventListener(
		"mousemove",
		event => game.onMouseMove(event.clientX, event.clientY)
	);

	window.addEventListener(
		"resize",
		() => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			ctx.imageSmoothingEnabled = false;
		}
	);
});