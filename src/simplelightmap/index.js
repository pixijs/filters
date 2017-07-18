require('../check');

var filter = PIXI.filters.SimpleLightmapFilter = require('./SimpleLightmapFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}