
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform sampler2D colorMap;

uniform float _mix;
uniform float _size;
uniform float _sliceSize;
uniform float _slicePixelSize;
uniform float _sliceInnerSize;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord.xy);

    float sliceIndex = color.b * (_size - 1.0);
    float zSlice0 = floor(sliceIndex);
    float zSlice1 = ceil(sliceIndex);

    float xOffset = _slicePixelSize * 0.5 + color.r * _sliceInnerSize;
    float s0 = xOffset + zSlice0 * _sliceSize;
    float s1 = xOffset + zSlice1 * _sliceSize;
    vec4 slice0Color = texture2D(colorMap, vec2(s0, color.g));
    vec4 slice1Color = texture2D(colorMap, vec2(s1, color.g));
    vec4 adjusted = mix(slice0Color, slice1Color, fract(sliceIndex));

    gl_FragColor = mix(color, adjusted, _mix);
}
