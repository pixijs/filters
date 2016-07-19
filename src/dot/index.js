require('../check');

var filter = PIXI.filters.DotFilter = require('./DotFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}