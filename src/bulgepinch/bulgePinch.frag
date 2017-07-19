uniform float radius;
uniform float strength;
uniform vec2 center;
uniform sampler2D uSampler;
uniform vec4 dimensions;
varying vec2 vTextureCoord;
void main()
{
    vec2 coord = vTextureCoord * dimensions.xy;
    coord -= center;
    float distance = length(coord);
    if (distance < radius) {
        float percent = distance / radius;
        if (strength > 0.0) {
            coord *= mix(1.0, smoothstep(0.0, radius /     distance, percent), strength * 0.75);
        } else {
            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);
        }
    }
    coord += center;
    gl_FragColor = texture2D(uSampler, coord / dimensions.xy);
    vec2 clampedCoord = clamp(coord, vec2(0.0), dimensions.xy);
    if (coord != clampedCoord) {
    gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));
    }
}
