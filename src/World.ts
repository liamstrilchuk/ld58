class World {
	private WORLD_SIZE = 50;
	private grid: Tile[][] = [];

	constructor() {
		this.generateWorld();
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		for (let x = 0; x < this.WORLD_SIZE; x++) {
			for (let y = 0; y < this.WORLD_SIZE; y++) {
				this.grid[x][y].render(game, ctx);
			}
		}
	}

	private generateWorld() {
		for (let x = 0; x < this.WORLD_SIZE; x++) {
			this.grid.push([]);

			for (let y = 0; y < this.WORLD_SIZE; y++) {
				this.grid[this.grid.length - 1].push(
					new Tile(x, y, "grass")
				);
			}
		}
	}
}