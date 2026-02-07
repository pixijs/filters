in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform vec3 uOriginalColor;
uniform vec4 uTargetColor;
uniform float uTolerance;
uniform float uSmoothness;

void main(void) {
    vec4 c = texture(uTexture, vTextureCoord);
    float colorDistance = c.a >= 0.00001 ? length(uOriginalColor - (c.rgb / c.a)) : 0.0;
    float doReplace = uSmoothness <= 0.0
        ? step(uTolerance, colorDistance)
        : smoothstep(uTolerance - uSmoothness, uTolerance + uSmoothness, colorDistance);
    finalColor = vec4(
        mix(uTargetColor.rgb * c.a * uTargetColor.a, c.rgb, doReplace),
        mix(uTargetColor.a, c.a, doReplace)
    );
}
