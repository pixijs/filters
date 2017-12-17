varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;

uniform float uRadian;
uniform vec2 uCenter;
uniform float uRadius;
uniform int uKernelSize;

const int MAX_KERNEL_SIZE = 2048;
const int ITERATION = MAX_KERNEL_SIZE - 1;

// float kernelSize = min(float(uKernelSize), float(MAX_KERNELSIZE));

// In real use-case , uKernelSize < MAX_KERNELSIZE almost always.
// So use uKernelSize directly.
float kernelSize = float(uKernelSize);
float k = kernelSize - 1.0;


vec2 center = uCenter.xy / filterArea.xy;
float aspect = filterArea.y / filterArea.x;

float gradient = uRadius / filterArea.x * 0.3;
float radius = uRadius / filterArea.x - gradient * 0.5;

void main(void)
{
    gl_FragColor = texture2D(uSampler, vTextureCoord);

    if (uKernelSize == 0)
    {
        return;
    }

    vec2 coord = vTextureCoord;

    vec2 dir = vec2(center - coord);
    float dist = length(vec2(dir.x, dir.y * aspect));

    float radianStep;

    if (radius >= 0.0 && dist > radius) {
        float delta = dist - radius;
        float gap = gradient;
        float scale = 1.0 - abs(delta / gap);
        if (scale <= 0.0) {
            return;
        }
        radianStep = uRadian * scale / k;
    } else {
        radianStep = uRadian / k;
    }

    float s = sin(radianStep);
    float c = cos(radianStep);
    mat2 rotationMatrix = mat2(vec2(c, -s), vec2(s, c));

    for(int i = 0; i < ITERATION; i++) {
        if (i == int(k)) {
            break;
        }

        coord -= center;
        coord.y *= aspect;
        coord = rotationMatrix * coord;
        coord.y /= aspect;
        coord += center;

        vec4 sample = texture2D(uSampler, coord);

        // switch to pre-multiplied alpha to correctly blur transparent images
        // sample.rgb *= sample.a;

        gl_FragColor += sample;
    }
    gl_FragColor /= kernelSize;
}
