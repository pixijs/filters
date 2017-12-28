varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float gamma;
uniform float contrast;
uniform float saturation;
uniform float brightness;
uniform float red;
uniform float green;
uniform float blue;
uniform float alpha;

void main(void)
{
    vec4 c = texture2D(uSampler, vTextureCoord);

    float k = c.a > 0.0 ? c.a : 1.0;

    c.rgb /= k;

    vec3 rgb = pow(c.rgb, vec3(1. / gamma));
    rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb)), rgb, saturation), contrast);
    rgb.r *= red;
    rgb.g *= green;
    rgb.b *= blue;
    c.rgb = rgb * brightness;

    c.rgb *= k;

    gl_FragColor = c * alpha;
}
