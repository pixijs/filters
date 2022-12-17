precision mediump float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform vec4 filterArea;
uniform sampler2D uSampler;

uniform float angle;
uniform float scale;
uniform bool grayscale;

float pattern()
{
   float s = sin(angle), c = cos(angle);
   vec2 tex = vTextureCoord * filterArea.xy;
   vec2 point = vec2(
       c * tex.x - s * tex.y,
       s * tex.x + c * tex.y
   ) * scale;
   return (sin(point.x) * sin(point.y)) * 4.0;
}

void main()
{
   vec4 color = texture2D(uSampler, vTextureCoord);
   vec3 colorRGB = vec3(color);

   if (grayscale)
   {
       colorRGB = vec3(color.r + color.g + color.b) / 3.0;
   }

   gl_FragColor = vec4(colorRGB * 10.0 - 5.0 + pattern(), color.a);
}
