precision highp float;

in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform sampler2D uMapTexture;
uniform float uMix;
uniform float uSize;
uniform float uPixelSize;
uniform float uSlicePixelSize;
uniform float uNearest;

void main() {
  float innerSize = uSize - 1.0;
  vec4 c = texture(uTexture, vTextureCoord);
  c.rgb = c.rgb / c.a;
  vec2 redGreen = vec2(c.r * (uPixelSize - uSlicePixelSize) + 0.5 * uSlicePixelSize, c.g * (1.0 - uPixelSize) + 0.5 * uPixelSize);
  float blueScaled = min(innerSize, c.b * innerSize);
  float blueOffset = floor(blueScaled);

  finalColor = vec4(mix(c.rgb, mix(
    texture(uMapTexture, redGreen + vec2(blueOffset * uPixelSize, 0.0)).rgb,
    texture(uMapTexture, redGreen + vec2(min(innerSize, blueOffset + 1.0) * uPixelSize, 0.0)).rgb,
    mix(fract(blueScaled), step(0.5, blueScaled - blueOffset), uNearest)),
  uMix) * c.a, c.a);
}
