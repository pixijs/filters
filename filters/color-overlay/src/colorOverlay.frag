varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 color;
void main(void) {
    vec4 currentColor = texture2D(uSampler, vTextureCoord);
    vec3 colorOverlay = color * currentColor.a;
    gl_FragColor = vec4(colorOverlay.r, colorOverlay.g, colorOverlay.b, currentColor.a);
}
