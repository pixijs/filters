require('../check');

var filter = PIXI.filters.ColorReplaceFilter = require('./ColorReplaceFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}