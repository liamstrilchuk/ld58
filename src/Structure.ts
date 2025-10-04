abstract class Structure extends Entity {
	private asset: HTMLImageElement;
	public width: number;
	public height: number;

	constructor(x: number, y: number, width: number, height: number, asset: HTMLImageElement) {
		super(x, y);
		this.asset = asset;
		this.width = width;
		this.height = height;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		const { x, y } = Tile.renderPos(game, this.x - 0.5, this.y + 2);
		const Tw = game.TILE_WIDTH * game.TILE_SCALE, Th = game.TILE_HEIGHT * game.TILE_SCALE;
		const imgScale = (this.width * Tw) / this.asset.width;
		const eachSide = (this.asset.width * imgScale - this.width * Tw) / 2;

		ctx.drawImage(
			this.asset,
			x - eachSide - Tw / 2, y - this.asset.width * imgScale / 2 + Th / 2,
			this.width * Tw,
			this.height * Tw
		);
	}
}

class House extends Structure {
	constructor(game: Game, x: number, y: number) {
		super(x, y, 4, 4, game.asset("house"));
	}

	public update(game: Game, delta: number): boolean { return false };
}