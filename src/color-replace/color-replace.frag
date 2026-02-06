in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform vec3 uOriginalColor;
uniform vec4 uTargetColor;
uniform float uTolerance;

void main(void) {
    vec4 c = texture(uTexture, vTextureCoord);
    float colorDistance = c.a >= 0.00001 ? length(uOriginalColor - (c.rgb / c.a)) : 0.0;
    float doReplace = step(colorDistance, uTolerance);
    finalColor = vec4(
        mix(c.rgb, uTargetColor.rgb * c.a * uTargetColor.a, doReplace),
        mix(c.a, uTargetColor.a, doReplace)
    );
}
