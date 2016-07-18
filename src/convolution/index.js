require('../check');

var filter = PIXI.filters.ConvolutionFilter = require('./ConvolutionFilter');

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filter;
}