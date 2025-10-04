class GraphicsLoader {
	public assets: { [key: string]: HTMLImageElement } = {};

	constructor() {
		this.loadAssets();
	}

	private loadAssets() {
		this.assets["blank_tile"] = this.loadImage("assets/blank_tile.png");
	}

	private loadImage(src: string): HTMLImageElement {
		const image = new Image();
		image.src = src;
		return image;
	}
}