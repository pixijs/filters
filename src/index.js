require('./check');

// Require built filters
var filters = {
    AsciiFilter: require('./ascii/AsciiFilter'),
    BloomFilter: require('./bloom/BloomFilter'),
    BulgePinchFilter: require('./bulgepinch/BulgePinchFilter'),
    ColorReplaceFilter: require('./colorreplace/ColorReplaceFilter'),
    ConvolutionFilter: require('./convolution/ConvolutionFilter'),
    CrossHatchFilter: require('./crosshatch/CrossHatchFilter'),
    DotFilter: require('./dot/DotFilter'),
    EmbossFilter: require('./emboss/EmbossFilter'),
    GlowFilter: require('./glow/GlowFilter'),
    OutlineFilter: require('./outline/OutlineFilter'),
    PixelateFilter: require('./pixelate/PixelateFilter'),
    RGBSplitFilter: require('./rgb/RGBSplitFilter'),
    ShockwaveFilter: require('./shockwave/ShockwaveFilter'),
    SimpleLightmapFilter: require('./simplelightmap/SimpleLightmapFilter'),
    TiltShiftFilter: require('./tiltshift/TiltShiftFilter'),
    TiltShiftAxisFilter: require('./tiltshift/TiltShiftAxisFilter'),
    TiltShiftXFilter: require('./tiltshift/TiltShiftXFilter'),
    TiltShiftYFilter: require('./tiltshift/TiltShiftYFilter'),
    TwistFilter: require('./twist/TwistFilter')
};

// Assign to filters
Object.assign(PIXI.filters, filters);

// Export for requiring
if (typeof module !== 'undefined' && module.exports) {
    module.exports = filters;
}