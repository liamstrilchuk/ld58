class Quest {
	private text: string;
	private lines: string[] = [];
	private finishedRendering = false;
	private charactersDone = 0;
	private itemsNeeded: { [key: string]: number };
	private onComplete: (game: Game) => void;
	private complete = false;

	constructor(
		text: string,
		needs: { [key: string]: number },
		onComplete: (game: Game) => void
	) {
		this.text = text;
		this.itemsNeeded = needs;
		this.onComplete = onComplete;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		if (!this.finishedRendering && game.frame % 2 === 0) {
			this.charactersDone++;

			if (this.charactersDone >= this.text.length) {
				this.finishedRendering = true;
			}
		}

		ctx.fillStyle = "white";
		ctx.fillRect(ctx.canvas.width / 2 - 250, ctx.canvas.height / 2 - 400, 500, 800);

		ctx.font = "20px Courier New";
		ctx.fillStyle = "black";
		let charsDrawn = 0;
		
		for (let i = 0; i < this.lines.length; i++) {
			const line = this.lines[i];
			const charsToDraw = Math.min(this.charactersDone - charsDrawn, line.length);
			ctx.fillText(
				line.substring(0, charsToDraw),
				ctx.canvas.width / 2 - 250 + 15,
				ctx.canvas.height / 2 - 370 + i * 25,
				470
			);

			charsDrawn += charsToDraw;
			if (charsDrawn >= this.charactersDone) {
				break;
			}
		}

		ctx.font = "bold 25px Courier New";
		let currentY = ctx.canvas.height / 2 - 360 + this.lines.length * 25;

		if (this.finishedRendering) {
			for (const need in this.itemsNeeded) {
				ctx.fillStyle = game.player.inventory[need] >= this.itemsNeeded[need] ? "black" : "red";
				ctx.drawImage(
					game.asset(Item.itemData[need].asset),
					ctx.canvas.width / 2 - 250 + 15, currentY,
					60, 60
				);
				ctx.fillText(
					`${game.player.inventory[need] || 0}/${this.itemsNeeded[need]}`,
					ctx.canvas.width / 2 - 250 + 70, currentY + 35
				);
				currentY += 60;
			}
		}
	}

	public getLines(ctx: CanvasRenderingContext2D) {
		ctx.font = "20px Courier New";
		ctx.fillStyle = "black";

		const words = this.text.split(" ");
		let currentLine = "";
		
		for (const word of words) {
			const width = ctx.measureText(currentLine + " " + word).width;

			if (width > 470) {
				this.lines.push(currentLine);
				currentLine = word;
			} else {
				currentLine += " " + word;
				currentLine = currentLine.trim();
			}
		}

		this.lines.push(currentLine);
	}
}

const quests = [
	new Quest(
		"So, you wanted to learn a little something about farming, did you? Well, I can help with that. I've been farming for over sixty years. Tell you what, you bring me some flowers for my garden and I'll give you some tools to get you started.",
		{
			"flower": 5,
			"water_flower": 5,
			"red_flower": 3
		},
		(game: Game) => {
			game.hoeUnlocked = true;
		}
	)
];