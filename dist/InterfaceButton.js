var InterfaceButton = /** @class */ (function () {
    function InterfaceButton(x, y, action) {
        this.x = x;
        this.y = y;
        this.action = action;
    }
    InterfaceButton.prototype.render = function (game, ctx) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();
    };
    return InterfaceButton;
}());
