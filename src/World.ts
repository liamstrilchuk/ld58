class World {
	public WORLD_SIZE = 50;
	public grid: Tile[][] = [];
	public hoveredTile: Tile = null;
	public selectedTile: Tile = null;
	public structures: Structure[] = [];
	public house: House;

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
		[game.player, ...this.structures].sort((a, b) => {
			const val1 = a instanceof Player ? game.ctx.canvas.height / 2 + 20 : a.renderY(game);
			const val2 = b instanceof Player ? game.ctx.canvas.height / 2 + 20 : b.renderY(game);

			return val1 - val2;
		}).forEach(entity => entity.render(game, ctx));

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
		this.house = this.structures[0];
		
		for (let x = 0; x < this.WORLD_SIZE; x++) {
			this.grid.push([]);

			for (let y = 0; y < this.WORLD_SIZE; y++) {
				const type = this.determineTileType(x, y);

				this.grid[this.grid.length - 1].push(
					new Tile(game, x, y, type)
				);
			}
		}

		game.player.y = this.WORLD_SIZE / 2 * game.TILE_SCALE * game.TILE_HEIGHT / 2 + game.TILE_HEIGHT * game.TILE_SCALE * 7;

		for (let i = 0; i < 200; i++) {
			const root = this.selectRandomTile();
			let canPlant = this.canPlaceStructure(root.x, root.y, 2, 2);

			for (let x = 0; x < 2; x++) {
				for (let y = 0; y < 2; y++) {
					if (!this.posInWorld(x + root.x, y + root.y) || this.grid[x + root.x][y + root.y].type !== "grass") {
						canPlant = false;
					}
				}
			}

			if (canPlant) {
				this.structures.push(new Tree(game, root.x, root.y));
			}
		}

		this.structures.sort((a, b) => a.renderY(game) - b.renderY(game));
	}

	private determineTileType(x: number, y: number): string {
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
			if (Math.random() < 0.2) {
				if (Math.random() < 0.8) {
					return "flower";
				} else {
					return "red_flower";
				}
			}

			return "grass";
		}
	}

	public posInWorld(x: number, y: number): boolean {
		return x >= 0 && x < this.WORLD_SIZE && y >= 0 && y < this.WORLD_SIZE;
	}

	public getAdjacentTiles(tile: Tile, depth=1, prev: Tile[]=[]): Tile[] {
		if (depth === 0) {
			return [ tile ];
		}
		const positions = [[ tile.x - 1, tile.y ], [ tile.x + 1, tile.y ], [ tile.x, tile.y - 1 ], [ tile.x, tile.y + 1 ]];
		const list: Tile[] = [];
		if (prev.length) {
			list.push(tile);
		}
		prev.push(tile);

		for (const pos of positions) {
			if (this.posInWorld(pos[0], pos[1]) && !prev.includes(this.grid[pos[0]][pos[1]])) {
				list.push(...this.getAdjacentTiles(this.grid[pos[0]][pos[1]], depth - 1, prev));
			}
		}

		return list;
	}

	private selectRandomTile(): Tile {
		const x = Math.floor(Math.random() * this.WORLD_SIZE), y = Math.floor(Math.random() * this.WORLD_SIZE);

		return this.grid[x][y];
	}

	private canPlaceStructure(x: number, y: number, w: number, h: number): boolean {
		for (const struct of this.structures) {
			for (let i = 0; i < w; i++) {
				for (let j = 0; j < h; j++) {
					if (x + i >= struct.x && x + i < struct.x + struct.width
						&& y + j >= struct.y && y + j < struct.y + struct.height) {
						return false;
					}
				}
			}
		}

		return true;
	}
}