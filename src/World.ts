class World {
	public WORLD_SIZE = 10;
	public grid: Tile[][] = [];
	public selectedTile: Tile = null;

	constructor(game: Game) {
		this.generateWorld(game);
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		for (let x = 0; x < this.WORLD_SIZE; x++) {
			for (let y = 0; y < this.WORLD_SIZE; y++) {
				this.grid[x][y].render(game, ctx, this.grid[x][y] === this.selectedTile);
			}
		}
	}

	private generateWorld(game: Game) {
		(noise as any).seed(Math.random());
		
		for (let x = 0; x < this.WORLD_SIZE; x++) {
			this.grid.push([]);

			for (let y = 0; y < this.WORLD_SIZE; y++) {
				const val = Math.abs((noise as any).perlin2(x / 35, y / 35));
				const val2 = Math.abs((noise as any).perlin2(x / 50 + 123, y / 50 + 123));
				const combined = (val + val2) / 2;

				this.grid[this.grid.length - 1].push(
					new Tile(game, x, y, combined < 0.1 ? "water" : "grass")
				);
			}
		}
	}
}