class Tile {
	public x: number;
	public y: number;
	public type: string;

	constructor(x: number, y: number, type: string) {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		const renderX = game.renderX(
			  this.x * game.TILE_SCALE * game.TILE_WIDTH / 2
			- this.y * game.TILE_SCALE * game.TILE_HEIGHT
			- game.TILE_SCALE * game.TILE_WIDTH / 2
		);
		const renderY = game.renderY(
			  this.x * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 1.75)
			+ this.y * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 1.75)
			- game.TILE_SCALE * game.TILE_HEIGHT / 2
		);

		ctx.drawImage(
			game.asset("blank_tile"),
			renderX, renderY,
			game.TILE_SCALE * game.TILE_WIDTH, game.TILE_SCALE * game.TILE_HEIGHT
		);
	}
}