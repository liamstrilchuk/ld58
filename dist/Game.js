var Game = /** @class */ (function () {
    function Game(ctx) {
        this.keys = {};
        this.mouseDown = false;
        this.mousePos = { x: 0, y: 0 };
        this.player = new Player(0, 0);
        this.lastFrameTime = new Date().getTime();
        this.graphics = new GraphicsLoader();
        this.world = new World(this);
        this.buttons = [];
        this.TILE_WIDTH = 31;
        this.TILE_HEIGHT = 15;
        this.TILE_SCALE = 6;
        this.ctx = ctx;
    }
    Game.prototype.start = function () {
        this.update();
    };
    Game.prototype.asset = function (name) {
        return this.graphics.assets[name] || null;
    };
    Game.prototype.update = function () {
        var currentTime = new Date().getTime();
        var delta = (currentTime - this.lastFrameTime) / (1000 / 60);
        this.lastFrameTime = currentTime;
        this.player.update(this, delta);
        this.calculateHoveredTile();
        this.render();
        window.requestAnimationFrame(this.update.bind(this));
    };
    Game.prototype.render = function () {
        var _this = this;
        this.ctx.fillStyle = "#8db3c5";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.world.render(this, this.ctx);
        this.player.render(this, this.ctx);
        this.buttons.forEach(function (button) { return button.render(_this, _this.ctx); });
    };
    Game.prototype.renderX = function (x) {
        return x + this.ctx.canvas.width / 2 - this.player.x;
    };
    Game.prototype.renderY = function (y) {
        return y + this.ctx.canvas.height / 2 - this.player.y;
    };
    Game.prototype.getTileAtPos = function (rx, ry) {
        var Cw = this.ctx.canvas.width, Ch = this.ctx.canvas.height;
        var Tw = this.TILE_WIDTH, Th = this.TILE_HEIGHT, Ts = this.TILE_SCALE;
        var C1 = Th * 1 / 2 - 2.25, W = Ts * Tw, H = Ts * Th, C2 = Ts * (1 / 2 * Tw - 0.5);
        var Px = this.player.x, Py = this.player.y, Rx = rx - this.TILE_WIDTH * this.TILE_SCALE / 2, Ry = ry;
        var y = (Ry + 1 / 2 * H - 1 / 2 * Ch + Py - (Rx + 1 / 2 * W - 1 / 2 * Cw + Px) / C2 * Ts * C1) / (Ts * C1 + Ts * C1 * H / C2);
        var x = (Rx + (y * H) + (1 / 2 * W) - 1 / 2 * Cw + Px) / C2;
        if (0 <= x && x < this.world.WORLD_SIZE && 0 <= y && y < this.world.WORLD_SIZE) {
            return this.world.grid[Math.floor(x)][Math.floor(y)];
        }
        return null;
    };
    Game.prototype.calculateHoveredTile = function () {
        if (this.findHoveredButton()) {
            this.world.hoveredTile = null;
            return;
        }
        this.world.hoveredTile = this.getTileAtPos(this.mousePos.x, this.mousePos.y - 8);
    };
    Game.prototype.getKey = function (key) {
        return this.keys[key] || false;
    };
    Game.prototype.onKeyDown = function (key) {
        this.keys[key] = true;
    };
    Game.prototype.onKeyUp = function (key) {
        this.keys[key] = false;
    };
    Game.prototype.findHoveredButton = function () {
        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
            var button = _a[_i];
            if (Math.hypot(button.x - this.mousePos.x, button.y - this.mousePos.y) < 30) {
                return button;
            }
        }
        return null;
    };
    Game.prototype.onMouseDown = function () {
        this.mouseDown = true;
        var button = this.findHoveredButton();
        if (button) {
            return;
        }
        this.world.selectedTile = this.world.hoveredTile;
    };
    Game.prototype.onMouseUp = function () {
        this.mouseDown = false;
    };
    Game.prototype.onMouseMove = function (x, y) {
        this.mousePos = { x: x, y: y };
    };
    return Game;
}());
