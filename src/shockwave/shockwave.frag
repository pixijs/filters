varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform vec2 center;
uniform vec3 params; // 10.0, 0.8, 0.1
uniform float time;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform vec2 dimensions;

void main()
{
    vec2 uv = vTextureCoord * filterArea.xy / dimensions.xy;
    vec2 coord = uv;

    float dist = distance(coord, center);

    if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )
    {
        float diff = (dist - time);
        float powDiff = 1.0 - pow(abs(diff*params.x), params.y);

        float diffTime = diff  * powDiff;
        vec2 diffUV = normalize(uv - center);
        coord = uv + (diffUV * diffTime);
    }

    coord *= dimensions.xy / filterArea.xy;
    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);
    gl_FragColor = texture2D(uSampler, clampedCoord);
    if (coord != clampedCoord) {
        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));
    }
}
