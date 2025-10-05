class InterfaceButton {
	public x: number;
	public y: number;
	public action: string;
	public hovered: boolean = false;
	private asset: HTMLImageElement;

	constructor(x: number, y: number, action: string) {
		this.x = x;
		this.y = y;
		this.action = action;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		if (!this.asset) {
			switch (this.action) {
				case "harvest":
					this.asset = game.asset("action_harvest");
					break;
				case "till":
					this.asset = game.asset("action_till");
					break;
				case "plant":
					this.asset = game.asset("action_harvest");
					break;
				case "remove":
					this.asset = game.asset("action_x");
					break;
			}
		}

		ctx.fillStyle = "white";
		if (this.hovered) {
			ctx.drawImage(this.asset, this.x - 35, this.y - 35, 70, 70);
		} else {
			ctx.drawImage(this.asset, this.x - 30, this.y - 30, 60, 60);
		}
	}
}