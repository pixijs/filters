require('../check');

var filter = PIXI.filters.PixelateFilter = require('./PixelateFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}