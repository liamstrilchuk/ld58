class Player extends Entity {
	private speed: number = 3;
	private walkFrame: number = 0;
	private walkDir: number = 0;
	public inventory: { [key: string]: number } = {};

	constructor(x: number, y: number) {
		super(x, y);
	}

	public update(game: Game, delta: number): boolean {
		const keys = {
			left: game.getKey("a") || game.getKey("arrowleft"),
			right: game.getKey("d") || game.getKey("arrowright"),
			up: game.getKey("w") || game.getKey("arrowup"),
			down: game.getKey("s") || game.getKey("arrowdown")
		};

		const angles = [
			{ active: keys.left, angle: Math.PI },
			{ active: keys.down, angle: Math.PI / 2 },
			{ active: keys.right, angle: 0 },
			{ active: keys.up, angle: Math.PI * 3 / 2 },
			{ active: keys.left && keys.down, angle: Math.PI * 6 / 7 },
			{ active: keys.left && keys.up, angle: Math.PI * 7 / 6 },
			{ active: keys.right && keys.down, angle: Math.PI / 6 },
			{ active: keys.right && keys.up, angle: Math.PI * (2 - 1 / 6) }
		];

		let dir: number;

		for (let i = 0; i < angles.length; i++) {
			if (angles[i].active) {
				dir = angles[i].angle;
				this.walkDir = i;
			}
		}

		const overTile = game.getTileAtPos(game.ctx.canvas.width / 2, game.ctx.canvas.height / 2);
		const speed = overTile?.type === "water" ? this.speed / 2 : this.speed;

		if (typeof dir === "undefined") {
			return;
		}

		if (game.frame % 5 === 0) {
			this.walkFrame = (this.walkFrame + 1) % 4;
		}

		let newX = Math.cos(dir) * speed * delta;
		let newY = Math.sin(dir) * speed * delta;

		if (game.getTileAtPos(game.ctx.canvas.width / 2 + newX, game.ctx.canvas.height / 2)) {
			this.x += newX;
		}

		if (game.getTileAtPos(game.ctx.canvas.width / 2, game.ctx.canvas.height / 2 + newY)) {
			this.y += newY;
		}

		return false;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D): void {
		const asset = game.graphics.player[this.walkDir][this.walkFrame];
		ctx.drawImage(
			asset,
			game.renderX(this.x) - 60, game.renderY(this.y) - 60 * (asset.height / asset.width),
			120, 120 * (asset.height / asset.width)
		);
	}

	public addToInventory(name: string, amount: number) {
		if (!this.inventory[name]) {
			this.inventory[name] = 0;
		}

		this.inventory[name] += amount;
	}
}