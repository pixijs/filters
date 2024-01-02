in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uSampler;
uniform vec3 uColor;
uniform float uAlpha;

void main(void) {
    vec4 c = texture(uSampler, vTextureCoord);
    finalColor = vec4(mix(c.rgb, uColor.rgb, c.a * uAlpha), c.a);
}
