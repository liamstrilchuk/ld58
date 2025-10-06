abstract class Structure extends Entity {
	protected assets: HTMLImageElement[];
	protected animSpeed: number;
	protected frame: number = 0;
	public width: number;
	public height: number;
	public collide: boolean;

	constructor(x: number, y: number, width: number, height: number, assets: HTMLImageElement[], animSpeed: number, collide: boolean) {
		super(x, y);
		this.assets = assets;
		this.width = width;
		this.height = height;
		this.animSpeed = animSpeed;
		this.collide = collide;
	}

	public renderY(game: Game): number {
		return Tile.renderPos(game, this.x + this.width / 2, this.y + this.height / 2).y;
	}

	public update(game: Game, delta: number): boolean { return false; }
}

class House extends Structure {
	constructor(game: Game, x: number, y: number) {
		super(x, y, 5, 5, [ game.asset("house"), game.asset("house2"), game.asset("house3") ], 60, true);
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		const asset = this.assets[this.frame];

		const { x, y } = Tile.renderPos(game, this.x, this.y + 3);
		const Tw = game.TILE_WIDTH * game.TILE_SCALE, Th = game.TILE_HEIGHT * game.TILE_SCALE;
		const imgScale = (this.width * Tw) / asset.width;
		const eachSide = (asset.width * imgScale - this.width * Tw) / 2;

		ctx.drawImage(
			asset,
			x - eachSide - Tw / 2, y - asset.width * imgScale / 2 + Th / 2,
			this.width * Tw * 0.9,
			this.height * Tw * 0.9
		);

		if (game.frame % this.animSpeed === 0) {
			this.frame = (this.frame + 1) % this.assets.length;
		}
	}
}

class Tree extends Structure {
	constructor(game: Game, x: number, y: number) {
		const assets = [ game.asset("tree1"), game.asset("tree2"), game.asset("tree3"), game.asset("tree4") ];
		super(x, y, 2, 2, [assets[Math.floor(Math.random() * assets.length)]], 60, false);
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		const asset = this.assets[0];

		const { x, y } = Tile.renderPos(game, this.x - 3, this.y - 3);
		const Tw = game.TILE_WIDTH * game.TILE_SCALE, Th = game.TILE_HEIGHT * game.TILE_SCALE;

		ctx.drawImage(
			asset,
			x - Tw / 2, y - Th,
			this.width * Tw,
			this.height * Tw
		);

		if (game.frame % this.animSpeed === 0) {
			this.frame = (this.frame + 1) % this.assets.length;
		}
	}
}