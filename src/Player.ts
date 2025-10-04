class Player extends Entity {
	private speed: number = 3;

	constructor(x: number, y: number) {
		super(x, y);
	}

	public update(game: Game, delta: number): void {
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
			{ active: keys.left && keys.down, angle: Math.PI * 0.75 },
			{ active: keys.left && keys.up, angle: Math.PI * 1.25 },
			{ active: keys.right && keys.down, angle: Math.PI * 0.25 },
			{ active: keys.right && keys.up, angle: Math.PI * 1.75 }
		];

		angles.reverse();
		const dir = angles.find(val => val.active)?.angle;

		if (typeof dir !== "undefined") {
			this.x += Math.cos(dir) * this.speed * delta;
			this.y += Math.sin(dir) * this.speed * delta;
		}
	}

	public render(game: Game, ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = "black";
		ctx.fillRect(game.renderX(this.x) - 15, game.renderY(this.y) - 25, 30, 50);
	}
}