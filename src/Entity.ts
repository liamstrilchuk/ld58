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
			"name": "Sunpetal",
			"can_plant": false
		},
		"red_flower": {
			"asset": "red_flower_icon",
			"name": "Emberbloom",
			"can_plant": false
		},
		"water_flower": {
			"asset": "water_flower_icon",
			"name": "Tidebloom",
			"can_plant": false
		},
		"white_flower_seeds": {
			"asset": "white_flower_seeds",
			"name": "Sunpetal Seeds",
			"can_plant": true
		},
		"red_flower_seeds": {
			"asset": "red_flower_seeds",
			"name": "Emberbloom Seeds",
			"can_plant": true
		},
		"purple_flower_seeds": {
			"asset": "purple_seeds",
			"name": "Dreamveil Seeds",
			"can_plant": true
		},
		"purple_flower": {
			"asset": "purple_flower_icon",
			"name": "Dreamveil",
			"can_plant": false
		},
		"yellow_flower_seeds": {
			"asset": "yellow_seeds",
			"name": "Sunspire Seeds",
			"can_plant": true
		},
		"yellow_flower": {
			"asset": "yellow_flower_icon",
			"name": "Sunspire",
			"can_plant": false
		},
		"berries_flower_seeds": {
			"asset": "berries_seeds",
			"name": "Emberfruit Seeds",
			"can_plant": true
		},
		"berries_flower": {
			"asset": "berries_icon",
			"name": "Emberfruit",
			"can_plant": false
		},
		"blue_flower_seeds": {
			"asset": "blue_seeds",
			"name": "Azurebell Seeds",
			"can_plant": true
		},
		"blue_flower": {
			"asset": "blue_flower_icon",
			"name": "Azurebell",
			"can_plant": false
		},
		"lavender_flower_seeds": {
			"asset": "lavender_seeds",
			"name": "Hushbloom Seeds",
			"can_plant": true
		},
		"lavender_flower": {
			"asset": "lavender_flower_icon",
			"name": "Hushbloom",
			"can_plant": false
		},
		"orange_flower_seeds": {
			"asset": "orange_seeds",
			"name": "Maravine Seeds",
			"can_plant": true
		},
		"orange_flower": {
			"asset": "orange_flower_icon",
			"name": "Maravine",
			"can_plant": false
		},
		"mushroom_flower_seeds": {
			"asset": "mushroom_seeds",
			"name": "Starlume Seeds",
			"can_plant": true
		},
		"mushroom_flower": {
			"asset": "mushroom_flower_icon",
			"name": "Starlume"
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