struct SimplexUniforms {
  uStrength:f32,
  uNoiseScale:f32,
  uOffsetX:f32,
  uOffsetY:f32,
  uOffsetZ:f32,
  uStep:f32
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
@group(1) @binding(0) var<uniform> simplexUniforms : SimplexUniforms;

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {
  var noise: f32 = simplex_noise(vec3<f32>(uv * simplexUniforms.uNoiseScale + vec2<f32>(simplexUniforms.uOffsetX, simplexUniforms.uOffsetY), simplexUniforms.uOffsetZ)) * 0.5 + 0.5;
	noise = noise + (2. * simplexUniforms.uStrength - 1.);
	noise = clamp(noise, 0.0, 1.0);
	if (simplexUniforms.uStep > 0.0) {
		noise = 1. - step(noise, simplexUniforms.uStep);
	}
	return textureSample(uTexture, uSampler, uv) * noise;
}

const MOD3: vec3<f32> = vec3<f32>(0.1031, 0.11369, 0.13787);
fn hash33(p3: vec3<f32>) -> vec3<f32> {
	var p3_var = p3;
	p3_var = fract(p3_var * MOD3);
	p3_var = p3_var + (dot(p3_var, p3_var.yxz + 19.19));
	return -1. + 2. * fract(vec3<f32>((p3_var.x + p3_var.y) * p3_var.z, (p3_var.x + p3_var.z) * p3_var.y, (p3_var.y + p3_var.z) * p3_var.x));
} 

fn simplex_noise(p: vec3<f32>) -> f32 {
	let K1: f32 = 0.33333334;
	let K2: f32 = 0.16666667;
	let i: vec3<f32> = floor(p + (p.x + p.y + p.z) * K1);
	let d0: vec3<f32> = p - (i - (i.x + i.y + i.z) * K2);
	let e: vec3<f32> = step(vec3<f32>(0.), d0 - d0.yzx);
	let i1: vec3<f32> = e * (1. - e.zxy);
	let i2: vec3<f32> = 1. - e.zxy * (1. - e);
	let d1: vec3<f32> = d0 - (i1 - 1. * K2);
	let d2: vec3<f32> = d0 - (i2 - 2. * K2);
	let d3: vec3<f32> = d0 - (1. - 3. * K2);
	let h: vec4<f32> = max(vec4<f32>(0.6) - vec4<f32>(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), vec4<f32>(0.0));
	let n: vec4<f32> = h * h * h * h * vec4<f32>(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.)));
	return dot(vec4<f32>(31.316), n);
} 