abstract class Structure extends Entity {
	private assets: HTMLImageElement[];
	private animSpeed: number;
	private frame: number = 0;
	public width: number;
	public height: number;

	constructor(x: number, y: number, width: number, height: number, assets: HTMLImageElement[], animSpeed: number) {
		super(x, y);
		this.assets = assets;
		this.width = width;
		this.height = height;
		this.animSpeed = animSpeed;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		const asset = this.assets[this.frame];

		const { x, y } = Tile.renderPos(game, this.x - 0.5, this.y + 2);
		const Tw = game.TILE_WIDTH * game.TILE_SCALE, Th = game.TILE_HEIGHT * game.TILE_SCALE;
		const imgScale = (this.width * Tw) / asset.width;
		const eachSide = (asset.width * imgScale - this.width * Tw) / 2;

		ctx.drawImage(
			asset,
			x - eachSide - Tw / 2, y - asset.width * imgScale / 2 + Th / 2,
			this.width * Tw,
			this.height * Tw
		);

		if (game.frame % this.animSpeed === 0) {
			this.frame = (this.frame + 1) % this.assets.length;
		}
	}
}

class House extends Structure {
	constructor(game: Game, x: number, y: number) {
		super(x, y, 4, 4, [ game.asset("house"), game.asset("house2"), game.asset("house3") ], 60);
	}

	public update(game: Game, delta: number): boolean { return false };
}