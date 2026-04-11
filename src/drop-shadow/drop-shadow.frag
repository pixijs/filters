precision highp float;
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform sampler2D uMapTexture;
uniform float uAlpha;
uniform vec3 uColor;
uniform vec2 uOffset;
uniform float uShadowOnly;

uniform vec4 uInputSize;

void main(void){
    // Sample the blurred shape for the shadow alpha at the offset position
    float shadowAlpha = texture(uMapTexture, vTextureCoord - uOffset * uInputSize.zw).a * uAlpha;

    // Premultiplied shadow color
    vec4 shadow = vec4(uColor.rgb * shadowAlpha, shadowAlpha);

    // Foreground - hidden when rendering shadow only
    vec4 fg = texture(uTexture, vTextureCoord) * (1.0 - uShadowOnly);

    // Composite foreground over shadow (premultiplied alpha)
    finalColor = fg + shadow * (1.0 - fg.a);
}
