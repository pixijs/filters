require('../check');

var filter = PIXI.filters.GlowFilter = require('./GlowFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}