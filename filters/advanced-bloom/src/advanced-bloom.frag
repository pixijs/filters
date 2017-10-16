uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform sampler2D bloomTexture;
uniform float brightScale;
uniform float toneScale;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    color.rgb *= toneScale;
    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);
    bloomColor.rgb *= brightScale;
    gl_FragColor = color + bloomColor;
}
