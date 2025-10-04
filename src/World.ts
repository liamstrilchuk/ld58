class World {
	public WORLD_SIZE = 10;
	public grid: Tile[][] = [];
	public hoveredTile: Tile = null;
	public selectedTile: Tile = null;

	constructor(game: Game) {
		this.generateWorld(game);
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		for (let x = 0; x < this.WORLD_SIZE; x++) {
			for (let y = 0; y < this.WORLD_SIZE; y++) {
				const tile = this.grid[x][y];
				tile.render(game, ctx, tile === this.selectedTile, tile === this.hoveredTile);
			}
		}

		if (this.selectedTile) {
			this.selectedTile.createButtons(game);
		} else {
			game.buttons = [];
		}
	}

	private generateWorld(game: Game) {
		(noise as any).seed(Math.random());
		
		for (let x = 0; x < this.WORLD_SIZE; x++) {
			this.grid.push([]);

			for (let y = 0; y < this.WORLD_SIZE; y++) {
				const type = this.determineTileType(x, y);

				this.grid[this.grid.length - 1].push(
					new Tile(game, x, y, type)
				);
			}
		}
	}

	private determineTileType(x: number, y: number) {
		const val = Math.abs((noise as any).perlin2(x / 35, y / 35));
		const val2 = Math.abs((noise as any).perlin2(x / 50 + 123, y / 50 + 123));
		const combined = (val + val2) / 2;

		if (combined < 0.1) {
			return "water";
		} else {
			if (Math.random() < 0.3) {
				return "flower";
			}

			return "grass";
		}
	}
}