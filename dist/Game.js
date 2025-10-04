var Game = /** @class */ (function () {
    function Game(ctx) {
        this.keys = {};
        this.ctx = ctx;
    }
    Game.prototype.getKey = function (key) {
        return this.keys[key] || false;
    };
    Game.prototype.onKeyDown = function (key) {
        this.keys[key] = true;
    };
    Game.prototype.onKeyUp = function (key) {
        this.keys[key] = false;
    };
    return Game;
}());
