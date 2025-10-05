var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.speed = 3;
        _this.walkFrame = 0;
        _this.walkDir = 0;
        _this.inventory = {};
        return _this;
    }
    Player.prototype.update = function (game, delta) {
        var keys = {
            left: game.getKey("a") || game.getKey("arrowleft"),
            right: game.getKey("d") || game.getKey("arrowright"),
            up: game.getKey("w") || game.getKey("arrowup"),
            down: game.getKey("s") || game.getKey("arrowdown")
        };
        var angles = [
            { active: keys.left, angle: Math.PI },
            { active: keys.down, angle: Math.PI / 2 },
            { active: keys.right, angle: 0 },
            { active: keys.up, angle: Math.PI * 3 / 2 },
            { active: keys.left && keys.down, angle: Math.PI * 6 / 7 },
            { active: keys.left && keys.up, angle: Math.PI * 7 / 6 },
            { active: keys.right && keys.down, angle: Math.PI / 6 },
            { active: keys.right && keys.up, angle: Math.PI * (2 - 1 / 6) }
        ];
        var dir;
        for (var i = 0; i < angles.length; i++) {
            if (angles[i].active) {
                dir = angles[i].angle;
                this.walkDir = i;
            }
        }
        var overTile = game.getTileAtPos(game.ctx.canvas.width / 2, game.ctx.canvas.height / 2);
        var speed = (overTile === null || overTile === void 0 ? void 0 : overTile.type) === "water" ? this.speed / 2 : this.speed;
        if (typeof dir === "undefined") {
            return;
        }
        if (game.frame % 5 === 0) {
            this.walkFrame = (this.walkFrame + 1) % 4;
        }
        var newX = Math.cos(dir) * speed * delta;
        var newY = Math.sin(dir) * speed * delta;
        if (game.getTileAtPos(game.ctx.canvas.width / 2 + newX, game.ctx.canvas.height / 2)) {
            this.x += newX;
        }
        if (game.getTileAtPos(game.ctx.canvas.width / 2, game.ctx.canvas.height / 2 + newY)) {
            this.y += newY;
        }
        return false;
    };
    Player.prototype.render = function (game, ctx) {
        var asset = game.graphics.player[this.walkDir][this.walkFrame];
        ctx.drawImage(asset, game.renderX(this.x) - 60, game.renderY(this.y) - 60 * (asset.height / asset.width), 120, 120 * (asset.height / asset.width));
    };
    Player.prototype.addToInventory = function (name, amount) {
        if (!this.inventory[name]) {
            this.inventory[name] = 0;
        }
        this.inventory[name] += amount;
    };
    return Player;
}(Entity));
