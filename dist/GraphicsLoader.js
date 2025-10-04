var GraphicsLoader = /** @class */ (function () {
    function GraphicsLoader() {
        this.assets = {};
        this.loadAssets();
    }
    GraphicsLoader.prototype.loadAssets = function () {
        this.assets["blank_tile"] = this.loadImage("assets/blank_tile.png");
        this.assets["grass_tile"] = this.loadImage("assets/grass_tile.png");
        this.assets["grass_tile2"] = this.loadImage("assets/grass_tile2.png");
        this.assets["water_tile"] = this.loadImage("assets/water_tile.png");
        this.assets["flower_tile"] = this.loadImage("assets/flower_tile.png");
    };
    GraphicsLoader.prototype.loadImage = function (src) {
        var image = new Image();
        image.src = src;
        return image;
    };
    return GraphicsLoader;
}());
