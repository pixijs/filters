varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;

const int TYPE_LINEAR = 0;
const int TYPE_RADIAL = 1;

const int NUM_STOPS = %numStops%;
uniform float alphas[NUM_STOPS];
uniform vec3 colors[NUM_STOPS*3];
uniform float offsets[NUM_STOPS];
uniform int type;
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

float projectLinearPosition(vec2 pos, float _angle){
    vec2 center = vec2(0.5);
    vec2 result = pos - center;
    result = rotate2d(_angle) * result;
    result = result + center;
    return clamp(result.y, 0., 1.);
}

float projectRadialPosition(vec2 pos) {
    float r = distance(vFilterCoord, vec2(0.5));
    return clamp(2.*r, 0., 1.);
}

float projectPosition(vec2 pos, int _type, float _angle) {
    if (_type == TYPE_LINEAR) {
        return projectLinearPosition(pos, _angle);
    } else if (_type == TYPE_RADIAL) {
        return projectRadialPosition(pos);
    }

    return pos.y;
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

    // project position
    float y = projectPosition(vFilterCoord, type, radians(angle));

    // check gradient bounds
    float offsetMin = offsets[0];
    float offsetMax = offsets[NUM_STOPS-1];

    if (y  < offsetMin || y > offsetMax) {
        gl_FragColor = currentColor;
        return;
    }

    // find color stops
    ColorStop from;
    ColorStop to;

    for (int i = 0; i < NUM_STOPS-1; i++) {
        if (y >= offsets[i]) {
            from = ColorStop(offsets[i], colors[i], alphas[i]);
            to = ColorStop(offsets[i+1], colors[i+1], alphas[i+1]);
        }
    }

    // mix colors from stops
    vec4 colorFrom = vec4(from.color * from.alpha, from.alpha);
    vec4 colorTo = vec4(to.color * to.alpha, to.alpha);

    float stopHeight = to.offset - from.offset;
    float relativePos = y - from.offset;
    float relativePercent = relativePos / stopHeight;// percent between [from.offset] and [to.offset].

    float gradientAlpha = alpha * currentColor.a;
    vec4 gradientColor = mix(colorFrom, colorTo, relativePercent) * gradientAlpha;

    // mix resulting color with current color
    gl_FragColor = gradientColor + currentColor*(1.-gradientColor.a);
}
