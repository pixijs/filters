varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float alpha;
uniform vec3 color;
void main(void){
    vec4 sample = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4(color, sample.a > 0.0 ? alpha : 0.0);
}