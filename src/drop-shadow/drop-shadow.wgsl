struct DropShadowUniforms {
  uAlpha: f32,
  uColor: vec3<f32>,
  uOffset: vec2<f32>,
  uShadowOnly: f32,
};

struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;

@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;
@group(1) @binding(0) var<uniform> dropShadowUniforms : DropShadowUniforms;
@group(1) @binding(1) var uMapTexture: texture_2d<f32>;

@fragment
fn mainFragment(
  @builtin(position) position: vec4<f32>,
  @location(0) uv : vec2<f32>
) -> @location(0) vec4<f32> {
  let shadowAlpha: f32 = textureSample(uMapTexture, uSampler, uv - dropShadowUniforms.uOffset * gfu.uInputSize.zw).a * dropShadowUniforms.uAlpha;
  let shadow: vec4<f32> = vec4<f32>(dropShadowUniforms.uColor.rgb * shadowAlpha, shadowAlpha);

  let fg: vec4<f32> = textureSample(uTexture, uSampler, uv) * (1.0 - dropShadowUniforms.uShadowOnly);

  return fg + shadow * (1.0 - fg.a);
}
