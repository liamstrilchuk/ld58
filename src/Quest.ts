class Quest {
	private text: string;
	private completedText: string;
	private lines: string[] = [];
	public finishedRendering = false;
	private charactersDone = 0;
	private itemsNeeded: { [key: string]: number };
	private onStart: (game: Game) => void;
	private onComplete: (game: Game) => void;
	public complete = false;
	private button: { x: number, y: number, w: number, h: number } = null;
	private itemsGotten: { asset: string, name: string }[];
	private startFuncRun = false;
	private beforeExp: string;
	private endExp: string;

	constructor(
		text: string,
		completedText: string,
		beforeExp: string, endExp: string,
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
		this.beforeExp = beforeExp;
		this.endExp = endExp;
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

		const asset = game.asset("quest_box");
		const left = ctx.canvas.width / 2 - 380, top = ctx.canvas.height - 800 * asset.height / asset.width + 20;
		ctx.fillStyle = "white";
		ctx.fillRect(left, top, 500, 800);

		const ratio = 800 / asset.width;
		ctx.drawImage(
			asset,
			left - 20, top - 20,
			800, 800 * asset.height / asset.width
		);

		const expression = game.asset(this.complete ? this.endExp : this.beforeExp);
		ctx.drawImage(
			expression,
			ctx.canvas.width / 2 + 125, ctx.canvas.height - ratio * expression.height + 50,
			ratio * expression.width, ratio * expression.height
		);

		ctx.font = "20px Courier New";
		ctx.fillStyle = "white";
		let charsDrawn = 0;
		
		for (let i = 0; i < this.lines.length; i++) {
			const line = this.lines[i];
			const charsToDraw = Math.min(this.charactersDone - charsDrawn, line.length);
			ctx.fillText(
				line.substring(0, charsToDraw),
				left + 15,
				top + 30 + i * 25
			);

			charsDrawn += charsToDraw;
			if (charsDrawn >= this.charactersDone) {
				break;
			}
		}

		ctx.font = "bold 25px Courier New";
		const currentY = top + 20 + this.lines.length * 25;
		let currentX = left + 5;

		if (this.finishedRendering && !this.complete) {
			const allAcquired = this.drawRequirements(game, ctx, currentX, currentY);
			const text = allAcquired ? "Press enter to continue..." : "Press enter to close...";

			ctx.font = "20px Courier New";
			ctx.fillStyle = "white";
			ctx.fillText(text, left + 15, currentY + 85);

			if (allAcquired) {
				this.button = {
					x: left, y: currentY + 70,
					w: 140, h: 50
				};
			}
		} else if (this.finishedRendering) {
			for (const item of this.itemsGotten) {
				ctx.fillStyle = "white";
				ctx.font = "17px Courier New";
				ctx.drawImage(
					game.asset(item.asset),
					currentX, currentY,
					60, 60
				);
				ctx.fillText(
					item.name,
					currentX + 65, currentY + 35
				);
				currentX += 70 + ctx.measureText(item.name).width;
			}

			ctx.font = "20px Courier New";
			const text = game.currentQuest >= quests.length - 1 ? "Press enter to close..." : "Press enter to continue...";
			ctx.fillText(text, left + 15, currentY + 85);
			this.button = {
				x: left + 20, y: currentY + 10,
				w: 140, h: 50
			};
		}
	}

	public drawRequirements(game: Game, ctx: CanvasRenderingContext2D, x: number, y: number, outline=false): boolean {
		ctx.font = "bold 25px Courier New";
		let allAcquired = true;

		for (const need in this.itemsNeeded) {
			if ((game.player.inventory[need] || 0) < this.itemsNeeded[need]) {
				allAcquired = false;
			}
			ctx.fillStyle = (game.player.inventory[need] || 0) >= this.itemsNeeded[need] ? "white" : (outline ? "red" : "#e38f8f");
			ctx.drawImage(
				game.asset(Item.itemData[need].asset),
				x, y,
				60, 60
			);

			ctx.fillText(
				`${game.player.inventory[need] || 0}/${this.itemsNeeded[need]}`,
				x + 60, y + 35
			);
			if (outline) {
				ctx.strokeStyle = "white";
				ctx.strokeText(
					`${game.player.inventory[need] || 0}/${this.itemsNeeded[need]}`,
					x + 60, y + 35
				);
			}
			x += 125;
		}

		return allAcquired;
	}

	public getLines(ctx: CanvasRenderingContext2D, text?: string) {
		text = text || this.text;
		this.lines = splitLines(ctx, text, 730);
	}

	public nextPressed(game: Game) {
		game.playAudio("blip");
		
		if (!this.finishedRendering) {
			if (!this.complete) {
				this.charactersDone = this.text.length;
			} else {
				this.charactersDone = this.completedText.length;
			}
			this.finishedRendering = true;
			return;
		}

		if (!this.complete) {
			let hasAll = true;
			for (const item in this.itemsNeeded) {
				if ((game.player.inventory[item] || 0) < this.itemsNeeded[item] && !game.testingMode) {
					hasAll = false;
				}
			}

			if (!hasAll) {
				game.questSelected = false;
				return;
			}

			for (const item in this.itemsNeeded) {
				game.player.inventory[item] -= this.itemsNeeded[item];
			}

			this.complete = true;
			this.charactersDone = 0;
			this.getLines(game.ctx, this.completedText);
			this.finishedRendering = false;

			this.onComplete(game);
		} else {
			if (game.currentQuest < quests.length - 1) {
				game.currentQuest++;
			} else {
				game.questSelected = false;
			}
		}
	}

	public onMouseDown(game: Game, x: number, y: number) {
		if (!this.button) {
			return;
		}

		if (x >= this.button.x && x <= this.button.x + this.button.w &&
			y >= this.button.y && y <= this.button.y + this.button.h) {
			this.nextPressed(game);
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
		"expression-wink",
		"expression-smile",
		{
			"flower": 5,
			"water_flower": 3,
			"red_flower": 3
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
		"Why don't you try out your new tool and farm some crops? Remember, the Sunspire needs to be grown next to water. Once you're done, I have a surprise for you.",
		"Great job on farming those crops, you're a natural! Now, I have something special to show you. This is an old encyclopedia I found laying around, it tells you everything you need to know about farming. Take a look!",
		"expression-default",
		"expression-wink",
		{
			"yellow_flower": 1
		},
		(game: Game) => {
			game.bookUnlocked = true;
			game.player.addToInventory("purple_flower_seeds", 3);
		},
		(_) => {},
		[
			{
				asset: "encyclopedia_icon",
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
		"expression-smile",
		"expression-o",
		{
			"purple_flower": 1
		},
		(game: Game) => {
			game.player.addToInventory("berries_flower_seeds", 3);
			game.encyclopedia.addEntry(
				new EncyclopediaEntry(
					"Emberfruit",
					"Fructa cordata",
					"An extremely delicious fruit, but not for amateur botanists. The Emberfruit is very particular about where it is grown. It must be next to at least three unique plants, each of which must be able to grow.",
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
				asset: "encyclopedia_icon",
				name: "Encyclopedia Entry Unlocked"
			}
		]
	),
	new Quest(
		"The Emberfruit is a tricky plant to grow, because it needs to be grown next to another plant. They're also extremely tasty! Remember, \"next\" or \"adjacent\" only means the four tiles sharing a side, not diagonals!",
		"Thanks for the snack! (nom nom) Now that you've mastered the basics, here's something a bit more complicated.",
		"expression-default",
		"expression-tongue",
		{
			"berries_flower": 1
		},
		(game: Game) => {
			game.player.addToInventory("blue_flower_seeds", 3);
			game.encyclopedia.addEntry(
				new EncyclopediaEntry(
					"Azurebell",
					"Aetheria cerulea",
					"Azurebells are challenging plants to grow, due to them being picky about their neighbours. They must be next to both a Dreamveil and an Emberfruit.",
					"blue_flower"
				)
			);
		},
		(game: Game) => {},
		[
			{
				asset: "blue_seeds",
				name: "3 x Azurebell Seeds"
			},
			{
				asset: "encyclopedia_icon",
				name: "Encyclopedia Entry Unlocked"
			}
		]
	),
	new Quest(
		"Azurebells are my favorite plant, their striking blue color sets them apart from others. It took me years to learn how to grow them, though! Let's see if you can figure it out more quickly with the help of the encyclopedia.",
		"Great work! Some more seeds for you...",
		"expression-smile",
		"expression-wink",
		{
			"blue_flower": 1
		},
		(game: Game) => {
			game.player.addToInventory("lavender_flower_seeds", 3);
			game.encyclopedia.addEntry(
				new EncyclopediaEntry(
					"Hushbloom",
					"Lavendula noctilis",
					"The fragrance of a Hushbloom can immediately relieve stress of those nearby, but it is only for some of the most experienced botanists. It must grow adjacent to a Sunspire and within two tiles of an Azurebell.",
					"lavender_flower"
				)
			);
		},
		(game: Game) => {},
		[
			{
				asset: "lavender_seeds",
				name: "3 x Hushbloom Seeds"
			},
			{
				asset: "encyclopedia_icon",
				name: "Encyclopedia Entry Unlocked"
			}
		]
	),
	new Quest(
		"The Hushbloom smells different to each person, and its fragrance can calm even the most stressed mind.",
		"<inhales> oh, smells like spring! I've taught you everything I know, but here's a final challenge for you.",
		"expression-default",
		"expression-smile",
		{
			"lavender_flower": 1
		},
		(game: Game) => {
			game.player.addToInventory("orange_flower_seeds", 3);
			game.encyclopedia.addEntry(
				new EncyclopediaEntry(
					"Maravine",
					"Aurora igniflora",
					"The large, radiant petals of a Maravine need space to grow, but it also demands neighbors of its choice. It must grow next to an Emberfruit and a Sunspire, and within two tiles of a Hushbloom, but also must have two empty adjacent tiles.",
					"orange_flower"
				)
			);
		},
		(game: Game) => {},
		[
			{
				asset: "orange_seeds",
				name: "3 x Maravine Seeds"
			},
			{
				asset: "encyclopedia_icon",
				name: "Encyclopedia Entry Unlocked"
			}
		]
	),
	new Quest(
		"The maravine is the most complex plant to exist. I've never been able to make one, despite years of trying. Just for fun, let's see if you can do it!",
		"You... did it? Well, I suppose the student has become the master. Feel free to explore around some more!",
		"expression-wink",
		"expression-smile",
		{
			"orange_flower": 1
		},
		(game: Game) => {},
		(game: Game) => {},
		[]
	)
];