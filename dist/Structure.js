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
var Structure = /** @class */ (function (_super) {
    __extends(Structure, _super);
    function Structure(x, y, width, height, assets, animSpeed) {
        var _this = _super.call(this, x, y) || this;
        _this.frame = 0;
        _this.assets = assets;
        _this.width = width;
        _this.height = height;
        _this.animSpeed = animSpeed;
        return _this;
    }
    Structure.prototype.render = function (game, ctx) {
        var asset = this.assets[this.frame];
        var _a = Tile.renderPos(game, this.x, this.y + 3), x = _a.x, y = _a.y;
        var Tw = game.TILE_WIDTH * game.TILE_SCALE, Th = game.TILE_HEIGHT * game.TILE_SCALE;
        var imgScale = (this.width * Tw) / asset.width;
        var eachSide = (asset.width * imgScale - this.width * Tw) / 2;
        ctx.drawImage(asset, x - eachSide - Tw / 2, y - asset.width * imgScale / 2 + Th / 2, this.width * Tw * 0.9, this.height * Tw * 0.9);
        if (game.frame % this.animSpeed === 0) {
            this.frame = (this.frame + 1) % this.assets.length;
        }
    };
    return Structure;
}(Entity));
var House = /** @class */ (function (_super) {
    __extends(House, _super);
    function House(game, x, y) {
        return _super.call(this, x, y, 5, 5, [game.asset("house"), game.asset("house2"), game.asset("house3")], 60) || this;
    }
    House.prototype.update = function (game, delta) { return false; };
    ;
    return House;
}(Structure));
