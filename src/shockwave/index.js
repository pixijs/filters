require('../check');

var filter = PIXI.filters.ShockwaveFilter = require('./ShockwaveFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}