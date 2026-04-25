precision mediump float;

uniform sampler2D uSampler;
uniform vec4 uColor;
uniform float uBlur;
uniform float uQuality;
uniform float uDistance;
uniform bool uKnockout;

void main(void)
{
    vec4 color = texture2D(uSampler, gl_FragCoord.xy / uSamplerSize);
    vec4 shadowColor = vec4(uColor.rgb, uColor.a * color.a);

    if (uKnockout)
    {
        gl_FragColor = vec4(0.0);
    }
    else
    {
        gl_FragColor = color + shadowColor;
    }

    float blurRadius = uBlur * uQuality;
    float distance = uDistance * uQuality;

    for (float i = -blurRadius; i <= blurRadius; i++)
    {
        for (float j = -blurRadius; j <= blurRadius; j++)
        {
            vec2 offset = vec2(i, j) * distance;
            vec4 sampleColor = texture2D(uSampler, (gl_FragCoord.xy + offset) / uSamplerSize);
            gl_FragColor += sampleColor * shadowColor * (1.0 / (blurRadius * blurRadius));
        }
    }
}