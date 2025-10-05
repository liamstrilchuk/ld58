var Quest = /** @class */ (function () {
    function Quest(text, completedText, needs, onComplete, itemsGotten) {
        this.lines = [];
        this.finishedRendering = false;
        this.charactersDone = 0;
        this.complete = false;
        this.button = null;
        this.text = text;
        this.completedText = completedText;
        this.itemsNeeded = needs;
        this.onComplete = onComplete;
        this.itemsGotten = itemsGotten;
    }
    Quest.prototype.render = function (game, ctx) {
        this.button = null;
        if (!this.finishedRendering && game.frame % 1 === 0) {
            this.charactersDone++;
            if ((!this.complete && this.charactersDone >= this.text.length) ||
                (this.complete && this.charactersDone >= this.completedText.length)) {
                this.finishedRendering = true;
            }
        }
        var left = ctx.canvas.width / 2 - 250, top = ctx.canvas.height / 2 - 400;
        ctx.fillStyle = "white";
        ctx.fillRect(left, top, 500, 800);
        ctx.font = "20px Courier New";
        ctx.fillStyle = "black";
        var charsDrawn = 0;
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            var charsToDraw = Math.min(this.charactersDone - charsDrawn, line.length);
            ctx.fillText(line.substring(0, charsToDraw), left + 15, top + 30 + i * 25, 470);
            charsDrawn += charsToDraw;
            if (charsDrawn >= this.charactersDone) {
                break;
            }
        }
        ctx.font = "bold 25px Courier New";
        var currentY = top + 40 + this.lines.length * 25;
        if (this.finishedRendering && !this.complete) {
            var allAcquired = true;
            for (var need in this.itemsNeeded) {
                if ((game.player.inventory[need] || 0) < this.itemsNeeded[need]) {
                    allAcquired = false;
                }
                ctx.fillStyle = game.player.inventory[need] >= this.itemsNeeded[need] ? "black" : "red";
                ctx.drawImage(game.asset(Item.itemData[need].asset), left + 15, currentY, 60, 60);
                ctx.fillText("".concat(game.player.inventory[need] || 0, "/").concat(this.itemsNeeded[need]), left + 70, currentY + 35);
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
        }
        else if (this.finishedRendering) {
            for (var _i = 0, _a = this.itemsGotten; _i < _a.length; _i++) {
                var item = _a[_i];
                ctx.fillStyle = "black";
                ctx.font = "20px Courier New";
                ctx.drawImage(game.asset(item.asset), left + 15, currentY, 60, 60);
                ctx.fillText(item.name, left + 85, currentY + 35);
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
    };
    Quest.prototype.getLines = function (ctx, text) {
        text = text || this.text;
        this.lines = splitLines(ctx, text);
    };
    Quest.prototype.onMouseDown = function (game, x, y) {
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
                for (var item in this.itemsNeeded) {
                    game.player.inventory[item] -= this.itemsNeeded[item];
                }
                this.onComplete(game);
            }
            else {
                game.currentQuest++;
            }
        }
    };
    return Quest;
}());
function splitLines(ctx, text, maxWidth) {
    if (maxWidth === void 0) { maxWidth = 470; }
    var lines = [];
    ctx.font = "20px Courier New";
    ctx.fillStyle = "black";
    var words = text.split(" ");
    var currentLine = "";
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
        }
        else {
            currentLine += " " + word;
            currentLine = currentLine.trim();
        }
    }
    lines.push(currentLine);
    return lines;
}
var quests = [
    new Quest("So, you wanted to learn a little something about farming, did you? Well, I can help with that. I've been farming for over sixty years. Tell you what, you bring me some flowers for my garden and I'll give you some tools to get you started.", "Oh, thank you! As promised, here's a tool that'll help you get started farming in no time. Take some seeds as well. Once you've tried it out, come back here and I'll give you something else.", {
        "flower": 0,
        "water_flower": 0,
        "red_flower": 0 //3
    }, function (game) {
        game.hoeUnlocked = true;
        game.player.addToInventory("yellow_flower_seeds", 3);
    }, [
        {
            asset: "action_till",
            name: "Hoe Unlocked"
        },
        {
            asset: "yellow_seeds",
            name: "3 x Sunspire Seeds"
        }
    ]),
    new Quest("Why don't you try out your new tool and farm some crops? Once you're done, I have a surprise for you.", "Great job on farming those crops, you're a natural! Now, I have something special to show you. This is an old encyclopedia I found laying around, it tells you everything you need to know about farming. Take a look!", {
        "yellow_flower": 1
    }, function (game) {
        game.bookUnlocked = true;
    }, [
        {
            asset: "action_harvest",
            name: "Encyclopedia Unlocked"
        }
    ])
];
