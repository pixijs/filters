precision highp float;
in vec2 vTextureCoord;
out vec4 finalColor;

uniform vec2 uSize;
uniform sampler2D uTexture;
uniform vec4 uInputSize;

vec2 mapCoord( vec2 coord )
{
    coord *= uInputSize.xy;
    coord += uInputSize.zw;

    return coord;
}

vec2 unmapCoord( vec2 coord )
{
    coord -= uInputSize.zw;
    coord /= uInputSize.xy;

    return coord;
}

vec2 pixelate(vec2 coord, vec2 uSize)
{
	return floor( coord / uSize ) * uSize;
}

void main(void)
{
    vec2 coord = mapCoord(vTextureCoord);
    coord = pixelate(coord, uSize);
    coord = unmapCoord(coord);
    finalColor = texture(uTexture, coord);
}
