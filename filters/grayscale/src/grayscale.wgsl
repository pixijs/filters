@group(0) @binding(1) var uSampler: texture_2d<f32>;

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {
  let color: vec4<f32> = textureSample(uSampler, uSampler, uv);

  let g: f32 = dot(color.rgb, vec3<f32>(0.299, 0.587, 0.114));
  return vec4<f32>(vec3<f32>(g), 1.);
}