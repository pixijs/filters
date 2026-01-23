struct ColorMapUniforms {
  uMix: f32,
  uSize: f32,
  uPixelSize: f32,
  uSlicePixelSize: f32,
  uNearest: f32,
};

@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;
@group(1) @binding(0) var<uniform> cmu: ColorMapUniforms;
@group(1) @binding(1) var uMapTexture: texture_2d<f32>;
@group(1) @binding(2) var uMapSampler: sampler;

@fragment
fn mainFragment(
  @builtin(position) position: vec4<f32>,
  @location(0) uv : vec2<f32>
) -> @location(0) vec4<f32> {
  let innerSize = cmu.uSize - 1.0;
  let color:vec4<f32> = textureSample(uTexture, uSampler, uv);
  let base = vec3(color.rgb / color.a);
  let redGreen = vec2(base.r * (cmu.uPixelSize - cmu.uSlicePixelSize) + 0.5 * cmu.uSlicePixelSize, base.g * (1.0 - cmu.uPixelSize) + 0.5 * cmu.uPixelSize);
  let blueScaled = min(innerSize, base.b * innerSize);
  let blueOffset = floor(blueScaled);

  return vec4(mix(base, mix(
      textureSample(uMapTexture, uMapSampler, redGreen + vec2(blueOffset * cmu.uPixelSize, 0.0)).rgb,
      textureSample(uMapTexture, uMapSampler, redGreen + vec2(min(innerSize, blueOffset + 1.0) * cmu.uPixelSize, 0.0)).rgb,
      mix(fract(blueScaled), step(0.5, blueScaled - blueOffset), cmu.uNearest)),
    cmu.uMix) * color.a, color.a);
}