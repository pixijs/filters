struct EmbossUniforms {
  uStrength:f32,
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
@group(1) @binding(0) var<uniform> embossUniforms : EmbossUniforms;

@fragment
fn mainFragment(
  @builtin(position) position: vec4<f32>,
  @location(0) uv : vec2<f32>
) -> @location(0) vec4<f32> {
  let onePixel: vec2<f32> = vec2<f32>(1.0 / gfu.uInputSize.xy);
	var color: vec3<f32> = vec3<f32>(0.5);

	color -= (textureSample(uTexture, uSampler, uv - onePixel) * embossUniforms.uStrength).rgb;
	color += (textureSample(uTexture, uSampler, uv + onePixel) * embossUniforms.uStrength).rgb;

	color = vec3<f32>((color.r + color.g + color.b) / 3.0);

	let blendColor: vec4<f32> = textureSample(uTexture, uSampler, uv);

	return vec4<f32>(color.rgb * blendColor.a, blendColor.a);
}