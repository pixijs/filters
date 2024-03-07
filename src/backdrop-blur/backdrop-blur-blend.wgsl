@group(0) @binding(1) var uTexture: texture_2d<f32>; 
@group(0) @binding(2) var uSampler: sampler;
@group(1) @binding(0) var uBackground: texture_2d<f32>; 

@fragment
fn mainFragment(
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>
) -> @location(0) vec4<f32> {
    var front: vec4<f32> = textureSample(uTexture, uSampler, uv);
    var back: vec4<f32> = textureSample(uBackground, uSampler, uv);
    
    if (front.a == 0.0) {
        discard;
    }

    var color: vec3<f32> = mix(back.rgb, front.rgb / front.a, front.a);

    return vec4<f32>(color, 1.0);
}