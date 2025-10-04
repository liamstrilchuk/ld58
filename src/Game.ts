class Game {
	public ctx: CanvasRenderingContext2D;
	private keys: { [key: string]: boolean } = {};
	private mouseDown: boolean = false;
	private mousePos: { x: number, y: number } = { x: 0, y: 0 };
	private player: Player = new Player(0, 0);
	private lastFrameTime: number = new Date().getTime();
	private graphics = new GraphicsLoader();
	private world = new World();

	public TILE_WIDTH = 31;
	public TILE_HEIGHT = 15;
	public TILE_SCALE = 6;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		ctx.imageSmoothingEnabled = false;
	}

	public start() {
		this.update();
	}

	public asset(name: string): HTMLImageElement {
		return this.graphics.assets[name] || null;
	}

	private update() {
		const currentTime = new Date().getTime();
		const delta = (currentTime - this.lastFrameTime) / (1000 / 60);
		this.lastFrameTime = currentTime;

		this.player.update(this, delta);

		this.render();

		window.requestAnimationFrame(this.update.bind(this));
	}

	private render() {
		this.ctx.fillStyle = "#8db3c5";
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		this.world.render(this, this.ctx);
		this.player.render(this, this.ctx);
	}

	public renderX(x: number): number {
		return x + this.ctx.canvas.width / 2 - this.player.x;
	}

	public renderY(y: number): number {
		return y + this.ctx.canvas.height / 2 - this.player.y;
	}

	private calculateHoveredTile(): Tile | null {
		return null;
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

	public onMouseDown() {
		this.mouseDown = true;
	}

	public onMouseUp() {
		this.mouseDown = false;
	}

	public onMouseMove(x: number, y: number) {
		this.mousePos = { x, y };
	}
}