struct ColorReplaceUniforms {
  uOriginalColor: vec3<f32>,
  uTargetColor: vec4<f32>,
  uTolerance: f32,
};

@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;
@group(1) @binding(0) var<uniform> colorReplaceUniforms : ColorReplaceUniforms;

@fragment
fn mainFragment(
  @builtin(position) position: vec4<f32>,
  @location(0) uv : vec2<f32>
) -> @location(0) vec4<f32> {
  let sample = textureSample(uTexture, uSampler, uv);

  let colorDistance = sample.a >= 0.00001 ? length(colorReplaceUniforms.uOriginalColor - (sample.rgb / sample.a)) : 0.0;
  let doReplace = step(colorDistance, colorReplaceUniforms.uTolerance);

  return vec4<f32>(
    mix(sample.rgb, colorReplaceUniforms.uTargetColor.rgb * sample.a * colorReplaceUniforms.uTargetColor.a, doReplace),
    mix(sample.a, colorReplaceUniforms.uTargetColor.a, doReplace)
  );
}