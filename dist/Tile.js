var Tile = /** @class */ (function () {
    function Tile(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    Tile.prototype.render = function (game, ctx) {
        var renderX = game.renderX(this.x * game.TILE_SCALE * game.TILE_WIDTH / 2
            - this.y * game.TILE_SCALE * game.TILE_HEIGHT
            - game.TILE_SCALE * game.TILE_WIDTH / 2);
        var renderY = game.renderY(this.x * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 1.75)
            + this.y * game.TILE_SCALE * (game.TILE_HEIGHT / 2 - 1.75)
            - game.TILE_SCALE * game.TILE_HEIGHT / 2);
        ctx.drawImage(game.asset("blank_tile"), renderX, renderY, game.TILE_SCALE * game.TILE_WIDTH, game.TILE_SCALE * game.TILE_HEIGHT);
    };
    return Tile;
}());
