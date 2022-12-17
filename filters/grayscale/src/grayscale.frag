precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

// https://en.wikipedia.org/wiki/Luma_(video)
const vec3 weight = vec3(0.299, 0.587, 0.114);

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4(
        vec3(color.r * weight.r + color.g * weight.g  + color.b * weight.b),
        color.a
    );
}
