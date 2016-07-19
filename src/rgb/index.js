require('../check');

var filter = PIXI.filters.RGBSplitFilter = require('./RGBSplitFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}