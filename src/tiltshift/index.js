require('../check');

var filters = {
    TiltShiftFilter: require('./TiltShiftFilter'),
    TiltShiftXFilter: require('./TiltShiftFilter'),
    TiltShiftYFilter: require('./TiltShiftFilter'),
    TiltShiftAxisFilter: require('./TiltShiftAxisFilter')
};

Object.assign(PIXI.filters, filters);

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filters;
}