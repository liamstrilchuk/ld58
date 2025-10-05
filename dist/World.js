var World = /** @class */ (function () {
    function World(game) {
        this.WORLD_SIZE = 50;
        this.grid = [];
        this.hoveredTile = null;
        this.selectedTile = null;
        this.structures = [];
        this.generateWorld(game);
    }
    World.prototype.render = function (game, ctx) {
        for (var x = 0; x < this.WORLD_SIZE; x++) {
            for (var y = 0; y < this.WORLD_SIZE; y++) {
                var tile = this.grid[x][y];
                tile.render(game, ctx, tile === this.selectedTile, tile === this.hoveredTile, this.structures);
            }
        }
    };
    World.prototype.update = function (game, delta) {
        for (var x = 0; x < this.WORLD_SIZE; x++) {
            for (var y = 0; y < this.WORLD_SIZE; y++) {
                this.grid[x][y].update(game, delta);
            }
        }
    };
    World.prototype.renderAfter = function (game, ctx) {
        this.structures.forEach(function (struct) { return struct.render(game, ctx); });
        if (this.selectedTile) {
            this.selectedTile.createButtons(game);
            game.buttons.forEach(function (button) { return button.hovered = false; });
            var button = game.findHoveredButton();
            if (button) {
                button.hovered = true;
            }
        }
        else {
            game.buttons = [];
        }
    };
    World.prototype.generateWorld = function (game) {
        noise.seed(Math.random());
        this.structures.push(new House(game, Math.floor(this.WORLD_SIZE / 2) - 2, Math.floor(this.WORLD_SIZE / 2) - 2));
        for (var x = 0; x < this.WORLD_SIZE; x++) {
            this.grid.push([]);
            for (var y = 0; y < this.WORLD_SIZE; y++) {
                var type = this.determineTileType(x, y);
                this.grid[this.grid.length - 1].push(new Tile(game, x, y, type));
            }
        }
        game.player.y = this.WORLD_SIZE / 2 * game.TILE_SCALE * game.TILE_HEIGHT;
    };
    World.prototype.determineTileType = function (x, y) {
        var val = Math.abs(noise.perlin2(x / 30, y / 30));
        var val2 = Math.abs(noise.perlin2(x / 50 + 123, y / 50 + 123));
        var dist = Math.hypot(x - this.structures[0].x, y - this.structures[0].y);
        var combined = val * 0.6 + val2 * 0.4
            + Math.pow(Math.max(0, 15 - dist), 0.5) / 20;
        if (combined < 0.15) {
            if (Math.random() < 0.05) {
                return "water_flower";
            }
            return "water";
        }
        else if (combined < 0.18) {
            return "sand";
        }
        else {
            if (Math.random() < 0.3) {
                if (Math.random() < 0.8) {
                    return "flower";
                }
                else {
                    return "red_flower";
                }
            }
            return "grass";
        }
    };
    World.prototype.getAdjacentTiles = function (tile) {
        var positions = [[tile.x - 1, tile.y], [tile.x + 1, tile.y], [tile.x, tile.y - 1], [tile.x, tile.y + 1]];
        var list = [];
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
            var pos = positions_1[_i];
            if (pos[0] >= 0 && pos[0] < this.WORLD_SIZE && pos[1] >= 0 && pos[1] < this.WORLD_SIZE) {
                list.push(this.grid[pos[0]][pos[1]]);
            }
        }
        return list;
    };
    return World;
}());
