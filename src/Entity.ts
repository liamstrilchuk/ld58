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
			"asset": "red_flower_icon",
			"name": "Daisy"
		},
		"red_flower": {
			"asset": "red_flower_icon",
			"name": "Rose"
		},
		"water_flower": {
			"asset": "water_flower_icon",
			"name": "Water Lily"
		}
	};
	public item: string;

	constructor(x: number, y: number, name: string) {
		super(x, y);
		this.item = name;
	}

	public update(game: Game, delta: number): boolean {
		const dir = Math.atan2(game.player.y - this.y, game.player.x - this.x);

		this.x += Math.cos(dir) * delta * 10;
		this.y += Math.sin(dir) * delta * 10;
		
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