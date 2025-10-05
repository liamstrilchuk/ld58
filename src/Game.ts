class Game {
	public ctx: CanvasRenderingContext2D;
	private keys: { [key: string]: boolean } = {};
	private mouseDown: boolean = false;
	private mousePos: { x: number, y: number } = { x: 0, y: 0 };
	public player: Player = new Player(0, 0);
	private lastFrameTime: number = new Date().getTime();
	public graphics = new GraphicsLoader();
	private currentAction: Action = null;
	private entities: Entity[] = [];
	public buttons: InterfaceButton[] = [];
	private encyclopedia = new Encyclopedia();

	public TILE_WIDTH = 31;
	public TILE_HEIGHT = 15;
	public TILE_SCALE = 6;

	public frame = 0;
	private world = new World(this);

	public hoeUnlocked = false;
	public bookUnlocked = true;
	public currentQuest = 0;
	public questSelected = false;
	public encyclopediaSelected = false;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	public addEntity(entity: Entity) {
		this.entities.push(entity);
	}

	public start() {
		quests.forEach(quest => quest.getLines(this.ctx));
		this.update();
	}

	public asset(name: string): HTMLImageElement {
		return this.graphics.assets[name] || null;
	}

	private update() {
		this.frame++;
		const currentTime = new Date().getTime();
		const delta = (currentTime - this.lastFrameTime) / (1000 / 60);
		this.lastFrameTime = currentTime;

		this.player.update(this, delta);
		
		for (let i = this.entities.length - 1; i > -1; i--) {
			if (this.entities[i].update(this, delta)) {
				this.entities.splice(i, 1);
			}
		}

		if (this.currentAction?.update(this, delta)) {
			this.currentAction = null;
		}

		this.calculateHoveredTile();
		this.render();

		window.requestAnimationFrame(this.update.bind(this));
	}

	private render() {
		this.ctx.fillStyle = "#8db3c5";
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		this.world.render(this, this.ctx);
		this.player.render(this, this.ctx);
		this.entities.forEach(entity => entity.render(game, this.ctx));
		this.world.renderAfter(this, this.ctx);

		this.buttons.forEach(button => button.render(this, this.ctx));
		this.currentAction?.render(this, this.ctx);
		this.renderInterface();
	}

	private renderInterface() {
		let index = 0;
		for (const item in this.player.inventory) {
			if (this.player.inventory[item] > 0) {
				this.ctx.drawImage(
					this.asset("inventory_item"),
					index * 85 + 5, this.ctx.canvas.height - 85,
					80, 80
				);
				this.ctx.drawImage(
					this.asset(Item.itemData[item]?.asset),
					index * 85 + 18, this.ctx.canvas.height - 75,
					60, 60
				);
				this.ctx.fillStyle = "white";
				this.ctx.textAlign = "left";
				this.ctx.font = "bold 28px Garamond";
				this.ctx.fillText(
					this.player.inventory[item].toString(),
					index * 85 + 19,
					this.ctx.canvas.height - 22
				);
				this.ctx.strokeStyle = "black";
				this.ctx.strokeText(
					this.player.inventory[item].toString(),
					index * 85 + 19,
					this.ctx.canvas.height - 22
				);
				index++;
			}
		}

		if (this.questSelected && this.currentQuest < quests.length) {
			quests[this.currentQuest].render(this, this.ctx);
		}

		if (this.encyclopediaSelected) {
			this.encyclopedia.render(this, this.ctx);
		}
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
		if (key === "q") {
			this.questSelected = !this.questSelected;
			this.encyclopediaSelected = false;
		}

		if (key === "e") {
			this.encyclopediaSelected = !this.encyclopediaSelected;
			this.questSelected = false;
		}

		if (key === "arrowleft" && this.encyclopediaSelected) {
			this.encyclopedia.prevItem();
			return;
		}

		if (key === "arrowright" && this.encyclopediaSelected) {
			this.encyclopedia.nextItem();
			return;
		}

		this.keys[key] = true;
	}

	public onKeyUp(key: string) {
		this.keys[key] = false;
	}

	public findHoveredButton(): InterfaceButton | null {
		for (const button of this.buttons) {
			if (Math.hypot(button.x - this.mousePos.x, button.y - this.mousePos.y) < 30) {
				return button;
			}
		}

		return null;
	}

	public onMouseDown() {
		this.mouseDown = true;

		if (this.questSelected) {
			quests[this.currentQuest].onMouseDown(this, this.mousePos.x, this.mousePos.y);
			return;
		}

		const button = this.findHoveredButton();
		if (button) {
			if (this.currentAction || !this.world.selectedTile) {
				return;
			}
			this.currentAction = new Action(this.world.selectedTile, button.action);
			this.world.selectedTile = null;
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