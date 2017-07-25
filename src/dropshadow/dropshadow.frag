varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float alpha;
uniform vec3 color;
void main(void){
    vec4 sample = texture2D(uSampler, vTextureCoord);

    // Un-premultiply alpha before applying the color
    if (sample.a > 0.0) {
        sample.rgb /= sample.a;
    }

    // Premultiply alpha again
    sample.rgb = color.rgb * sample.a;

    // alpha user alpha
    sample *= alpha;

    gl_FragColor = sample;
}