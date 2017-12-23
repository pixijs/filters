// precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform vec2 dimensions;
uniform float aspect;

uniform sampler2D displacementMap;
uniform float offset;
uniform float sinDir;
uniform float cosDir;
uniform int fillMode;

uniform float seed;
uniform vec2 red;
uniform vec2 green;
uniform vec2 blue;

const int TRANSPARENT = 0;
const int ORIGINAL = 1;
const int LOOP = 2;
const int MIRROR = 3;

void main(void)
{
    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;

    if (coord.x > 1.0 || coord.y > 1.0) {
        return;
    }

    float cx = coord.x - 0.5;
    float cy = (coord.y - 0.5) * aspect;

    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;

    // repeat
    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);

    // mirror
    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);

    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));

    float displacement = (dc.r - dc.g) * (offset / filterArea.x);

    coord += vec2(cosDir * displacement, sinDir * displacement * aspect);

    if( coord.x > 1.0 ) {
        if ( fillMode == ORIGINAL) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            return;
        } else if ( fillMode == LOOP) {
            coord.x -= 1.0;
        } else if ( fillMode == MIRROR) {
            coord.x = 2.0 - coord.x;
        } else {
            gl_FragColor = vec4(0., 0., 0., 0.);
            return;
        }
    } else if( coord.x < 0.0 ) {
        if ( fillMode == ORIGINAL) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            return;
        } else if ( fillMode == LOOP) {
            coord.x += 1.0;
        } else if ( fillMode == MIRROR) {
            coord.x *= -1.0;
        } else {
            gl_FragColor = vec4(0., 0., 0., 0.);
            return;
        }
    }

    if( coord.y > 1.0 ) {
        if ( fillMode == ORIGINAL) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            return;
        } else if ( fillMode == LOOP) {
            coord.y -= 1.0;
        } else if ( fillMode == MIRROR) {
            coord.y = 2.0 - coord.y;
        } else {
            gl_FragColor = vec4(0., 0., 0., 0.);
            return;
        }
    } else if( coord.y < 0.0 ) {
        if ( fillMode == ORIGINAL) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            return;
        } else if ( fillMode == LOOP) {
            coord.y += 1.0;
        } else if ( fillMode == MIRROR) {
            coord.y *= -1.0;
        } else {
            gl_FragColor = vec4(0., 0., 0., 0.);
            return;
        }
    }

    coord = (coord * dimensions) / filterArea.xy;

    // gl_FragColor = texture2D(uSampler, coord);

    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;
    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;
    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;
    gl_FragColor.a = texture2D(uSampler, coord).a;
}
