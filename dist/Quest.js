var Quest = /** @class */ (function () {
    function Quest(text, needs, onComplete) {
        this.lines = [];
        this.finishedRendering = false;
        this.charactersDone = 0;
        this.complete = false;
        this.text = text;
        this.itemsNeeded = needs;
        this.onComplete = onComplete;
    }
    Quest.prototype.render = function (game, ctx) {
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
        var charsDrawn = 0;
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            var charsToDraw = Math.min(this.charactersDone - charsDrawn, line.length);
            ctx.fillText(line.substring(0, charsToDraw), ctx.canvas.width / 2 - 250 + 15, ctx.canvas.height / 2 - 370 + i * 25, 470);
            charsDrawn += charsToDraw;
            if (charsDrawn >= this.charactersDone) {
                break;
            }
        }
        ctx.font = "bold 25px Courier New";
        var currentY = ctx.canvas.height / 2 - 360 + this.lines.length * 25;
        if (this.finishedRendering) {
            for (var need in this.itemsNeeded) {
                ctx.fillStyle = game.player.inventory[need] >= this.itemsNeeded[need] ? "black" : "red";
                ctx.drawImage(game.asset(Item.itemData[need].asset), ctx.canvas.width / 2 - 250 + 15, currentY, 60, 60);
                ctx.fillText("".concat(game.player.inventory[need] || 0, "/").concat(this.itemsNeeded[need]), ctx.canvas.width / 2 - 250 + 70, currentY + 35);
                currentY += 60;
            }
        }
    };
    Quest.prototype.getLines = function (ctx) {
        ctx.font = "20px Courier New";
        ctx.fillStyle = "black";
        var words = this.text.split(" ");
        var currentLine = "";
        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
            var word = words_1[_i];
            var width = ctx.measureText(currentLine + " " + word).width;
            if (width > 470) {
                this.lines.push(currentLine);
                currentLine = word;
            }
            else {
                currentLine += " " + word;
                currentLine = currentLine.trim();
            }
        }
        this.lines.push(currentLine);
    };
    return Quest;
}());
var quests = [
    new Quest("So, you wanted to learn a little something about farming, did you? Well, I can help with that. I've been farming for over sixty years. Tell you what, you bring me some flowers for my garden and I'll give you some tools to get you started.", {
        "flower": 5,
        "water_flower": 5,
        "red_flower": 3
    }, function (game) {
        game.hoeUnlocked = true;
    })
];
