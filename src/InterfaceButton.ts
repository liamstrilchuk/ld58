class InterfaceButton {
	public x: number;
	public y: number;
	public action: string;
	public hovered: boolean = false;

	constructor(x: number, y: number, action: string) {
		this.x = x;
		this.y = y;
		this.action = action;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = "white";
		if (this.hovered) {
			ctx.drawImage(game.asset("action_harvest"), this.x - 35, this.y - 35, 70, 70);
		} else {
			ctx.drawImage(game.asset("action_harvest"), this.x - 30, this.y - 30, 60, 60);
		}
	}
}