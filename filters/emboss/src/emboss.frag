precision highp float;
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uSampler;
uniform float uStrength;

uniform vec4 uInputSize;

void main(void)
{
	vec2 onePixel = vec2(1.0 / uInputSize);

	vec4 color;

	color.rgb = vec3(0.5);

	color -= texture(uSampler, vTextureCoord - onePixel) * uStrength;
	color += texture(uSampler, vTextureCoord + onePixel) * uStrength;

	color.rgb = vec3((color.r + color.g + color.b) / 3.0);

	float alpha = texture(uSampler, vTextureCoord).a;

	finalColor = vec4(color.rgb * alpha, alpha);
}
