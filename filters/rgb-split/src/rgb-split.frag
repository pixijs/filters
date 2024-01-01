precision highp float;
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uSampler;
uniform vec4 uInputSize;
uniform vec2 uRed;
uniform vec2 uGreen;
uniform vec2 uBlue;

void main(void)
{
   float r = texture2D(uSampler, vTextureCoord + uRed/uInputSize.xy).r;
   float g = texture2D(uSampler, vTextureCoord + uGreen/uInputSize.xy).g;
   float b = texture2D(uSampler, vTextureCoord + uBlue/uInputSize.xy).b;
   float a = texture2D(uSampler, vTextureCoord).a;
   finalColor = vec4(r, g, b, a);
}
