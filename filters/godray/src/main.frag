varying vec2 vTextureCoord;
uniform float time;
uniform float angle;
uniform float gain;
uniform float lacunarity;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec2 dimensions;

$perlin

void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    vec2 coord = vTextureCoord * vec2(filterArea.x / dimensions.x, 1.0 - filterArea.y / dimensions.y);
    float xx = cos(radians(angle));
    float yy = sin(radians(angle));
    vec3 dir = vec3((xx * coord.x) + (yy * coord.y), (xx * coord.x) + (yy * coord.y), 0.0);
    float noise = turb(dir + vec3(time, 0.0, 62.1 + time), vec3(480.0, 320.0, 480.0), lacunarity, gain);
    noise = mix(noise, 0.0, 0.3);
    //fade vertically.
    vec4 mist = vec4(noise, noise, noise, 1.0) * coord.y;
    mist.a = 1.0;
    gl_FragColor += mist;
}