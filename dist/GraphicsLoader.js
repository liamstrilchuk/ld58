var GraphicsLoader = /** @class */ (function () {
    function GraphicsLoader() {
        this.assets = {};
        this.loadAssets();
    }
    GraphicsLoader.prototype.loadAssets = function () {
        this.assets["blank_tile"] = this.loadImage("assets/blank_tile.png");
    };
    GraphicsLoader.prototype.loadImage = function (src) {
        var image = new Image();
        image.src = src;
        return image;
    };
    return GraphicsLoader;
}());
