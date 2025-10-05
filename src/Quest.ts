class Quest {
	private text: string;
	private completedText: string;
	private lines: string[] = [];
	private finishedRendering = false;
	private charactersDone = 0;
	private itemsNeeded: { [key: string]: number };
	private onStart: (game: Game) => void;
	private onComplete: (game: Game) => void;
	private complete = false;
	private button: { x: number, y: number, w: number, h: number } = null;
	private itemsGotten: { asset: string, name: string }[];
	private startFuncRun = false;

	constructor(
		text: string,
		completedText: string,
		needs: { [key: string]: number },
		onComplete: (game: Game) => void,
		onStart: (game: Game) => void,
		itemsGotten: { asset: string, name: string }[]
	) {
		this.text = text;
		this.completedText = completedText;
		this.itemsNeeded = needs;
		this.onStart = onStart;
		this.onComplete = onComplete;
		this.itemsGotten = itemsGotten;
	}

	public render(game: Game, ctx: CanvasRenderingContext2D) {
		if (!this.startFuncRun) {
			this.startFuncRun = true;
			this.onStart(game);
		}
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
				ctx.fillStyle = (game.player.inventory[need] || 0) >= this.itemsNeeded[need] ? "black" : "red";
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
			for (const item of this.itemsGotten) {
				ctx.fillStyle = "black";
				ctx.font = "20px Courier New";
				ctx.drawImage(
					game.asset(item.asset),
					left + 15, currentY,
					60, 60
				);
				ctx.fillText(
					item.name,
					left + 85, currentY + 35
				);
				currentY += 60;
			}

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

function splitLines(ctx: CanvasRenderingContext2D, text: string, maxWidth=470): string[] {
	const lines = [];
	ctx.font = "20px Courier New";
	ctx.fillStyle = "black";

	const words = text.split(" ");
	let currentLine = "";
	
	for (const word of words) {
		const width = ctx.measureText(currentLine + " " + word).width;

		if (width > maxWidth) {
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
		"So, you wanted to learn a little something about farming, did you? Well, I can help with that. I've been farming for years. Tell you what, you bring me some flowers for my garden and I'll give you some tools to get you started.",
		"Oh, thank you! As promised, here's a tool that'll help you get started farming in no time. Take some seeds as well. Once you've tried it out, come back here and I'll give you something else.",
		{
			"flower": 0,//5,
			"water_flower": 0,//3,
			"red_flower": 0//3
		},
		(game: Game) => {
			game.hoeUnlocked = true;
			game.player.addToInventory("yellow_flower_seeds", 3);
		},
		(_) => {},
		[
			{
				asset: "action_till",
				name: "Hoe Unlocked"
			},
			{
				asset: "yellow_seeds",
				name: "3 x Sunspire Seeds"
			}
		]
	),
	new Quest(
		"Why don't you try out your new tool and farm some crops? Once you're done, I have a surprise for you.",
		"Great job on farming those crops, you're a natural! Now, I have something special to show you. This is an old encyclopedia I found laying around, it tells you everything you need to know about farming. Take a look!",
		{
			"yellow_flower": 0//1
		},
		(game: Game) => {
			game.bookUnlocked = true;
			game.player.addToInventory("purple_flower_seeds", 3);
		},
		(_) => {},
		[
			{
				asset: "action_harvest",
				name: "Encyclopedia Unlocked (press E)"
			},
			{
				asset: "purple_seeds",
				name: "3 x Dreamveil Seeds"
			}
		]
	),
	new Quest(
		"Here are some more seeds to try growing. Let me know once you figure it out! Make sure to look in the encyclopedia to see what this plant needs to grow.",
		"Wow, I'm impressed! Now, a new challenge for you...",
		{
			"purple_flower": 0//1
		},
		(game: Game) => {
			game.player.addToInventory("berries_flower_seeds", 3);
			game.encyclopedia.addEntry(
				new EncyclopediaEntry(
					"Emberfruit",
					"Fructa cordata",
					"An extremely delicious fruit, but not for amateur botanists. The Emberfruit is very particular about where it is grown. It must be next to water, and have an Emberbloom growing adjacent to it.",
					"berries_flower"
				)
			);
		},
		(game: Game) => {},
		[
			{
				asset: "berries_seeds",
				name: "3 x Emberfruit Seeds"
			},
			{
				asset: "berries_seeds",
				name: "Encyclopedia Entry Unlocked"
			}
		]
	),
	new Quest(
		"The Emberfruit is a tricky plant to grow, because it needs to be grown next to another plant. They're also extremely tasty!",
		"Thanks for the snack! (nom nom)",
		{
			"berries_flower": 0//1
		},
		(game: Game) => {},
		(game: Game) => {},
		[]
	)
];