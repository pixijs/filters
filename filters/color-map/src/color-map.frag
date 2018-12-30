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
    float innerWidth = _size - 1.0;
    float zSlice0 = min(floor(color.b * innerWidth), innerWidth);
    float zSlice1 = min(zSlice0 + 1.0, innerWidth);
    float xOffset = _slicePixelSize * 0.5 + color.r * _sliceInnerSize;
    float s0 = xOffset + (zSlice0 * _sliceSize);
    float s1 = xOffset + (zSlice1 * _sliceSize);
    float yOffset = _sliceSize * 0.5 + color.g * (1.0 - _sliceSize);
    vec4 slice0Color = texture2D(colorMap, vec2(s0,yOffset));
    vec4 slice1Color = texture2D(colorMap, vec2(s1,yOffset));
    float zOffset = fract(color.b * innerWidth);
    vec4 adjusted = mix(slice0Color, slice1Color, zOffset);
    gl_FragColor = vec4(mix(color, adjusted, _mix).rgb, color.a);
}
