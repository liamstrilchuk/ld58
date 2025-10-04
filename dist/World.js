var World = /** @class */ (function () {
    function World() {
        this.WORLD_SIZE = 50;
        this.grid = [];
        this.generateWorld();
    }
    World.prototype.render = function (game, ctx) {
        for (var x = 0; x < this.WORLD_SIZE; x++) {
            for (var y = 0; y < this.WORLD_SIZE; y++) {
                this.grid[x][y].render(game, ctx);
            }
        }
    };
    World.prototype.generateWorld = function () {
        for (var x = 0; x < this.WORLD_SIZE; x++) {
            this.grid.push([]);
            for (var y = 0; y < this.WORLD_SIZE; y++) {
                this.grid[this.grid.length - 1].push(new Tile(x, y, "grass"));
            }
        }
    };
    return World;
}());
