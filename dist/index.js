var game;
window.addEventListener("load", function () {
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
    game = new Game(ctx);
    game.renderHome();
    window.addEventListener("keydown", function (event) { return game.onKeyDown(event.key.toLowerCase()); });
    window.addEventListener("keyup", function (event) { return game.onKeyUp(event.key.toLowerCase()); });
    window.addEventListener("mousedown", function () { return game.onMouseDown(); });
    window.addEventListener("mouseup", function () { return game.onMouseUp(); });
    window.addEventListener("mousemove", function (event) { return game.onMouseMove(event.clientX, event.clientY); });
    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.imageSmoothingEnabled = false;
    });
    window.addEventListener("contextmenu", function (event) { return event.preventDefault(); });
});
