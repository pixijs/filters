
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform float minBright;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);

    // A:
    // vec3 lightColor = max(vec3(0.0), color.rgb - minBright);
    // gl_FragColor = vec4(lightColor, lightColor.a);

    // B:
    // float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));

    // C:
    float _max = max(max(color.r, color.g), color.b);
    float _min = min(min(color.r, color.g), color.b);
    float brightness = (_max + _min) * 0.5;

    if(brightness > minBright) {
        gl_FragColor = color;
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}
