struct ColorReplaceUniforms {
  uOriginalColor: vec3<f32>,
  uTargetColor: vec4<f32>,
  uTolerance: f32,
  uSmoothness: f32,
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
  let doReplace = colorReplaceUniforms.uSmoothness <= 0.0
    ? step(colorReplaceUniforms.uTolerance, colorDistance)
    : smoothstep(colorReplaceUniforms.uTolerance - colorReplaceUniforms.uSmoothness, colorReplaceUniforms.uTolerance + colorReplaceUniforms.uSmoothness, colorDistance);

  return vec4<f32>(
    mix(colorReplaceUniforms.uTargetColor.rgb * sample.a * colorReplaceUniforms.uTargetColor.a, sample.rgb, doReplace),
    mix(colorReplaceUniforms.uTargetColor.a, sample.a, doReplace)
  );
}