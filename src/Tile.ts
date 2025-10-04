class Tile {
	public x: number;
	public y: number;
	public type: string;
	public image: HTMLImageElement;

	private static recessedTypes = ["water", "water_flower"];

	constructor(game: Game, x: number, y: number, type: string) {
		this.x = x;
		this.y = y;
		this.type = type;

		this.determineImage(game);
	}

	public changeType(game: Game, type: string) {
		this.type = type;
		this.determineImage(game);
	}

	private determineImage(game: Game) {
		this.image = game.asset("blank_tile");

		if (this.type === "tilled") {
			this.image = game.asset("tilled_tile");
		}

		if (this.type === "water_flower") {
			this.image = game.asset("water_flower");
		}

		if (this.type === "red_flower") {
			this.image = game.asset("red_flower_tile");
		}

		if (this.type === "water") {
			const rand = Math.random();

			if (rand < 1 / 3) {
				this.image = game.asset("water_tile");
			} else if (rand < 2 / 3) {
				this.image = game.asset("water_tile2");
			} else {
				this.image = game.asset("water_tile3");
			}
		}

		if (this.type === "flower") {
			this.image = game.asset("flower_tile");
		}

		if (this.type === "grass") {
			this.image = Math.random() < 0.5 ? game.asset("grass_tile") : game.asset("grass_tile2");
		}
	}

	public render(game: Game, ctx: CanvasRenderingContext2D, isSelected: boolean, isHovered: boolean, structures: Structure[]) {
		const { x: renderX, y: renderY } = Tile.renderPos(game, this.x, this.y);

		if (renderX < -game.TILE_SCALE * game.TILE_WIDTH || renderX > ctx.canvas.width + game.TILE_SCALE * game.TILE_WIDTH ||
			renderY < -game.TILE_SCALE * game.TILE_HEIGHT || renderY > ctx.canvas.height + game.TILE_SCALE * game.TILE_HEIGHT) {
			return;
		}

		ctx.drawImage(
			this.image,
			renderX, renderY - (this.image.height - 21) * game.TILE_SCALE / (this.image.height / 21),
			game.TILE_SCALE * game.TILE_WIDTH,
			game.TILE_SCALE * game.TILE_HEIGHT * (this.image.height / 21)
		);

		// for (const struct of structures) {
		// 	if (this.x >= struct.x && this.x < struct.x + struct.width && this.y >= struct.y && this.y < struct.y + struct.height) {
		// 		const inset = this.type === "water" ? 3 * game.TILE_SCALE : 0;
		// 		const inset2 = this.type === "water" ? 0.7 * game.TILE_SCALE : 1.5 * game.TILE_SCALE;

		// 		ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
		// 		ctx.beginPath();
		// 		ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH / 2, renderY + inset);
		// 		ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 - inset2);
		// 		ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 + inset2);
		// 		ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH / 2, renderY + game.TILE_SCALE * game.TILE_HEIGHT);
		// 		ctx.lineTo(renderX, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 + inset2);
		// 		ctx.lineTo(renderX, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 - inset2);
		// 		ctx.fill();
		// 	}
		// }

		if (isHovered || isSelected) {
			const inset = Tile.recessedTypes.includes(this.type) ? 3 * game.TILE_SCALE : 0;
			const inset2 = Tile.recessedTypes.includes(this.type) ? 0.7 * game.TILE_SCALE : 1.5 * game.TILE_SCALE;

			ctx.fillStyle = isSelected ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)";
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

	public static renderPos(game: Game, x: number, y: number): { x: number, y: number } {
		return {
			x: game.renderX(
				x * game.TILE_SCALE * (game.TILE_WIDTH / 2 - 0.5)
				- y * game.TILE_SCALE * (game.TILE_HEIGHT)
				- game.TILE_SCALE * game.TILE_WIDTH / 2
			),
			y: game.renderY(
				x * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 2.25)
				+ y * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 2.25)
				- game.TILE_SCALE * game.TILE_HEIGHT / 2
			)
		};
	}

	public createButtons(game: Game) {
		const options = Tile.getOptionsByType(this.type);
		const renderPos = Tile.renderPos(game, this.x, this.y);
		const Tw = game.TILE_WIDTH * game.TILE_SCALE;

		switch (options.length) {
			case 0:
				game.buttons = [];
				break;
			case 1:
				game.buttons = [
					new InterfaceButton(renderPos.x + Tw / 2, renderPos.y - 50, options[0])
				];
				break;
			case 2:
				game.buttons = [
					new InterfaceButton(renderPos.x - 50 + Tw / 2, renderPos.y - 50, options[0]),
					new InterfaceButton(renderPos.x + 50 + Tw / 2, renderPos.y - 50, options[1])
				];
				break;
			case 3:
				game.buttons = [
					new InterfaceButton(renderPos.x - 70 + Tw / 2, renderPos.y, options[0]),
					new InterfaceButton(renderPos.x + Tw / 2, renderPos.y - 50, options[1]),
					new InterfaceButton(renderPos.x + 70 + Tw / 2, renderPos.y, options[2])
				];
				break;
		}
	}

	static getOptionsByType(type: string): string[] {
		const options: string[] = [];

		switch (type) {
			case "grass":
				options.push("till");
				break;
			case "flower":
				options.push("till", "harvest");
				break;
		}

		return options;
	}
}