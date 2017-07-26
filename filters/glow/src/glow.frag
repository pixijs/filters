varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

uniform float distance;
uniform float outerStrength;
uniform float innerStrength;
uniform vec4 glowColor;
uniform vec4 filterArea;
uniform vec4 filterClamp;
vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);

void main(void) {
    const float PI = 3.14159265358979323846264;
    vec4 ownColor = texture2D(uSampler, vTextureCoord);
    vec4 curColor;
    float totalAlpha = 0.0;
    float maxTotalAlpha = 0.0;
    float cosAngle;
    float sinAngle;
    vec2 displaced;
    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {
       cosAngle = cos(angle);
       sinAngle = sin(angle);
       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {
           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;
           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;
           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));
           totalAlpha += (distance - curDistance) * curColor.a;
           maxTotalAlpha += (distance - curDistance);
       }
    }
    maxTotalAlpha = max(maxTotalAlpha, 0.0001);

    ownColor.a = max(ownColor.a, 0.0001);
    ownColor.rgb = ownColor.rgb / ownColor.a;
    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);
    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;
    float resultAlpha = (ownColor.a + outerGlowAlpha);
    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);
}
