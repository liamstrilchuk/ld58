var InterfaceButton = /** @class */ (function () {
    function InterfaceButton(x, y, action) {
        this.hovered = false;
        this.x = x;
        this.y = y;
        this.action = action;
    }
    InterfaceButton.prototype.render = function (game, ctx) {
        ctx.fillStyle = "white";
        if (this.hovered) {
            ctx.drawImage(game.asset("action_harvest"), this.x - 35, this.y - 35, 70, 70);
        }
        else {
            ctx.drawImage(game.asset("action_harvest"), this.x - 30, this.y - 30, 60, 60);
        }
    };
    return InterfaceButton;
}());
