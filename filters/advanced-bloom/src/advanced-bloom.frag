uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform sampler2D bloomTexture;
uniform float brightScale;
uniform float toneScale;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord) * toneScale;
    color += texture2D(bloomTexture, vTextureCoord) * brightScale;
    gl_FragColor = color;
}
