abstract class Entity {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public abstract update(game: Game, delta: number): boolean;
	public abstract render(game: Game, ctx: CanvasRenderingContext2D): void;
}

class Item extends Entity {
	public static itemData = {
		"flower": {
			"asset": "white_flower_icon",
			"name": "Sunpetal"
		},
		"red_flower": {
			"asset": "red_flower_icon",
			"name": "Emberbloom"
		},
		"water_flower": {
			"asset": "water_flower_icon",
			"name": "Tidebloom"
		},
		"white_flower_seeds": {
			"asset": "white_flower_seeds",
			"name": "Sunpetal Seeds"
		},
		"red_flower_seeds": {
			"asset": "red_flower_seeds",
			"name": "Emberbloom Seeds"
		}
	};
	public item: string;
	private speedMult: number;

	constructor(x: number, y: number, name: string, speedMult: number) {
		super(x, y);
		this.item = name;
		this.speedMult = speedMult;
	}

	public update(game: Game, delta: number): boolean {
		const dir = Math.atan2(game.player.y - this.y, game.player.x - this.x);

		this.x += Math.cos(dir) * delta * 14 * this.speedMult;
		this.y += Math.sin(dir) * delta * 14 * this.speedMult;
		
		if (Math.hypot(game.player.x - this.x, game.player.y - this.y) < 30) {
			game.player.addToInventory(this.item, 1);
			return true;
		}

		return false;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D): void {
		const x = game.renderX(this.x), y = game.renderY(this.y);
		const asset = game.asset(Item.itemData[this.item]?.asset);
		ctx.drawImage(asset, x - 25, y - 25, 50, asset.height / asset.width * 50);
	}
}