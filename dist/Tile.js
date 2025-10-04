var Tile = /** @class */ (function () {
    function Tile(game, x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.determineImage(game);
    }
    Tile.prototype.changeType = function (game, type) {
        this.type = type;
        this.determineImage(game);
    };
    Tile.prototype.determineImage = function (game) {
        this.image = game.asset("blank_tile");
        if (this.type === "tilled") {
            this.image = game.asset("tilled_tile");
        }
        if (this.type === "water_flower") {
            this.image = game.asset("water_flower");
        }
        if (this.type === "red_flower") {
            this.image = game.asset("red_flower_tile");
        }
        if (this.type === "water") {
            var rand = Math.random();
            if (rand < 1 / 3) {
                this.image = game.asset("water_tile");
            }
            else if (rand < 2 / 3) {
                this.image = game.asset("water_tile2");
            }
            else {
                this.image = game.asset("water_tile3");
            }
        }
        if (this.type === "flower") {
            this.image = game.asset("flower_tile");
        }
        if (this.type === "grass") {
            this.image = Math.random() < 0.5 ? game.asset("grass_tile") : game.asset("grass_tile2");
        }
    };
    Tile.prototype.render = function (game, ctx, isSelected, isHovered, structures) {
        var _a = Tile.renderPos(game, this.x, this.y), renderX = _a.x, renderY = _a.y;
        if (renderX < -game.TILE_SCALE * game.TILE_WIDTH || renderX > ctx.canvas.width + game.TILE_SCALE * game.TILE_WIDTH ||
            renderY < -game.TILE_SCALE * game.TILE_HEIGHT || renderY > ctx.canvas.height + game.TILE_SCALE * game.TILE_HEIGHT) {
            return;
        }
        ctx.drawImage(this.image, renderX, renderY - (this.image.height - 21) * game.TILE_SCALE / (this.image.height / 21), game.TILE_SCALE * game.TILE_WIDTH, game.TILE_SCALE * game.TILE_HEIGHT * (this.image.height / 21));
        // for (const struct of structures) {
        // 	if (this.x >= struct.x && this.x < struct.x + struct.width && this.y >= struct.y && this.y < struct.y + struct.height) {
        // 		const inset = this.type === "water" ? 3 * game.TILE_SCALE : 0;
        // 		const inset2 = this.type === "water" ? 0.7 * game.TILE_SCALE : 1.5 * game.TILE_SCALE;
        // 		ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        // 		ctx.beginPath();
        // 		ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH / 2, renderY + inset);
        // 		ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 - inset2);
        // 		ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 + inset2);
        // 		ctx.lineTo(renderX + game.TILE_SCALE * game.TILE_WIDTH / 2, renderY + game.TILE_SCALE * game.TILE_HEIGHT);
        // 		ctx.lineTo(renderX, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 + inset2);
        // 		ctx.lineTo(renderX, renderY + game.TILE_SCALE * game.TILE_HEIGHT / 2 + inset / 2 - inset2);
        // 		ctx.fill();
        // 	}
        // }
        if (isHovered || isSelected) {
            var inset = Tile.recessedTypes.includes(this.type) ? 3 * game.TILE_SCALE : 0;
            var inset2 = Tile.recessedTypes.includes(this.type) ? 0.7 * game.TILE_SCALE : 1.5 * game.TILE_SCALE;
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
    Tile.renderPos = function (game, x, y) {
        return {
            x: game.renderX(x * game.TILE_SCALE * (game.TILE_WIDTH / 2 - 0.5)
                - y * game.TILE_SCALE * (game.TILE_HEIGHT)
                - game.TILE_SCALE * game.TILE_WIDTH / 2),
            y: game.renderY(x * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 2.25)
                + y * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 2.25)
                - game.TILE_SCALE * game.TILE_HEIGHT / 2)
        };
    };
    Tile.prototype.createButtons = function (game) {
        var options = Tile.getOptionsByType(this.type);
        var renderPos = Tile.renderPos(game, this.x, this.y);
        var Tw = game.TILE_WIDTH * game.TILE_SCALE;
        switch (options.length) {
            case 0:
                game.buttons = [];
                break;
            case 1:
                game.buttons = [
                    new InterfaceButton(renderPos.x + Tw / 2, renderPos.y - 50, options[0])
                ];
                break;
            case 2:
                game.buttons = [
                    new InterfaceButton(renderPos.x - 50 + Tw / 2, renderPos.y - 50, options[0]),
                    new InterfaceButton(renderPos.x + 50 + Tw / 2, renderPos.y - 50, options[1])
                ];
                break;
            case 3:
                game.buttons = [
                    new InterfaceButton(renderPos.x - 70 + Tw / 2, renderPos.y, options[0]),
                    new InterfaceButton(renderPos.x + Tw / 2, renderPos.y - 50, options[1]),
                    new InterfaceButton(renderPos.x + 70 + Tw / 2, renderPos.y, options[2])
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
    Tile.recessedTypes = ["water", "water_flower"];
    return Tile;
}());
