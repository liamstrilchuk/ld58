var Action = /** @class */ (function () {
    function Action(tile, action, params) {
        this.progress = 0;
        this.tile = tile;
        this.action = action;
        this.params = params;
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
    Action.prototype.addItem = function (game, name, speedMult) {
        if (speedMult === void 0) { speedMult = 1; }
        var _a = Tile.renderPos(game, this.tile.x, this.tile.y), x = _a.x, y = _a.y;
        game.addEntity(new Item(x + game.player.x - game.ctx.canvas.width / 2 + game.TILE_SCALE * game.TILE_WIDTH / 2, y + game.player.y - game.ctx.canvas.height / 2 + game.TILE_SCALE * game.TILE_HEIGHT / 2, name, speedMult));
    };
    Action.prototype.harvest = function (game, items, changeTo) {
        var speed = 1;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            this.addItem(game, item, speed);
            speed *= 0.9;
        }
        this.tile.changeType(game, changeTo);
    };
    Action.prototype.onCompletion = function (game) {
        if (this.action === "remove") {
            switch (this.tile.type) {
                case "red_flower_tilled":
                    this.harvest(game, ["red_flower_seeds"], "tilled");
                    break;
                case "white_flower_tilled":
                    this.harvest(game, ["white_flower_seeds"], "tilled");
                    break;
                case "yellow_flower_tilled":
                    this.harvest(game, ["yellow_flower_seeds"], "tilled");
                    break;
                case "purple_flower_tilled":
                    this.harvest(game, ["purple_flower_seeds"], "tilled");
                    break;
                case "berries_flower_tilled":
                    this.harvest(game, ["berries_flower_seeds"], "tilled");
                    break;
            }
            this.tile.stage = 0;
        }
        if (this.action === "harvest") {
            switch (this.tile.type) {
                case "flower":
                    this.harvest(game, ["flower", "white_flower_seeds"], "grass");
                    break;
                case "water_flower":
                    this.harvest(game, ["water_flower"], "water");
                    break;
                case "red_flower":
                    this.harvest(game, ["red_flower", "red_flower_seeds"], "grass");
                    break;
                case "red_flower_tilled":
                    this.harvest(game, ["red_flower", "red_flower_seeds", "red_flower_seeds"], "tilled");
                    break;
                case "white_flower_tilled":
                    this.harvest(game, ["flower", "white_flower_seeds", "white_flower_seeds"], "tilled");
                    break;
                case "yellow_flower_tilled":
                    this.harvest(game, ["yellow_flower", "yellow_flower_seeds", "yellow_flower_seeds"], "tilled");
                    break;
                case "purple_flower_tilled":
                    this.harvest(game, ["purple_flower", "purple_flower_seeds", "purple_flower_seeds"], "tilled");
                    break;
                case "berries_flower_tilled":
                    this.harvest(game, ["berries_flower", "berries_flower_seeds", "berries_flower_seeds"], "tilled");
                    break;
            }
            this.tile.stage = 0;
        }
        if (["flower", "grass", "red_flower", "sand"].includes(this.tile.type) && this.action === "till") {
            this.tile.changeType(game, "tilled");
        }
        if (this.action === "plant") {
            switch (this.params["item"]) {
                case "white_flower_seeds":
                    this.tile.changeType(game, "white_flower_tilled");
                    break;
                case "red_flower_seeds":
                    this.tile.changeType(game, "red_flower_tilled");
                    break;
                case "purple_flower_seeds":
                    this.tile.changeType(game, "purple_flower_tilled");
                    break;
                case "yellow_flower_seeds":
                    this.tile.changeType(game, "yellow_flower_tilled");
                    break;
                case "berries_flower_seeds":
                    this.tile.changeType(game, "berries_flower_tilled");
                    break;
            }
        }
    };
    Action.actionTimes = {
        harvest: 30,
        till: 60,
        plant: 20,
        remove: 20
    };
    return Action;
}());
