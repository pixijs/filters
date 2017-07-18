require('../check');

var filter = PIXI.filters.OutlineFilter = require('./OutlineFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}