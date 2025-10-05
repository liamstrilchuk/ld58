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
    function Item(x, y, name, speedMult) {
        var _this = _super.call(this, x, y) || this;
        _this.item = name;
        _this.speedMult = speedMult;
        return _this;
    }
    Item.prototype.update = function (game, delta) {
        var dir = Math.atan2(game.player.y - this.y, game.player.x - this.x);
        this.x += Math.cos(dir) * delta * 14 * this.speedMult;
        this.y += Math.sin(dir) * delta * 14 * this.speedMult;
        if (Math.hypot(game.player.x - this.x, game.player.y - this.y) < 30) {
            game.player.addToInventory(this.item, 1);
            return true;
        }
        return false;
    };
    Item.prototype.render = function (game, ctx) {
        var _a;
        var x = game.renderX(this.x), y = game.renderY(this.y);
        var asset = game.asset((_a = Item.itemData[this.item]) === null || _a === void 0 ? void 0 : _a.asset);
        ctx.drawImage(asset, x - 25, y - 25, 50, asset.height / asset.width * 50);
    };
    Item.itemData = {
        "flower": {
            "asset": "white_flower_icon",
            "name": "Sunpetal",
            "can_plant": false
        },
        "red_flower": {
            "asset": "red_flower_icon",
            "name": "Emberbloom",
            "can_plant": false
        },
        "water_flower": {
            "asset": "water_flower_icon",
            "name": "Tidebloom",
            "can_plant": false
        },
        "white_flower_seeds": {
            "asset": "white_flower_seeds",
            "name": "Sunpetal Seeds",
            "can_plant": true
        },
        "red_flower_seeds": {
            "asset": "red_flower_seeds",
            "name": "Emberbloom Seeds",
            "can_plant": true
        },
        "purple_flower_seeds": {
            "asset": "purple_seeds",
            "name": "Dreamveil Seeds",
            "can_plant": true
        },
        "purple_flower": {
            "asset": "purple_flower_icon",
            "name": "Dreamveil",
            "can_plant": false
        },
        "yellow_seeds": {
            "asset": "yellow_seeds",
            "name": "Sunspire Seeds",
            "can_plant": true
        },
        "yellow_flower": {
            "asset": "yellow_flower_icon",
            "name": "Sunspire",
            "can_plant": false
        },
        "berries_flower_seeds": {
            "asset": "berries_seeds",
            "name": "Emberfruit Seeds",
            "can_plant": true
        },
        "berries_flower": {
            "asset": "berries_icon",
            "name": "Emberfruit",
            "can_plant": false
        }
    };
    return Item;
}(Entity));
