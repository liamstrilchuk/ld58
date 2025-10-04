var World = /** @class */ (function () {
    function World(game) {
        this.WORLD_SIZE = 10;
        this.grid = [];
        this.selectedTile = null;
        this.generateWorld(game);
    }
    World.prototype.render = function (game, ctx) {
        for (var x = 0; x < this.WORLD_SIZE; x++) {
            for (var y = 0; y < this.WORLD_SIZE; y++) {
                this.grid[x][y].render(game, ctx, this.grid[x][y] === this.selectedTile);
            }
        }
    };
    World.prototype.generateWorld = function (game) {
        noise.seed(Math.random());
        for (var x = 0; x < this.WORLD_SIZE; x++) {
            this.grid.push([]);
            for (var y = 0; y < this.WORLD_SIZE; y++) {
                var val = Math.abs(noise.perlin2(x / 35, y / 35));
                var val2 = Math.abs(noise.perlin2(x / 50 + 123, y / 50 + 123));
                var combined = (val + val2) / 2;
                this.grid[this.grid.length - 1].push(new Tile(game, x, y, combined < 0.1 ? "water" : "grass"));
            }
        }
    };
    return World;
}());
