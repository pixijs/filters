@group(0) @binding(1) var uTexture: texture_2d<f32>; 
@group(0) @binding(2) var uSampler: sampler;

@fragment
fn mainFragment(
    @location(0) uv: vec2<f32>,
    @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {
    let lum: f32 = length(textureSample(uTexture, uSampler, uv).rgb);

    if (lum < 1.00)
    {
        if (modulo(position.x + position.y, 10.0) == 0.0)
        {
            return vec4<f32>(0.0, 0.0, 0.0, 1.0);
        }
    }

    if (lum < 0.75)
    {
        if (modulo(position.x - position.y, 10.0) == 0.0)
        {
            return vec4<f32>(0.0, 0.0, 0.0, 1.0);
        }
    }

    if (lum < 0.50)
    {
        if (modulo(position.x + position.y - 5.0, 10.0) == 0.0)
        {
            return vec4<f32>(0.0, 0.0, 0.0, 1.0);
        }
    }

    if (lum < 0.3)
    {
        if (modulo(position.x - position.y - 5.0, 10.0) == 0.0)
        {
            return vec4<f32>(0.0, 0.0, 0.0, 1.0);
        }
    }

    return vec4<f32>(1.0);
}

fn modulo(x: f32, y: f32) -> f32
{
  return x - y * floor(x/y);
}