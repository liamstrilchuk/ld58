class Quest {
	private text: string;
	private completedText: string;
	private lines: string[] = [];
	private finishedRendering = false;
	private charactersDone = 0;
	private itemsNeeded: { [key: string]: number };
	private onComplete: (game: Game) => void;
	private complete = false;
	private button: { x: number, y: number, w: number, h: number } = null;

	constructor(
		text: string,
		completedText: string,
		needs: { [key: string]: number },
		onComplete: (game: Game) => void
	) {
		this.text = text;
		this.completedText = completedText;
		this.itemsNeeded = needs;
		this.onComplete = onComplete;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		this.button = null;

		if (!this.finishedRendering && game.frame % 1 === 0) {
			this.charactersDone++;

			if ((!this.complete && this.charactersDone >= this.text.length) ||
				(this.complete && this.charactersDone >= this.completedText.length)) {
				this.finishedRendering = true;
			}
		}

		const left = ctx.canvas.width / 2 - 250, top = ctx.canvas.height / 2 - 400;
		ctx.fillStyle = "white";
		ctx.fillRect(left, top, 500, 800);

		ctx.font = "20px Courier New";
		ctx.fillStyle = "black";
		let charsDrawn = 0;
		
		for (let i = 0; i < this.lines.length; i++) {
			const line = this.lines[i];
			const charsToDraw = Math.min(this.charactersDone - charsDrawn, line.length);
			ctx.fillText(
				line.substring(0, charsToDraw),
				left + 15,
				top + 30 + i * 25,
				470
			);

			charsDrawn += charsToDraw;
			if (charsDrawn >= this.charactersDone) {
				break;
			}
		}

		ctx.font = "bold 25px Courier New";
		let currentY = top + 40 + this.lines.length * 25;

		if (this.finishedRendering && !this.complete) {
			let allAcquired = true;

			for (const need in this.itemsNeeded) {
				if ((game.player.inventory[need] || 0) < this.itemsNeeded[need]) {
					allAcquired = false;
				}
				ctx.fillStyle = game.player.inventory[need] >= this.itemsNeeded[need] ? "black" : "red";
				ctx.drawImage(
					game.asset(Item.itemData[need].asset),
					left + 15, currentY,
					60, 60
				);
				ctx.fillText(
					`${game.player.inventory[need] || 0}/${this.itemsNeeded[need]}`,
					left + 70, currentY + 35
				);
				currentY += 60;
			}

			if (allAcquired) {
				ctx.fillStyle = "#ddd";
				ctx.fillRect(left + 20, currentY + 10, 140, 50);

				ctx.font = "18px Courier New";
				ctx.fillStyle = "black";
				ctx.fillText("Give Items", left + 35, currentY + 40);
				this.button = {
					x: left + 20, y: currentY + 10,
					w: 140, h: 50
				};
			}
		} else if (this.finishedRendering) {
			ctx.fillStyle = "#ddd";
			ctx.fillRect(left + 20, currentY + 10, 140, 50);

			ctx.font = "18px Courier New";
			ctx.fillStyle = "black";
			ctx.fillText("Next Quest", left + 35, currentY + 40);
			this.button = {
				x: left + 20, y: currentY + 10,
				w: 140, h: 50
			};
		}
	}

	public getLines(ctx: CanvasRenderingContext2D, text?: string) {
		text = text || this.text;
		this.lines = splitLines(ctx, text);
	}

	public onMouseDown(game: Game, x: number, y: number) {
		if (!this.button) {
			return;
		}

		if (x >= this.button.x && x <= this.button.x + this.button.w &&
			y >= this.button.y && y <= this.button.y + this.button.h) {
			if (!this.complete) {
				this.complete = true;
				this.charactersDone = 0;
				this.getLines(game.ctx, this.completedText);
				this.finishedRendering = false;

				for (const item in this.itemsNeeded) {
					game.player.inventory[item] -= this.itemsNeeded[item];
				}

				this.onComplete(game);
			} else {
				game.currentQuest++;
			}
		}
	}
}

function splitLines(ctx: CanvasRenderingContext2D, text: string): string[] {
	const lines = [];
	ctx.font = "20px Courier New";
	ctx.fillStyle = "black";

	const words = text.split(" ");
	let currentLine = "";
	
	for (const word of words) {
		const width = ctx.measureText(currentLine + " " + word).width;

		if (width > 470) {
			lines.push(currentLine);
			currentLine = word;
		} else {
			currentLine += " " + word;
			currentLine = currentLine.trim();
		}
	}

	lines.push(currentLine);
	return lines;
}

const quests = [
	new Quest(
		"So, you wanted to learn a little something about farming, did you? Well, I can help with that. I've been farming for over sixty years. Tell you what, you bring me some flowers for my garden and I'll give you some tools to get you started.",
		"Oh, thank you! As promised, here's a tool that'll help you get started farming in no time. Take some seeds as well. Once you've tried it out, come back here and I'll give you something else.",
		{
			"flower": 0,//5,
			"water_flower": 0,//3,
			"red_flower": 0//3
		},
		(game: Game) => {
			game.hoeUnlocked = true;
		}
	),
	new Quest(
		"Why don't you try out your new tool and farm some crops? Once you're done, I have a surprise for you.",
		"Great job on farming those crops, you're a natural! Now, I have something special to show you. This is an old encyclopedia I found laying around, it tells you everything you need to know about farming. Take a look!",
		{

		},
		(game: Game) => {
			game.bookUnlocked = true;
		}
	)
];