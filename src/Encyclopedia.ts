class Encyclopedia {
	private entries: EncyclopediaEntry[] = [];
	private currentPage: number = 0;

	constructor() {
		this.entries = [
			new EncyclopediaEntry(
				"Sunpetal",
				"Solnaria alba",
				"A common flower.",
				"flower"
			),
			new EncyclopediaEntry(
				"Emberbloom",
				"Velutina ardens",
				"A rugged plant, which can be grown almost anywhere.",
				"red_flower"
			),
			new EncyclopediaEntry(
				"Tidebloom",
				"Nymphaea lunaris",
				"A common flower. Found in aquatic environments.",
				"water_flower"
			),
			new EncyclopediaEntry(
				"Sunspire",
				"Heliora aurelia",
				"Has been described as tasting like lemons. Must be grown within two tiles of water.",
				"yellow_flower"
			),
			new EncyclopediaEntry(
				"Dreamveil",
				"Nymphaea violacea",
				"A distant relative of the Tidebloom. Must be grown adjacent to water, and an Emberbloom. Said to treat many kinds of ailments, though this has not been proven.",
				"purple_flower"
			)
		];
	}

	public addEntry(entry: EncyclopediaEntry) {
		this.entries.push(entry);
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		const top = ctx.canvas.height / 2 - 400, left = ctx.canvas.width / 2 - 400;

		const asset = game.asset("encyclopedia");
		ctx.drawImage(asset, left, top, 800, 800 * (asset.height / asset.width));

		const leftAsset = game.asset(this.currentPage === 0 ? "left-off" : "left-on");
		if (game.mousePos.x >= left + 150 && game.mousePos.x <= left + 150 + 96 &&
			game.mousePos.y >= top + 595 && game.mousePos.y <= top + 595 + 96 && !game.mouseDown) {
			ctx.drawImage(leftAsset, left + 146, top + 591, 104, 104);
		} else {
			ctx.drawImage(leftAsset, left + 150, top + 595, 96, 96);
		}

		const rightAsset = game.asset(this.currentPage === this.entries.length - 1 ? "right-off" : "right-on");
		if (game.mousePos.x >= left + 520 && game.mousePos.x <= left + 520 + 96 &&
			game.mousePos.y >= top + 595 && game.mousePos.y <= top + 595 + 96 && !game.mouseDown) {
			ctx.drawImage(rightAsset, left + 516, top + 591, 104, 104);
		} else {
			ctx.drawImage(rightAsset, left + 520, top + 595, 96, 96);
		}

		this.entries[this.currentPage].render(game, ctx, top + 90, left + 150);
	}

	public prevItem() {
		this.currentPage = Math.max(0, this.currentPage - 1);
	}

	public nextItem() {
		this.currentPage = Math.min(this.entries.length - 1, this.currentPage + 1);
	}

	public onMouseDown(game: Game, x: number, y: number) {
		const top = game.ctx.canvas.height / 2 - 400, left = game.ctx.canvas.width / 2 - 400;

		if (x >= left + 150 && x <= left + 150 + 96 &&
			y >= top + 595 && y <= top + 595 + 96) {
			this.prevItem();
		}

		if (x >= left + 520 && x <= left + 520 + 96 &&
			y >= top + 595 && y <= top + 595 + 96) {
			this.nextItem();
		}
	}
}

class EncyclopediaEntry {
	public name: string;
	public sciName: string;
	public desc: string;
	public descLines: string[];
	public itemName: string;

	constructor(name: string, sciName: string, desc: string, itemName: string) {
		this.name = name;
		this.sciName = sciName;
		this.desc = desc;
		this.itemName = itemName;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D, top: number, left: number) {
		if (!this.descLines) {
			this.descLines = splitLines(ctx, this.desc, 440);
		}

		ctx.drawImage(game.asset("inventory_item"), left + 20, top + 20, 100, 100);
		ctx.drawImage(game.asset(Item.itemData[this.itemName].asset), left + 30, top + 30, 80, 80);

		ctx.fillStyle = "black";
		ctx.font = "bold 25px Courier New";
		ctx.fillText(this.name, left + 135, top + 50);

		ctx.font = "italic 15px Courier New";
		ctx.fillText(this.sciName, left + 135, top + 75);

		ctx.font = "20px Courier New";
		for (let i = 0; i < this.descLines.length; i++) {
			ctx.fillText(this.descLines[i], left + 20, top + 155 + i * 25);
		}
	}
}