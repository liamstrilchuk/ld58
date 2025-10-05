class Action {
	private static actionTimes: { [key: string]: number } = {
		harvest: 30,
		till: 60
	};
	private tile: Tile;
	private action: string;
	private progress = 0;

	constructor(tile: Tile, action: string) {
		this.tile = tile;
		this.action = action;
	}

	public update(game: Game, delta: number): boolean {
		this.progress += delta;

		if (this.progress > Action.actionTimes[this.action]) {
			this.onCompletion(game);
			return true;
		}

		return false;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		const { x, y } = Tile.renderPos(game, this.tile.x, this.tile.y);
		const Tw = game.TILE_WIDTH * game.TILE_SCALE;

		ctx.fillStyle = "white";
		ctx.fillRect(x + Tw / 4, y - 30, Tw / 2, 15);
		ctx.fillStyle = "blue";
		ctx.fillRect(x + 2 + Tw / 4, y - 28, (Tw / 2 - 4) * this.progress / Action.actionTimes[this.action], 11);
	}

	private addItem(game: Game, name: string, speedMult=1) {
		let { x, y } = Tile.renderPos(game, this.tile.x, this.tile.y);
		game.addEntity(
			new Item(
				x + game.player.x - game.ctx.canvas.width / 2 + game.TILE_SCALE * game.TILE_WIDTH / 2,
				y + game.player.y - game.ctx.canvas.height / 2 + game.TILE_SCALE * game.TILE_HEIGHT / 2,
				name, speedMult
			)
		);
	}

	private onCompletion(game: Game) {
		if (this.tile.type === "flower" && this.action === "harvest") {
			this.addItem(game, "flower");
			this.addItem(game, "white_flower_seeds", 0.9);
			this.tile.changeType(game, "grass");
		}

		if (this.tile.type === "water_flower" && this.action === "harvest") {
			this.addItem(game, "water_flower");
			this.tile.changeType(game, "water");
		}

		if (this.tile.type === "red_flower" && this.action === "harvest") {
			this.addItem(game, "red_flower");
			this.addItem(game, "red_flower_seeds", 0.9);
			this.tile.changeType(game, "grass");
		}

		if (["flower", "grass"].includes(this.tile.type) && this.action === "till") {
			this.tile.changeType(game, "tilled");
		}
	}
}