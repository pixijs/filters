require('../check');

var filter = PIXI.filters.DropShadowFilter = require('./DropShadowFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}