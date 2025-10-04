class Game {
	public ctx: CanvasRenderingContext2D;
	private keys: { [key: string]: boolean } = {};

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	public getKey(key: string): boolean {
		return this.keys[key] || false;
	}

	public onKeyDown(key: string) {
		this.keys[key] = true;
	}

	public onKeyUp(key: string) {
		this.keys[key] = false;
	}
}