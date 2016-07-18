require('../check');

var filter = PIXI.filters.EmbossFilter = require('./EmbossFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}