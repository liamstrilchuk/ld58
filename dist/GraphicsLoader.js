var GraphicsLoader = /** @class */ (function () {
    function GraphicsLoader() {
        this.assets = {};
        this.player = [];
        this.loadAssets();
    }
    GraphicsLoader.prototype.loadAssets = function () {
        this.assets["blank_tile"] = this.loadImage("assets/blank_tile.png");
        this.assets["grass_tile"] = this.loadImage("assets/grass_tile.png");
        this.assets["grass_tile2"] = this.loadImage("assets/grass_tile2.png");
        this.assets["tilled_tile"] = this.loadImage("assets/tilled_tile.png");
        this.assets["tilled_seed_tile"] = this.loadImage("assets/tilled_seed_tile.png");
        this.assets["water_tile"] = this.loadImage("assets/water_tile.png");
        this.assets["water_tile2"] = this.loadImage("assets/water_tile2.png");
        this.assets["water_tile3"] = this.loadImage("assets/water_tile3.png");
        this.assets["sand_tile"] = this.loadImage("assets/sand_tile.png");
        this.assets["flower_tile"] = this.loadImage("assets/flower_tile.png");
        this.assets["red_flower_tile"] = this.loadImage("assets/red_flower_tile.png");
        this.assets["water_flower"] = this.loadImage("assets/water_flower.png");
        this.assets["house"] = this.loadImage("assets/house.png");
        this.assets["house2"] = this.loadImage("assets/house2.png");
        this.assets["house3"] = this.loadImage("assets/house3.png");
        this.assets["water_flower_icon"] = this.loadImage("assets/flowers/water_flower_icon.png");
        this.assets["white_flower_icon"] = this.loadImage("assets/flowers/white_flower_icon.png");
        this.assets["red_flower_icon"] = this.loadImage("assets/flowers/red_flower_icon.png");
        this.assets["yellow_flower_icon"] = this.loadImage("assets/flowers/yellow_flower_icon.png");
        this.assets["purple_flower_icon"] = this.loadImage("assets/flowers/purple_flower_icon.png");
        this.assets["berries_icon"] = this.loadImage("assets/flowers/berries_icon.png");
        this.assets["blue_flower_icon"] = this.loadImage("assets/flowers/blue_flower_icon.png");
        this.assets["orange_flower_icon"] = this.loadImage("assets/flowers/orange_flower_icon.png");
        this.assets["lavender_flower_icon"] = this.loadImage("assets/flowers/lavender_flower_icon.png");
        this.assets["white_flower_seeds"] = this.loadImage("assets/seeds/white_flower_seeds.png");
        this.assets["red_flower_seeds"] = this.loadImage("assets/seeds/red_flower_seeds.png");
        this.assets["purple_seeds"] = this.loadImage("assets/seeds/purple_seeds.png");
        this.assets["yellow_seeds"] = this.loadImage("assets/seeds/yellow_seeds.png");
        this.assets["berries_seeds"] = this.loadImage("assets/seeds/berries_seeds.png");
        this.assets["orange_seeds"] = this.loadImage("assets/seeds/orange_seeds.png");
        this.assets["blue_seeds"] = this.loadImage("assets/seeds/blue_seeds.png");
        this.assets["lavender_seeds"] = this.loadImage("assets/seeds/lavender_seeds.png");
        this.assets["inventory_item"] = this.loadImage("assets/inventory_item.png");
        this.assets["action_box"] = this.loadImage("assets/action_box.png");
        this.assets["action_harvest"] = this.loadImage("assets/action_harvest.png");
        this.assets["action_till"] = this.loadImage("assets/action_till.png");
        this.assets["action_x"] = this.loadImage("assets/action_x.png");
        this.assets["action_plant"] = this.loadImage("assets/action_plant.png");
        this.assets["encyclopedia"] = this.loadImage("assets/encyclopedia.png");
        this.assets["encyclopedia_icon"] = this.loadImage("assets/encyclopedia_icon.png");
        this.assets["left-off"] = this.loadImage("assets/left-off.png");
        this.assets["left-on"] = this.loadImage("assets/left-on.png");
        this.assets["right-off"] = this.loadImage("assets/right-off.png");
        this.assets["right-on"] = this.loadImage("assets/right-on.png");
        this.assets["warning"] = this.loadImage("assets/warning.png");
        this.assets["quest_box"] = this.loadImage("assets/quest_box.png");
        this.assets["expression-tongue"] = this.loadImage("assets/expression1.png");
        this.assets["expression-wink"] = this.loadImage("assets/expression2.png");
        this.assets["expression-default"] = this.loadImage("assets/expression3.png");
        this.assets["expression-o"] = this.loadImage("assets/expression4.png");
        this.assets["expression-smile"] = this.loadImage("assets/expression5.png");
        this.assets["tree1"] = this.loadImage("assets/tree1.png");
        this.assets["tree2"] = this.loadImage("assets/tree2.png");
        this.assets["tree3"] = this.loadImage("assets/tree3.png");
        this.assets["tree4"] = this.loadImage("assets/tree4.png");
        this.assets["start"] = this.loadImage("assets/start.png");
        this.assets["home"] = this.loadImage("assets/home.png");
        for (var d = 0; d < 8; d++) {
            this.player.push([]);
            for (var f = 0; f < 4; f++) {
                this.player[this.player.length - 1].push(this.loadImage("assets/player_anim/D".concat(d, "-F").concat(f, ".png")));
            }
        }
        var planted = ["purple", "red", "berries", "white", "yellow", "orange", "blue", "lavender"];
        for (var _i = 0, planted_1 = planted; _i < planted_1.length; _i++) {
            var plant = planted_1[_i];
            for (var i = 0; i < 3; i++) {
                this.assets["".concat(plant, "-stage").concat(i)] = this.loadImage("assets/planted/".concat(plant, "-stage").concat(i, ".png"));
            }
        }
    };
    GraphicsLoader.prototype.loadImage = function (src) {
        var image = new Image();
        image.src = src;
        return image;
    };
    return GraphicsLoader;
}());
