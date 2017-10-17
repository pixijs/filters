uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform sampler2D bloomTexture;
uniform float brightness;
uniform float contrast;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    color.rgb *= contrast;
    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);
    bloomColor.rgb *= brightness;
    gl_FragColor = color + bloomColor;
}
