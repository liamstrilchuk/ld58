class GraphicsLoader {
	public assets: { [key: string]: HTMLImageElement } = {};
	public player: HTMLImageElement[][] = [];

	constructor() {
		this.loadAssets();
	}

	private loadAssets() {
		this.assets["blank_tile"] = this.loadImage("assets/blank_tile.png");

		this.assets["grass_tile"] = this.loadImage("assets/grass_tile.png");
		this.assets["grass_tile2"] = this.loadImage("assets/grass_tile2.png");

		this.assets["tilled_tile"] = this.loadImage("assets/tilled_tile.png");
		this.assets["tilled_seed_tile"] = this.loadImage("assets/tilled_seed_tile.png");

		this.assets["water_tile"] = this.loadImage("assets/water_tile.png");
		this.assets["water_tile2"] = this.loadImage("assets/water_tile2.png");
		this.assets["water_tile3"] = this.loadImage("assets/water_tile3.png");

		this.assets["sand_tile"] = this.loadImage("assets/sand_tile.png");

		this.assets["flower_tile"] = this.loadImage("assets/flower_tile.png");
		this.assets["red_flower_tile"] = this.loadImage("assets/red_flower_tile.png");
		this.assets["water_flower"] = this.loadImage("assets/water_flower.png");

		this.assets["house"] = this.loadImage("assets/house.png");
		this.assets["house2"] = this.loadImage("assets/house2.png");
		this.assets["house3"] = this.loadImage("assets/house3.png");

		this.assets["water_flower_icon"] = this.loadImage("assets/water_flower_icon.png");
		this.assets["white_flower_icon"] = this.loadImage("assets/white_flower_icon.png");
		this.assets["red_flower_icon"] = this.loadImage("assets/red_flower_icon.png");

		this.assets["white_flower_seeds"] = this.loadImage("assets/white_flower_seeds.png");
		this.assets["red_flower_seeds"] = this.loadImage("assets/red_flower_seeds.png");

		this.assets["inventory_item"] = this.loadImage("assets/inventory_item.png");
		this.assets["action_box"] = this.loadImage("assets/action_box.png");
		this.assets["action_harvest"] = this.loadImage("assets/action_harvest.png");
		this.assets["action_till"] = this.loadImage("assets/action_till.png");

		for (let d = 0; d < 8; d++) {
			this.player.push([]);

			for (let f = 0; f < 4; f++) {
				this.player[this.player.length - 1].push(
					this.loadImage(`assets/player_anim/D${d}-F${f}.png`)
				);
			}
		}
	}

	private loadImage(src: string): HTMLImageElement {
		const image = new Image();
		image.src = src;
		return image;
	}
}