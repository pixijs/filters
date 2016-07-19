require('../check');

var filter = PIXI.filters.CrossHatchFilter = require('./CrossHatchFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}