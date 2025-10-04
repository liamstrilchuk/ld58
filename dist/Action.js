var Action = /** @class */ (function () {
    function Action(tile, action) {
        this.progress = 0;
        this.tile = tile;
        this.action = action;
    }
    Action.prototype.update = function (game, delta) {
        this.progress += delta;
        if (this.progress > Action.actionTimes[this.action]) {
            this.onCompletion(game);
            return true;
        }
        return false;
    };
    Action.prototype.render = function (game, ctx) {
        var _a = Tile.renderPos(game, this.tile.x, this.tile.y), x = _a.x, y = _a.y;
        var Tw = game.TILE_WIDTH * game.TILE_SCALE;
        ctx.fillStyle = "white";
        ctx.fillRect(x + Tw / 4, y - 30, Tw / 2, 15);
        ctx.fillStyle = "blue";
        ctx.fillRect(x + 2 + Tw / 4, y - 28, (Tw / 2 - 4) * this.progress / Action.actionTimes[this.action], 11);
    };
    Action.prototype.addItem = function (game, name) {
        var _a = Tile.renderPos(game, this.tile.x, this.tile.y), x = _a.x, y = _a.y;
        game.addEntity(new Item(x + game.player.x - game.ctx.canvas.width / 2 + game.TILE_SCALE * game.TILE_WIDTH / 2, y + game.player.y - game.ctx.canvas.height / 2 + game.TILE_SCALE * game.TILE_HEIGHT / 2, name));
    };
    Action.prototype.onCompletion = function (game) {
        if (this.tile.type === "flower" && this.action === "harvest") {
            this.addItem(game, "flower");
            this.tile.changeType(game, "grass");
        }
        if (this.tile.type === "water_flower" && this.action === "harvest") {
            this.addItem(game, "water_flower");
            this.tile.changeType(game, "water");
        }
        if (this.tile.type === "red_flower" && this.action === "harvest") {
            this.addItem(game, "red_flower");
            this.tile.changeType(game, "grass");
        }
        if (["flower", "grass"].includes(this.tile.type) && this.action === "till") {
            this.tile.changeType(game, "tilled");
        }
    };
    Action.actionTimes = {
        harvest: 30,
        till: 60
    };
    return Action;
}());
