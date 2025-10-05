var Encyclopedia = /** @class */ (function () {
    function Encyclopedia() {
        this.entries = [];
        this.currentPage = 0;
        this.entries = [
            new EncyclopediaEntry("Sunpetal", "Solnaria alba", "A common flower.", "flower"),
            new EncyclopediaEntry("Emberbloom", "Velutina ardens", "A common flower.", "red_flower"),
            new EncyclopediaEntry("Tidebloom", "Nymphaea lunaris", "A common flower. Found in aquatic environments.", "water_flower")
        ];
    }
    Encyclopedia.prototype.render = function (game, ctx) {
        var top = ctx.canvas.height / 2 - 300, left = ctx.canvas.width / 2 - 250;
        ctx.fillStyle = "white";
        ctx.fillRect(left, top, 500, 600);
        this.entries[this.currentPage].render(game, ctx, top, left);
    };
    Encyclopedia.prototype.prevItem = function () {
        this.currentPage = Math.max(0, this.currentPage - 1);
    };
    Encyclopedia.prototype.nextItem = function () {
        this.currentPage = Math.min(this.entries.length - 1, this.currentPage + 1);
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
            this.descLines = splitLines(ctx, this.desc);
        }
        ctx.drawImage(game.asset("inventory_item"), left + 20, top + 20, 100, 100);
        ctx.drawImage(game.asset(Item.itemData[this.itemName].asset), left + 30, top + 30, 80, 80);
        ctx.fillStyle = "black";
        ctx.font = "bold 25px Courier New";
        ctx.fillText(this.name, left + 20, top + 150);
        ctx.font = "italic 15px Courier New";
        ctx.fillText(this.sciName, left + 20, top + 175);
        ctx.font = "20px Courier New";
        for (var i = 0; i < this.descLines.length; i++) {
            ctx.fillText(this.descLines[i], left + 20, top + 205 + i * 25);
        }
    };
    return EncyclopediaEntry;
}());
