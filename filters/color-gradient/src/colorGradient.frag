varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;

const int NUM_STOPS = %numStops%;
uniform float alphas[NUM_STOPS];
uniform vec3 colors[NUM_STOPS*3];
uniform float offsets[NUM_STOPS];
uniform float alpha;

struct GradientStop {
    float offset;
    vec3 color;
    float alpha;
};

void main(void) {
    // current/original color
    vec4 currentColor = texture2D(uSampler, vTextureCoord);

    // skip calculations if alpha is 0
    if (0.0 == alpha) {
        gl_FragColor = currentColor;
        return;
    }

    // current y position
    float y = vFilterCoord.y;

    // check gradient bounds
    float offsetMin = offsets[0];
    float offsetMax = offsets[NUM_STOPS-1];

    if (y  < offsetMin || y > offsetMax) {
        gl_FragColor = currentColor;
        return;
    }

    // find color stops
    GradientStop from;
    GradientStop to;
    int indexLast = NUM_STOPS-1;

    for (int i = 0; i < NUM_STOPS; i++) {
        if (y >= offsets[i]) {
            if (i < indexLast) {
                from = GradientStop(offsets[i], colors[i], alphas[i]);
                to = GradientStop(offsets[i+1], colors[i+1], alphas[i+1]);
            }
        }
    }

    // mix colors from stops
    vec4 colorFrom = vec4(from.color * from.alpha, from.alpha);
    vec4 colorTo = vec4(to.color * to.alpha, to.alpha);

    float stopHeight = to.offset - from.offset;
    float relativePos = y - from.offset;
    float relativePercent = relativePos / stopHeight; // percent between [from.offset] and [to.offset].

    float gradientAlpha = alpha * currentColor.a;
    vec4 gradientColor = mix(colorFrom, colorTo, relativePercent) * gradientAlpha;

    // mix resulting color with current color
    gl_FragColor = gradientColor + currentColor*(1.-gradientColor.a);
}
