varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;

uniform vec2 uVelocity;
uniform int uKernelSize;
uniform float uOffset;

const int MAX_KERNEL_SIZE = 2048;
const int ITERATION = MAX_KERNEL_SIZE - 1;

vec2 velocity = uVelocity / filterArea.xy;

// float kernelSize = min(float(uKernelSize), float(MAX_KERNELSIZE));

// In real use-case , uKernelSize < MAX_KERNELSIZE almost always.
// So use uKernelSize directly.
float kernelSize = float(uKernelSize);
float k = kernelSize - 1.0;
float offset = -uOffset / length(uVelocity) - 0.5;

void main(void)
{
    vec4 color = texture2D(uSampler, vTextureCoord);

    if (uKernelSize == 0)
    {
        gl_FragColor = color;
        return;
    }

    for(int i = 0; i < ITERATION; i++) {
        if (i == int(k)) {
            break;
        }
        vec2 bias = velocity * (float(i) / k + offset);
        color += texture2D(uSampler, vTextureCoord + bias);
    }
    gl_FragColor = color / kernelSize;
}
