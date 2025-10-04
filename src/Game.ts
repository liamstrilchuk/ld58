class Game {
	public ctx: CanvasRenderingContext2D;
	private keys: { [key: string]: boolean } = {};
	private mouseDown: boolean = false;
	private mousePos: { x: number, y: number } = { x: 0, y: 0 };
	private player: Player = new Player(0, 0);
	private lastFrameTime: number = new Date().getTime();
	private graphics = new GraphicsLoader();
	private world = new World(this);
	public buttons: InterfaceButton[] = [];

	public TILE_WIDTH = 31;
	public TILE_HEIGHT = 15;
	public TILE_SCALE = 6;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
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

		this.calculateHoveredTile();
		this.render();

		window.requestAnimationFrame(this.update.bind(this));
	}

	private render() {
		this.ctx.fillStyle = "#8db3c5";
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		this.world.render(this, this.ctx);
		this.player.render(this, this.ctx);

		this.buttons.forEach(button => button.render(this, this.ctx));
	}

	public renderX(x: number): number {
		return x + this.ctx.canvas.width / 2 - this.player.x;
	}

	public renderY(y: number): number {
		return y + this.ctx.canvas.height / 2 - this.player.y;
	}

	public getTileAtPos(rx: number, ry: number): Tile | null {
		const Cw = this.ctx.canvas.width, Ch = this.ctx.canvas.height;
		const Tw = this.TILE_WIDTH, Th = this.TILE_HEIGHT, Ts = this.TILE_SCALE;
		const C1 = Th * 1/2 - 2.25, W = Ts * Tw, H = Ts * Th, C2 = Ts * (1/2 * Tw - 0.5);
		const Px = this.player.x, Py = this.player.y, Rx = rx - this.TILE_WIDTH * this.TILE_SCALE / 2, Ry = ry;

		const y = (Ry + 1/2 * H - 1/2 * Ch + Py - (Rx + 1/2 * W - 1/2 * Cw + Px)/C2 * Ts * C1)/(Ts * C1 + Ts * C1 * H / C2);
		const x = (Rx + (y * H) + (1/2 * W) - 1/2 * Cw + Px)/C2;

		if (0 <= x && x < this.world.WORLD_SIZE && 0 <= y && y < this.world.WORLD_SIZE) {
			return this.world.grid[Math.floor(x)][Math.floor(y)];
		}

		return null;
	}

	private calculateHoveredTile() {
		if (this.findHoveredButton()) {
			this.world.hoveredTile = null;
			return;
		}

		this.world.hoveredTile = this.getTileAtPos(
			this.mousePos.x,
			this.mousePos.y - 8
		);
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

	private findHoveredButton(): InterfaceButton | null {
		for (const button of this.buttons) {
			if (Math.hypot(button.x - this.mousePos.x, button.y - this.mousePos.y) < 30) {
				return button;
			}
		}

		return null;
	}

	public onMouseDown() {
		this.mouseDown = true;

		const button = this.findHoveredButton();
		if (button) {
			return;
		}

		this.world.selectedTile = this.world.hoveredTile;
	}

	public onMouseUp() {
		this.mouseDown = false;
	}

	public onMouseMove(x: number, y: number) {
		this.mousePos = { x, y };
	}
}