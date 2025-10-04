class Tile {
	public x: number;
	public y: number;
	public type: string;
	public image: HTMLImageElement;

	constructor(game: Game, x: number, y: number, type: string) {
		this.x = x;
		this.y = y;
		this.type = type;

		this.determineImage(game);
	}

	private determineImage(game: Game) {
		if (this.type === "water") {
			this.image = game.asset("water_tile");
		}

		if (this.type === "grass") {
			if (Math.random() < 0.3) {
				this.image = game.asset("flower_tile");
			} else {
				this.image = Math.random() < 0.5 ? game.asset("grass_tile") : game.asset("grass_tile2");
			}
		}
	}

	public render(game: Game, ctx: CanvasRenderingContext2D, isSelected: boolean) {
		const renderX = game.renderX(
			  this.x * game.TILE_SCALE * (game.TILE_WIDTH / 2 - 0.5)
			- this.y * game.TILE_SCALE * (game.TILE_HEIGHT)
			- game.TILE_SCALE * game.TILE_WIDTH / 2
		);
		const renderY = game.renderY(
			  this.x * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 2.25)
			+ this.y * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 2.25)
			- game.TILE_SCALE * game.TILE_HEIGHT / 2
		);

		if (renderX < -game.TILE_SCALE * game.TILE_WIDTH || renderX > ctx.canvas.width + game.TILE_SCALE * game.TILE_WIDTH ||
			renderY < -game.TILE_SCALE * game.TILE_HEIGHT || renderY > ctx.canvas.height + game.TILE_SCALE * game.TILE_HEIGHT) {
			return;
		}

		ctx.drawImage(
			this.image,
			renderX, renderY,
			game.TILE_SCALE * game.TILE_WIDTH, game.TILE_SCALE * game.TILE_HEIGHT
		);

		if (isSelected) {
			const inset = this.type === "water" ? 3 * game.TILE_SCALE : 0;
			const inset2 = this.type === "water" ? 0.7 * game.TILE_SCALE : 1.5 * game.TILE_SCALE;

			ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
			ctx.beginPath();
			ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH / 2, renderY + inset);
			ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 - inset2);
			ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 + inset2);
			ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH / 2, renderY + game.TILE_SCALE * game.TILE_HEIGHT);
			ctx.lineTo(renderX, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 + inset2);
			ctx.lineTo(renderX, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 - inset2);
			ctx.fill();
		}
	}
}