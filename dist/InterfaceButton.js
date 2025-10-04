var InterfaceButton = /** @class */ (function () {
    function InterfaceButton(x, y) {
        this.x = x;
        this.y = y;
    }
    InterfaceButton.prototype.render = function (game, ctx) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();
    };
    return InterfaceButton;
}());
