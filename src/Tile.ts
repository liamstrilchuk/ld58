class Tile {
	public x: number;
	public y: number;
	public type: string;
	public image: HTMLImageElement;
	public stage: number = 0;

	private static recessedTypes = ["water", "water_flower"];

	private static growingChances = {
		"white_flower_tilled": 1/300,
		"red_flower_tilled": 1/600,
		"purple_flower_tilled": 1/2000,
		"yellow_flower_tilled": 1/1000,
		"berries_flower_tilled": 1/1000
	};

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
		switch (this.type) {
			case "sand":
				this.image = game.asset("sand_tile");
				break;
			case "tilled":
				this.image = game.asset("tilled_tile");
				break;
			case "water_flower":
				this.image = game.asset("water_flower");
				break;
			case "red_flower":
				this.image = game.asset("red_flower_tile");
				break;
			case "water":
				const rand = Math.random();

				if (rand < 1/3) {
					this.image = game.asset("water_tile");
				} else if (rand < 2/3) {
					this.image = game.asset("water_tile2");
				} else {
					this.image = game.asset("water_tile3");
				}

				break;
			case "flower":
				this.image = game.asset("flower_tile");
				break;
			case "grass":
				this.image = Math.random() < 0.5
					? game.asset("grass_tile")
					: game.asset("grass_tile2");
				break;
			case "white_flower_tilled":
				this.image = game.asset(`white-stage${this.stage}`);
				break;
			case "red_flower_tilled":
				this.image = game.asset(`red-stage${this.stage}`);
				break;
			case "purple_flower_tilled":
				this.image = game.asset(`purple-stage${this.stage}`);
				break;
			case "yellow_flower_tilled":
				this.image = game.asset(`yellow-stage${this.stage}`);
				break;
			case "berries_flower_tilled":
				this.image = game.asset(`berries-stage${this.stage}`);
				break;
			default:
				this.image = game.asset("blank_tile");
				break;
		}
	}

	public update(game: Game, delta: number) {
		if (!Tile.growingChances[this.type]) {
			return;
		}

		if (Math.random() < Tile.growingChances[this.type] * delta) {
			this.stage = Math.min(this.stage + 1, 2);
			this.determineImage(game);
		}
	}

	public render(game: Game, ctx: CanvasRenderingContext2D, isSelected: boolean, isHovered: boolean, structures: Structure[]) {
		if (game.frame % 80 === 0 && this.type === "water") {
			this.determineImage(game);
		}
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
			const inset = Tile.recessedTypes.includes(this.type) ? 3 * game.TILE_SCALE : 1 * game.TILE_SCALE;
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
		const options = Tile.getOptionsByType(game, this.type, this.stage);
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

	static getOptionsByType(game: Game, type: string, stage=0): string[] {
		const options: string[] = [];

		switch (type) {
			case "grass":
			case "sand":
				options.push("till");
				break;
			case "flower":
				options.push("till", "harvest");
				break;
			case "water_flower":
				options.push("harvest");
				break;
			case "red_flower":
				options.push("till", "harvest");
				break;
			case "tilled":
				options.push("plant");
				break;
			case "red_flower_tilled":
			case "white_flower_tilled":
			case "purple_flower_tilled":
			case "yellow_flower_tilled":
			case "berries_flower_tilled":
				if (stage >= 2) {
					options.push("harvest");
				}
				break;
		}

		return options.filter(opt => {
			if (opt === "till" && !game.hoeUnlocked) {
				return false;
			}

			return true;
		});
	}
}