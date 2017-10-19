varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uVelocity;
uniform int uKernelSize;

const int MAX_ITERATION = 2048;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord);

    if (uKernelSize == 0)
    {
        return;
    }

    float k = float(uKernelSize - 1);
    for(int i = 0; i < MAX_ITERATION; i++) {
        if (i == uKernelSize) {
            break;
        }
        vec2 offset = uVelocity * (float(i) / k - 0.5);
        gl_FragColor += texture2D(uSampler, vTextureCoord + offset);
    }
    gl_FragColor /= float(uKernelSize);
}
