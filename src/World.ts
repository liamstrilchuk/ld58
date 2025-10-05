class World {
	public WORLD_SIZE = 50;
	public grid: Tile[][] = [];
	public hoveredTile: Tile = null;
	public selectedTile: Tile = null;
	public structures: Structure[] = [];

	constructor(game: Game) {
		this.generateWorld(game);
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		for (let x = 0; x < this.WORLD_SIZE; x++) {
			for (let y = 0; y < this.WORLD_SIZE; y++) {
				const tile = this.grid[x][y];
				tile.render(game, ctx, tile === this.selectedTile, tile === this.hoveredTile, this.structures);
			}
		}
	}

	public update(game: Game, delta: number) {
		for (let x = 0; x < this.WORLD_SIZE; x++) {
			for (let y = 0; y < this.WORLD_SIZE; y++) {
				this.grid[x][y].update(game, delta);
			}
		}
	}

	public renderAfter(game: Game, ctx: CanvasRenderingContext2D) {
		this.structures.forEach(struct => struct.render(game, ctx));

		if (this.selectedTile) {
			this.selectedTile.createButtons(game);

			game.buttons.forEach(button => button.hovered = false);
			const button = game.findHoveredButton();
			if (button) {
				button.hovered = true;
			}
		} else {
			game.buttons = [];
		}
	}

	private generateWorld(game: Game) {
		(noise as any).seed(Math.random());

		this.structures.push(
			new House(game, Math.floor(this.WORLD_SIZE / 2) - 2, Math.floor(this.WORLD_SIZE / 2) - 2)
		);
		
		for (let x = 0; x < this.WORLD_SIZE; x++) {
			this.grid.push([]);

			for (let y = 0; y < this.WORLD_SIZE; y++) {
				const type = this.determineTileType(x, y);

				this.grid[this.grid.length - 1].push(
					new Tile(game, x, y, type)
				);
			}
		}

		game.player.y = this.WORLD_SIZE / 2 * game.TILE_SCALE * game.TILE_HEIGHT;
	}

	private determineTileType(x: number, y: number) {
		const val = Math.abs((noise as any).perlin2(x / 30, y / 30));
		const val2 = Math.abs((noise as any).perlin2(x / 50 + 123, y / 50 + 123));
		const dist = Math.hypot(x - this.structures[0].x, y - this.structures[0].y);
		const combined = val * 0.6 + val2 * 0.4
			+ Math.pow(Math.max(0, 15 - dist), 0.5) / 20;

		if (combined < 0.15) {
			if (Math.random() < 0.05) {
				return "water_flower";
			}

			return "water";
		} else if (combined < 0.18) {
			return "sand";
		} else {
			if (Math.random() < 0.3) {
				if (Math.random() < 0.8) {
					return "flower";
				} else {
					return "red_flower";
				}
			}

			return "grass";
		}
	}
}