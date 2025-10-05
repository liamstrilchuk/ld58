var InterfaceButton = /** @class */ (function () {
    function InterfaceButton(x, y, action) {
        this.hovered = false;
        this.x = x;
        this.y = y;
        this.action = action;
    }
    InterfaceButton.prototype.render = function (game, ctx) {
        if (!this.asset) {
            switch (this.action) {
                case "harvest":
                    this.asset = game.asset("action_harvest");
                    break;
                case "till":
                    this.asset = game.asset("action_till");
                    break;
            }
        }
        ctx.fillStyle = "white";
        if (this.hovered) {
            ctx.drawImage(this.asset, this.x - 35, this.y - 35, 70, 70);
        }
        else {
            ctx.drawImage(this.asset, this.x - 30, this.y - 30, 60, 60);
        }
    };
    return InterfaceButton;
}());
