require('../check');

var filter = PIXI.filters.BulgePinchFilter = require('./BulgePinchFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}