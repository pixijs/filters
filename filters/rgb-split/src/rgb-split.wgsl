struct RgbSplitUniforms {
    uRed: vec2<f32>,
    uGreen: vec2<f32>,
    uBlue: vec3<f32>,
};

struct GlobalFilterUniforms {
    uInputSize:vec4<f32>,
    uInputPixel:vec4<f32>,
    uuInputClamp:vec4<f32>,
    uOutputFrame:vec4<f32>,
    uGlobalFrame:vec4<f32>,
    uOutputTexture:vec4<f32>,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;

@group(0) @binding(1) var uSampler: texture_2d<f32>;
@group(1) @binding(0) var<uniform> rgbSplitUniforms : RgbSplitUniforms;

@fragment
fn mainFragment(
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>
) -> @location(0) vec4<f32> {
    let r = textureSample(uSampler, uSampler, vTextureCoord + rgbSplitUniforms.uRed/uInputSize.xy).r;
    let g = textureSample(uSampler, uSampler, vTextureCoord + rgbSplitUniforms.uGreen/uInputSize.xy).g;
    let b = textureSample(uSampler, uSampler, vTextureCoord + rgbSplitUniforms.uBlue/uInputSize.xy).b;
    let a = textureSample(uSampler, uSampler, vTextureCoord).a;
    return vec4<f32>(r, g, b, a);
}
