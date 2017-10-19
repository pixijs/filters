varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uVelocity;
uniform int uKernelSize;
uniform float uOffset;

const int MAX_KERNEL_SIZE = 2048;
const int ITERATION = MAX_KERNEL_SIZE - 1;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord);

    if (uKernelSize == 0)
    {
        return;
    }

    // float kernelSize = min(float(uKernelSize), float(MAX_KERNELSIZE));

    // In real use-case , uKernelSize < MAX_KERNELSIZE almost always.
    // So use uKernelSize directly.
    float kernelSize = float(uKernelSize);

    float k = kernelSize - 1.0;

    for(int i = 0; i < ITERATION; i++) {
        if (i == uKernelSize) {
            break;
        }
        vec2 offset = uVelocity * (float(i) / k - 0.5 - uOffset);
        gl_FragColor += texture2D(uSampler, vTextureCoord + offset);
    }
    gl_FragColor /= kernelSize;
}
