var Tile = /** @class */ (function () {
    function Tile(game, x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.determineImage(game);
    }
    Tile.prototype.determineImage = function (game) {
        this.image = game.asset("blank_tile");
        if (this.type === "water") {
            this.image = game.asset("water_tile");
        }
        if (this.type === "flower") {
            this.image = game.asset("flower_tile");
        }
        if (this.type === "grass") {
            this.image = Math.random() < 0.5 ? game.asset("grass_tile") : game.asset("grass_tile2");
        }
    };
    Tile.prototype.render = function (game, ctx, isSelected, isHovered) {
        var _a = this.renderPos(game), renderX = _a.x, renderY = _a.y;
        if (renderX < -game.TILE_SCALE * game.TILE_WIDTH || renderX > ctx.canvas.width + game.TILE_SCALE * game.TILE_WIDTH ||
            renderY < -game.TILE_SCALE * game.TILE_HEIGHT || renderY > ctx.canvas.height + game.TILE_SCALE * game.TILE_HEIGHT) {
            return;
        }
        ctx.drawImage(this.image, renderX, renderY, game.TILE_SCALE * game.TILE_WIDTH, game.TILE_SCALE * game.TILE_HEIGHT);
        if (isHovered || isSelected) {
            var inset = this.type === "water" ? 3 * game.TILE_SCALE : 0;
            var inset2 = this.type === "water" ? 0.7 * game.TILE_SCALE : 1.5 * game.TILE_SCALE;
            ctx.fillStyle = isSelected ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)";
            ctx.beginPath();
            ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH / 2, renderY + inset);
            ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 - inset2);
            ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 + inset2);
            ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH / 2, renderY + game.TILE_SCALE * game.TILE_HEIGHT);
            ctx.lineTo(renderX, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 + inset2);
            ctx.lineTo(renderX, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 - inset2);
            ctx.fill();
        }
    };
    Tile.prototype.renderPos = function (game) {
        return {
            x: game.renderX(this.x * game.TILE_SCALE * (game.TILE_WIDTH / 2 - 0.5)
                - this.y * game.TILE_SCALE * (game.TILE_HEIGHT)
                - game.TILE_SCALE * game.TILE_WIDTH / 2),
            y: game.renderY(this.x * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 2.25)
                + this.y * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 2.25)
                - game.TILE_SCALE * game.TILE_HEIGHT / 2)
        };
    };
    Tile.prototype.createButtons = function (game) {
        var options = Tile.getOptionsByType(this.type);
        var renderPos = this.renderPos(game);
        var Tw = game.TILE_WIDTH * game.TILE_SCALE;
        switch (options.length) {
            case 0:
                game.buttons = [];
                break;
            case 1:
                game.buttons = [
                    new InterfaceButton(renderPos.x + Tw / 2, renderPos.y - 50)
                ];
                break;
            case 2:
                game.buttons = [
                    new InterfaceButton(renderPos.x - 50 + Tw / 2, renderPos.y - 50),
                    new InterfaceButton(renderPos.x + 50 + Tw / 2, renderPos.y - 50)
                ];
                break;
            case 3:
                game.buttons = [
                    new InterfaceButton(renderPos.x - 70 + Tw / 2, renderPos.y),
                    new InterfaceButton(renderPos.x + Tw / 2, renderPos.y - 50),
                    new InterfaceButton(renderPos.x + 70 + Tw / 2, renderPos.y)
                ];
                break;
        }
    };
    Tile.getOptionsByType = function (type) {
        var options = [];
        switch (type) {
            case "grass":
                options.push("till");
                break;
            case "flower":
                options.push("till", "harvest");
                break;
        }
        return options;
    };
    return Tile;
}());
