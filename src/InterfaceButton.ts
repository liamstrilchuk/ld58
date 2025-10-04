class InterfaceButton {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
		ctx.fill();
	}
}