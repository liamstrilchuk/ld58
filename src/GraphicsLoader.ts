class GraphicsLoader {
	public assets: { [key: string]: HTMLImageElement } = {};

	constructor() {
		this.loadAssets();
	}

	private loadAssets() {
		this.assets["blank_tile"] = this.loadImage("assets/blank_tile.png");
		this.assets["grass_tile"] = this.loadImage("assets/grass_tile.png");
		this.assets["grass_tile2"] = this.loadImage("assets/grass_tile2.png");
		this.assets["tilled_tile"] = this.loadImage("assets/tilled_tile.png");
		this.assets["water_tile"] = this.loadImage("assets/water_tile.png");
		this.assets["water_tile2"] = this.loadImage("assets/water_tile2.png");
		this.assets["water_tile3"] = this.loadImage("assets/water_tile3.png");
		this.assets["flower_tile"] = this.loadImage("assets/flower_tile.png");
		this.assets["red_flower_tile"] = this.loadImage("assets/red_flower_tile.png");
		this.assets["water_flower"] = this.loadImage("assets/water_flower.png");

		this.assets["house"] = this.loadImage("assets/house.png");
	}

	private loadImage(src: string): HTMLImageElement {
		const image = new Image();
		image.src = src;
		return image;
	}
}