class InterfaceButton {
	public x: number;
	public y: number;
	public action: string;

	constructor(x: number, y: number, action: string) {
		this.x = x;
		this.y = y;
		this.action = action;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
		ctx.fill();
	}
}