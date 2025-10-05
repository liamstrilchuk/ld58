var Encyclopedia = /** @class */ (function () {
    function Encyclopedia() {
        this.entries = [];
        this.currentPage = 0;
        this.entries = [
            new EncyclopediaEntry("Sunpetal", "Solnaria alba", "A common flower.", "flower"),
            new EncyclopediaEntry("Emberbloom", "Velutina ardens", "A common flower.", "red_flower"),
            new EncyclopediaEntry("Tidebloom", "Nymphaea lunaris", "A common flower. Found in aquatic environments.", "water_flower"),
            new EncyclopediaEntry("Sunspire", "Heliora aurelia", "A rugged plant, which can be grown almost anywhere. Has been described as tasting like lemons.", "yellow_flower"),
            new EncyclopediaEntry("Dreamveil", "Nymphaea violacea", "A distant relative of the Tidebloom. Must be grown adjacent to water. Said to treat many kinds of ailments, though this has not been proven.", "purple_flower")
        ];
    }
    Encyclopedia.prototype.addEntry = function (entry) {
        this.entries.push(entry);
    };
    Encyclopedia.prototype.render = function (game, ctx) {
        var top = ctx.canvas.height / 2 - 400, left = ctx.canvas.width / 2 - 400;
        var asset = game.asset("encyclopedia");
        ctx.drawImage(asset, left, top, 800, 800 * (asset.height / asset.width));
        var leftAsset = game.asset(this.currentPage === 0 ? "left-off" : "left-on");
        if (game.mousePos.x >= left + 150 && game.mousePos.x <= left + 150 + 96 &&
            game.mousePos.y >= top + 595 && game.mousePos.y <= top + 595 + 96 && !game.mouseDown) {
            ctx.drawImage(leftAsset, left + 146, top + 591, 104, 104);
        }
        else {
            ctx.drawImage(leftAsset, left + 150, top + 595, 96, 96);
        }
        var rightAsset = game.asset(this.currentPage === this.entries.length - 1 ? "right-off" : "right-on");
        if (game.mousePos.x >= left + 520 && game.mousePos.x <= left + 520 + 96 &&
            game.mousePos.y >= top + 595 && game.mousePos.y <= top + 595 + 96 && !game.mouseDown) {
            ctx.drawImage(rightAsset, left + 516, top + 591, 104, 104);
        }
        else {
            ctx.drawImage(rightAsset, left + 520, top + 595, 96, 96);
        }
        this.entries[this.currentPage].render(game, ctx, top + 90, left + 150);
    };
    Encyclopedia.prototype.prevItem = function () {
        this.currentPage = Math.max(0, this.currentPage - 1);
    };
    Encyclopedia.prototype.nextItem = function () {
        this.currentPage = Math.min(this.entries.length - 1, this.currentPage + 1);
    };
    Encyclopedia.prototype.onMouseDown = function (game, x, y) {
        var top = game.ctx.canvas.height / 2 - 400, left = game.ctx.canvas.width / 2 - 400;
        if (x >= left + 150 && x <= left + 150 + 96 &&
            y >= top + 595 && y <= top + 595 + 96) {
            this.prevItem();
        }
        if (x >= left + 520 && x <= left + 520 + 96 &&
            y >= top + 595 && y <= top + 595 + 96) {
            this.nextItem();
        }
    };
    return Encyclopedia;
}());
var EncyclopediaEntry = /** @class */ (function () {
    function EncyclopediaEntry(name, sciName, desc, itemName) {
        this.name = name;
        this.sciName = sciName;
        this.desc = desc;
        this.itemName = itemName;
    }
    EncyclopediaEntry.prototype.render = function (game, ctx, top, left) {
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
        for (var i = 0; i < this.descLines.length; i++) {
            ctx.fillText(this.descLines[i], left + 20, top + 155 + i * 25);
        }
    };
    return EncyclopediaEntry;
}());
