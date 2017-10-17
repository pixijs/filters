varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float epsilon;
uniform vec3 originalColors[%colorCount%];
uniform vec3 targetColors[%colorCount%];

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord);

    float alpha = gl_FragColor.a;
    if (alpha < 0.0001)
    {
      return;
    }

    vec3 color = gl_FragColor.rgb / alpha;

    for(int i = 0; i < %colorCount%; i++)
    {
      vec3 origColor = originalColors[i];
      vec3 colorDiff = origColor - color;
      if (length(colorDiff) < epsilon) {
        vec3 targetColor = targetColors[i];
        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);
        return;
      }
    }
}
