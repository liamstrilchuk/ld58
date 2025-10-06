var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
        __spreadArray([game.player], this.structures, true).sort(function (a, b) {
            var val1 = a instanceof Player ? game.ctx.canvas.height / 2 + 20 : a.renderY(game);
            var val2 = b instanceof Player ? game.ctx.canvas.height / 2 + 20 : b.renderY(game);
            return val1 - val2;
        }).forEach(function (entity) { return entity.render(game, ctx); });
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
        this.house = this.structures[0];
        for (var x = 0; x < this.WORLD_SIZE; x++) {
            this.grid.push([]);
            for (var y = 0; y < this.WORLD_SIZE; y++) {
                var type = this.determineTileType(x, y);
                this.grid[this.grid.length - 1].push(new Tile(game, x, y, type));
            }
        }
        game.player.y = this.WORLD_SIZE / 2 * game.TILE_SCALE * game.TILE_HEIGHT / 2 + game.TILE_HEIGHT * game.TILE_SCALE * 7;
        for (var i = 0; i < 200; i++) {
            var root = this.selectRandomTile();
            var canPlant = this.canPlaceStructure(root.x, root.y, 2, 2);
            for (var x = 0; x < 2; x++) {
                for (var y = 0; y < 2; y++) {
                    if (!this.posInWorld(x + root.x, y + root.y) || this.grid[x + root.x][y + root.y].type !== "grass") {
                        canPlant = false;
                    }
                }
            }
            if (canPlant) {
                this.structures.push(new Tree(game, root.x, root.y));
            }
        }
        this.structures.sort(function (a, b) { return a.renderY(game) - b.renderY(game); });
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
            if (Math.random() < 0.2) {
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
    World.prototype.posInWorld = function (x, y) {
        return x >= 0 && x < this.WORLD_SIZE && y >= 0 && y < this.WORLD_SIZE;
    };
    World.prototype.getAdjacentTiles = function (tile, depth, prev) {
        if (depth === void 0) { depth = 1; }
        if (prev === void 0) { prev = []; }
        if (depth === 0) {
            return [tile];
        }
        var positions = [[tile.x - 1, tile.y], [tile.x + 1, tile.y], [tile.x, tile.y - 1], [tile.x, tile.y + 1]];
        var list = [];
        if (prev.length) {
            list.push(tile);
        }
        prev.push(tile);
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
            var pos = positions_1[_i];
            if (this.posInWorld(pos[0], pos[1]) && !prev.includes(this.grid[pos[0]][pos[1]])) {
                list.push.apply(list, this.getAdjacentTiles(this.grid[pos[0]][pos[1]], depth - 1, prev));
            }
        }
        return list;
    };
    World.prototype.selectRandomTile = function () {
        var x = Math.floor(Math.random() * this.WORLD_SIZE), y = Math.floor(Math.random() * this.WORLD_SIZE);
        return this.grid[x][y];
    };
    World.prototype.canPlaceStructure = function (x, y, w, h) {
        for (var _i = 0, _a = this.structures; _i < _a.length; _i++) {
            var struct = _a[_i];
            for (var i = 0; i < w; i++) {
                for (var j = 0; j < h; j++) {
                    if (x + i >= struct.x && x + i < struct.x + struct.width
                        && y + j >= struct.y && y + j < struct.y + struct.height) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    return World;
}());
