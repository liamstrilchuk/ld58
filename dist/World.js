var World = /** @class */ (function () {
    function World(game) {
        this.WORLD_SIZE = 10;
        this.grid = [];
        this.hoveredTile = null;
        this.selectedTile = null;
        this.generateWorld(game);
    }
    World.prototype.render = function (game, ctx) {
        for (var x = 0; x < this.WORLD_SIZE; x++) {
            for (var y = 0; y < this.WORLD_SIZE; y++) {
                var tile = this.grid[x][y];
                tile.render(game, ctx, tile === this.selectedTile, tile === this.hoveredTile);
            }
        }
        if (this.selectedTile) {
            this.selectedTile.createButtons(game);
        }
        else {
            game.buttons = [];
        }
    };
    World.prototype.generateWorld = function (game) {
        noise.seed(Math.random());
        for (var x = 0; x < this.WORLD_SIZE; x++) {
            this.grid.push([]);
            for (var y = 0; y < this.WORLD_SIZE; y++) {
                var type = this.determineTileType(x, y);
                this.grid[this.grid.length - 1].push(new Tile(game, x, y, type));
            }
        }
    };
    World.prototype.determineTileType = function (x, y) {
        var val = Math.abs(noise.perlin2(x / 35, y / 35));
        var val2 = Math.abs(noise.perlin2(x / 50 + 123, y / 50 + 123));
        var combined = (val + val2) / 2;
        if (combined < 0.1) {
            return "water";
        }
        else {
            if (Math.random() < 0.3) {
                return "flower";
            }
            return "grass";
        }
    };
    return World;
}());
