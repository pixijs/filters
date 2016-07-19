// Make sure PIXI global object is available
if (typeof PIXI === "undefined") {
    throw new Error('pixi.js is required to be included');
}