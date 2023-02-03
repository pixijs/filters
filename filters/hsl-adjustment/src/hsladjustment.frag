precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uHue;
uniform float uAlpha;
uniform bool uColorize;
uniform float uSaturation;
uniform float uLightness;

// https://en.wikipedia.org/wiki/Luma_(video)
const vec3 weight = vec3(0.299, 0.587, 0.114);

float getBrightness(vec4 color) {
    return (color.r * weight.r + color.g * weight.g  + color.b * weight.b) * color.a;
}

// https://gist.github.com/mairod/a75e7b44f68110e1576d77419d608786?permalink_comment_id=3195243#gistcomment-3195243
const vec3 k = vec3(0.57735, 0.57735, 0.57735);

vec3 hueShift(vec3 color, float angle) {
    float cosAngle = cos(angle);
    return vec3(
    color * cosAngle +
    cross(k, color) * sin(angle) +
    k * dot(k, color) * (1.0 - cosAngle)
    );
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec4 result = color;
    float brightness = getBrightness(result);

    // colorize
    if (uColorize)  {
        result.rgb = vec3(brightness, 0, 0);
    }

    // hue
    result.rgb = hueShift(result.rgb, uHue);

    // saturation
    result.rgb = mix(vec3(brightness), result.rgb, 1.+uSaturation);
    result.rgb = clamp(result.rgb, 0., 1.);

    // lightness
    result.rgb += vec3(uLightness) * color.a;

    // alpha
    gl_FragColor = mix(color, result, uAlpha);
}
