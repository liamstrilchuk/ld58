var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var game = new Game(ctx);
window.addEventListener("keydown", function (event) { return game.onKeyDown(event.key.toLowerCase()); });
window.addEventListener("keyup", function (event) { return game.onKeyUp(event.key.toLowerCase()); });
