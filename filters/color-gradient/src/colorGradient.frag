varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;

const int NUM_STOPS = %numStops%;
uniform float alphas[NUM_STOPS];
uniform vec3 colors[NUM_STOPS*3];
uniform float offsets[NUM_STOPS];
uniform float angle;
uniform float alpha;

struct ColorStop {
    float offset;
    vec3 color;
    float alpha;
};

//struct polar {
//    float radius;
//    float angle;
//};
//
//polar uniToPolar(vec2 uniPos) {
//    vec2 offsetPos = uniPos - vec2(0.5);// offset center to (0.5, 0.5)
//    float radius=length(offsetPos);
//    float angle=atan(offsetPos.y, offsetPos.x);
//    return polar(radius, angle);
//}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle), -sin(_angle),
    sin(_angle), cos(_angle));
}

vec2 rotatePosition(vec2 pos, vec2 center, float _angle){
    vec2 result = pos - center;
    result = rotate2d(_angle) * result;
    result = result + center;
    return result;
}

void main(void) {
    // current/original color
    vec4 currentColor = texture2D(uSampler, vTextureCoord);

    // debug outline
    float w = 0.005;
    if (vFilterCoord.x < w || vFilterCoord.x > 1.-w || vFilterCoord.y < w || vFilterCoord.y > 1.-w) {
        gl_FragColor = vec4(vec3(1., 1., 0), 1.);
        return;
    }

    // skip calculations if alpha is 0
    if (0.0 == alpha) {
        gl_FragColor = currentColor;
        return;
    }

    // current position
    float rad = radians(angle);
    vec2 centerPoint = vec2(0.5);
    vec2 rotatedPos = rotatePosition(vFilterCoord, vec2(0.5), radians(angle));
    float pos = rotatedPos.y;

    // check gradient bounds
    float offsetMin = offsets[0];
    float offsetMax = offsets[NUM_STOPS-1];

    if (pos  < offsetMin || pos > offsetMax) {
        gl_FragColor = currentColor;
        return;
    }

    // find color stops
    ColorStop from;
    ColorStop to;
    int indexLast = NUM_STOPS-1;

    for (int i = 0; i < NUM_STOPS; i++) {
        if (pos >= offsets[i]) {
            if (i < indexLast) {
                from = ColorStop(offsets[i], colors[i], alphas[i]);
                to = ColorStop(offsets[i+1], colors[i+1], alphas[i+1]);
            }
        }
    }

    // mix colors from stops
    vec4 colorFrom = vec4(from.color * from.alpha, from.alpha);
    vec4 colorTo = vec4(to.color * to.alpha, to.alpha);

    float stopHeight = to.offset - from.offset;
    float relativePos = pos - from.offset;
    float relativePercent = relativePos / stopHeight;// percent between [from.offset] and [to.offset].

    float gradientAlpha = alpha * currentColor.a;
    vec4 gradientColor = mix(colorFrom, colorTo, relativePercent) * gradientAlpha;

    // mix resulting color with current color
    gl_FragColor = gradientColor + currentColor*(1.-gradientColor.a);
}
