varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;

uniform vec2 angleDir;
uniform float gain;
uniform float lacunarity;
uniform float time;

${perlin}

void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    float xx = angleDir.x;
    float yy = angleDir.y * filterArea.y / filterArea.x;

    float d = (xx * vTextureCoord.x) + (yy * vTextureCoord.y);
    vec3 dir = vec3(d, d, 0.0);

    float noise = turb(dir + vec3(time, 0.0, 62.1 + time), vec3(480.0, 320.0, 480.0), lacunarity, gain);
    noise = mix(noise, 0.0, 0.3);
    //fade vertically.
    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - vTextureCoord.y);
    mist.a = 1.0;
    gl_FragColor += mist;
}
