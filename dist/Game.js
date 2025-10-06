var Game = /** @class */ (function () {
    function Game(ctx) {
        this.keys = {};
        this.mouseDown = false;
        this.mousePos = { x: 0, y: 0 };
        this.player = new Player(0, 0);
        this.lastFrameTime = new Date().getTime();
        this.graphics = new GraphicsLoader();
        this.currentAction = null;
        this.entities = [];
        this.buttons = [];
        this.encyclopedia = new Encyclopedia();
        this.TILE_WIDTH = 31;
        this.TILE_HEIGHT = 15;
        this.TILE_SCALE = 6;
        this.frame = 0;
        this.hoeUnlocked = false;
        this.bookUnlocked = false;
        this.currentQuest = 0;
        this.questSelected = false;
        this.encyclopediaSelected = false;
        this.selectingSeeds = false;
        this.infoText = "";
        this.inventoryButtons = [];
        this.canOpenQuest = false;
        this.testingMode = false;
        this.started = false;
        this.startButtonPos = [0, 0, 0, 0];
        this.ctx = ctx;
        this.world = new World(this);
    }
    Game.prototype.addEntity = function (entity) {
        this.entities.push(entity);
    };
    Game.prototype.renderHome = function () {
        if (this.started) {
            return;
        }
        var home = this.asset("home");
        var height = this.ctx.canvas.height, width = this.ctx.canvas.height * home.width / home.height;
        if (this.ctx.canvas.width * home.height / home.width < this.ctx.canvas.height) {
            this.ctx.drawImage(home, 0, 0, this.ctx.canvas.height * home.width / home.height, this.ctx.canvas.height);
        }
        else {
            this.ctx.drawImage(home, 0, 0, this.ctx.canvas.width, this.ctx.canvas.width * home.height / home.width);
            height = this.ctx.canvas.width * home.height / home.width;
            width = this.ctx.canvas.width;
        }
        var start = this.asset("start");
        if (this.mousePos.x >= width * 0.07 && this.mousePos.x < width * 0.07 + 200 &&
            this.mousePos.y >= height * 0.45 && this.mousePos.y < height * 0.45 + 200 * start.height / start.width) {
            this.ctx.drawImage(start, width * 0.07 - 5, height * 0.45 - 5 * start.height / start.width, 210, 210 * start.height / start.width);
        }
        else {
            this.ctx.drawImage(start, width * 0.07, height * 0.45, 200, 200 * start.height / start.width);
        }
        this.startButtonPos = [width * 0.07, height * 0.45, 200, 200 * start.height / start.width];
        window.requestAnimationFrame(this.renderHome.bind(this));
    };
    Game.prototype.start = function () {
        var _this = this;
        this.started = true;
        quests.forEach(function (quest) { return quest.getLines(_this.ctx); });
        this.update();
    };
    Game.prototype.asset = function (name) {
        return this.graphics.assets[name] || null;
    };
    Game.prototype.update = function () {
        var _a;
        this.frame++;
        var currentTime = new Date().getTime();
        var delta = (currentTime - this.lastFrameTime) / (1000 / 60);
        this.lastFrameTime = currentTime;
        this.player.update(this, delta);
        this.world.update(this, delta);
        for (var i = this.entities.length - 1; i > -1; i--) {
            if (this.entities[i].update(this, delta)) {
                this.entities.splice(i, 1);
            }
        }
        if ((_a = this.currentAction) === null || _a === void 0 ? void 0 : _a.update(this, delta)) {
            this.currentAction = null;
        }
        this.calculateHoveredTile();
        this.render();
        window.requestAnimationFrame(this.update.bind(this));
    };
    Game.prototype.render = function () {
        var _this = this;
        var _a, _b;
        this.infoText = "";
        this.ctx.fillStyle = "#8db3c5";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.world.render(this, this.ctx);
        this.entities.forEach(function (entity) { return entity.render(game, _this.ctx); });
        this.world.renderAfter(this, this.ctx);
        this.buttons.forEach(function (button) { return button.render(_this, _this.ctx); });
        (_a = this.currentAction) === null || _a === void 0 ? void 0 : _a.render(this, this.ctx);
        (_b = this.world.selectedTile) === null || _b === void 0 ? void 0 : _b.renderSelectedTile(this, this.ctx);
        this.renderInterface();
    };
    Game.prototype.renderInterface = function () {
        var _a;
        var index = 0;
        this.inventoryButtons = [];
        for (var item in this.player.inventory) {
            if (this.selectingSeeds && !Item.itemData[item].can_plant) {
                continue;
            }
            if (this.player.inventory[item] > 0) {
                if (this.mousePos.x >= index * 85 + 5 && this.mousePos.x <= index * 85 + 85 &&
                    this.mousePos.y >= this.ctx.canvas.height - 85 && this.mousePos.y <= this.ctx.canvas.height - 5) {
                    this.ctx.font = "20px Courier New";
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect(index * 85 + 5, this.ctx.canvas.height - 125, this.ctx.measureText(Item.itemData[item].name).width + 30, 30);
                    this.ctx.fillStyle = "white";
                    this.ctx.fillText(Item.itemData[item].name, index * 85 + 20, this.ctx.canvas.height - 105);
                }
                this.inventoryButtons.push({
                    x: index * 85 + 5, y: this.ctx.canvas.height - 85,
                    w: 80, h: 80,
                    item: item
                });
                this.ctx.drawImage(this.asset("inventory_item"), index * 85 + 5, this.ctx.canvas.height - 85, 80, 80);
                this.ctx.drawImage(this.asset((_a = Item.itemData[item]) === null || _a === void 0 ? void 0 : _a.asset), index * 85 + 18, this.ctx.canvas.height - 75, 60, 60);
                this.ctx.fillStyle = "white";
                this.ctx.textAlign = "left";
                this.ctx.font = "bold 28px Garamond";
                this.ctx.fillText(this.player.inventory[item].toString(), index * 85 + 19, this.ctx.canvas.height - 22);
                this.ctx.strokeStyle = "black";
                this.ctx.strokeText(this.player.inventory[item].toString(), index * 85 + 19, this.ctx.canvas.height - 22);
                index++;
            }
        }
        if (this.selectingSeeds) {
            this.infoText = "Select seeds from your inventory";
        }
        if (this.questSelected && this.currentQuest < quests.length) {
            quests[this.currentQuest].render(this, this.ctx);
        }
        if (this.encyclopediaSelected) {
            this.encyclopedia.render(this, this.ctx);
        }
        if (this.infoText) {
            this.drawInfoText(this.infoText);
        }
        if (!this.questSelected && quests[this.currentQuest].finishedRendering && !quests[this.currentQuest].complete) {
            quests[this.currentQuest].drawRequirements(this, this.ctx, 10, 10, true);
        }
    };
    Game.prototype.drawInfoText = function (text) {
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 30px Courier New";
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, game.ctx.canvas.width / 2, game.ctx.canvas.height / 2 + 100);
        this.ctx.strokeStyle = "black";
        this.ctx.strokeText(text, game.ctx.canvas.width / 2, game.ctx.canvas.height / 2 + 100);
        this.ctx.textAlign = "left";
    };
    Game.prototype.renderX = function (x) {
        return x + this.ctx.canvas.width / 2 - this.player.x;
    };
    Game.prototype.renderY = function (y) {
        return y + this.ctx.canvas.height / 2 - this.player.y;
    };
    Game.prototype.getTileAtPos = function (rx, ry) {
        var Cw = this.ctx.canvas.width, Ch = this.ctx.canvas.height;
        var Tw = this.TILE_WIDTH, Th = this.TILE_HEIGHT, Ts = this.TILE_SCALE;
        var C1 = Th * 1 / 2 - 2.25, W = Ts * Tw, H = Ts * Th, C2 = Ts * (1 / 2 * Tw - 0.5);
        var Px = this.player.x, Py = this.player.y, Rx = rx - this.TILE_WIDTH * this.TILE_SCALE / 2, Ry = ry;
        var y = (Ry + 1 / 2 * H - 1 / 2 * Ch + Py - (Rx + 1 / 2 * W - 1 / 2 * Cw + Px) / C2 * Ts * C1) / (Ts * C1 + Ts * C1 * H / C2);
        var x = (Rx + (y * H) + (1 / 2 * W) - 1 / 2 * Cw + Px) / C2;
        if (0 <= x && x < this.world.WORLD_SIZE && 0 <= y && y < this.world.WORLD_SIZE) {
            return this.world.grid[Math.floor(x)][Math.floor(y)];
        }
        return null;
    };
    Game.prototype.structureAtTile = function (tile) {
        for (var _i = 0, _a = this.world.structures; _i < _a.length; _i++) {
            var struct = _a[_i];
            if (tile.x >= struct.x && tile.x < struct.x + Math.min(struct.width, 4) &&
                tile.y >= struct.y && tile.y < struct.y + struct.height && struct.collide) {
                return true;
            }
        }
        return false;
    };
    Game.prototype.calculateHoveredTile = function () {
        if (this.findHoveredButton()) {
            this.world.hoveredTile = null;
            return;
        }
        this.world.hoveredTile = this.getTileAtPos(this.mousePos.x, this.mousePos.y - 8);
    };
    Game.prototype.getKey = function (key) {
        return this.keys[key] || false;
    };
    Game.prototype.onKeyDown = function (key) {
        if (!this.started) {
            return;
        }
        if (key === "q") {
            if (this.questSelected) {
                this.questSelected = false;
            }
            else if (this.canOpenQuest) {
                this.questSelected = true;
            }
            this.encyclopediaSelected = false;
        }
        if (key === "e" && this.bookUnlocked) {
            this.encyclopediaSelected = !this.encyclopediaSelected;
            this.questSelected = false;
        }
        if (key === "escape") {
            this.encyclopediaSelected = false;
            this.questSelected = false;
            this.selectingSeeds = false;
        }
        if (key === "enter" && this.questSelected) {
            quests[this.currentQuest].nextPressed(this);
        }
        if (key === "arrowleft" && this.encyclopediaSelected) {
            this.encyclopedia.prevItem();
            return;
        }
        if (key === "arrowright" && this.encyclopediaSelected) {
            this.encyclopedia.nextItem();
            return;
        }
        this.keys[key] = true;
    };
    Game.prototype.onKeyUp = function (key) {
        this.keys[key] = false;
    };
    Game.prototype.findHoveredButton = function () {
        for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
            var button = _a[_i];
            if (Math.hypot(button.x - this.mousePos.x, button.y - this.mousePos.y) < 30) {
                return button;
            }
        }
        return null;
    };
    Game.prototype.onMouseDown = function () {
        if (!this.started) {
            var bp = this.startButtonPos;
            if (this.mousePos.x >= bp[0] && this.mousePos.x <= bp[0] + bp[2] &&
                this.mousePos.y >= bp[1] && this.mousePos.y <= bp[1] + bp[3]) {
                this.start();
            }
            return;
        }
        this.mouseDown = true;
        if (this.questSelected) {
            quests[this.currentQuest].onMouseDown(this, this.mousePos.x, this.mousePos.y);
            return;
        }
        if (this.encyclopediaSelected) {
            this.encyclopedia.onMouseDown(this, this.mousePos.x, this.mousePos.y);
            return;
        }
        for (var _i = 0, _a = this.inventoryButtons; _i < _a.length; _i++) {
            var ib = _a[_i];
            if (this.mousePos.x >= ib.x && this.mousePos.x < ib.x + ib.w &&
                this.mousePos.y >= ib.y && this.mousePos.y < ib.y + ib.h) {
                if (this.selectingSeeds && Item.itemData[ib.item]["can_plant"]) {
                    this.player.inventory[ib.item]--;
                    this.currentAction = new Action(this.world.selectedTile, "plant", {
                        item: ib.item
                    });
                    this.selectingSeeds = false;
                    this.world.selectedTile = null;
                }
                return;
            }
        }
        var button = this.findHoveredButton();
        if (button) {
            if (this.currentAction || !this.world.selectedTile) {
                return;
            }
            if (button.action !== "plant") {
                this.currentAction = new Action(this.world.selectedTile, button.action);
                this.world.selectedTile = null;
            }
            else {
                this.selectingSeeds = true;
            }
            return;
        }
        if (this.world.hoveredTile && !this.structureAtTile(this.world.hoveredTile)) {
            if (this.world.selectedTile === this.world.hoveredTile) {
                this.world.selectedTile = null;
            }
            else {
                this.world.selectedTile = this.world.hoveredTile;
            }
            this.selectingSeeds = false;
        }
    };
    Game.prototype.onMouseUp = function () {
        this.mouseDown = false;
    };
    Game.prototype.onMouseMove = function (x, y) {
        this.mousePos = { x: x, y: y };
    };
    return Game;
}());
