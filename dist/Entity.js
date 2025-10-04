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
var Entity = /** @class */ (function () {
    function Entity(x, y) {
        this.x = x;
        this.y = y;
    }
    return Entity;
}());
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(x, y, name) {
        var _this = _super.call(this, x, y) || this;
        _this.item = name;
        return _this;
    }
    Item.prototype.update = function (game, delta) {
        var dir = Math.atan2(game.player.y - this.y, game.player.x - this.x);
        this.x += Math.cos(dir) * delta * 10;
        this.y += Math.sin(dir) * delta * 10;
        if (Math.hypot(game.player.x - this.x, game.player.y - this.y) < 30) {
            game.player.addToInventory(this.item, 1);
            return true;
        }
        return false;
    };
    Item.prototype.render = function (game, ctx) {
        var x = game.renderX(this.x), y = game.renderY(this.y);
        ctx.fillStyle = "black";
        ctx.fillRect(x - 10, y - 10, 20, 20);
    };
    return Item;
}(Entity));
