require('../check');

var filter = PIXI.filters.AsciiFilter = require('./AsciiFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}