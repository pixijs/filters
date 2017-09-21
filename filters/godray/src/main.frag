varying vec2 vTextureCoord;
uniform float time;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec2 dimensions;

$perlin
$godray

void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    vec2 mappedCoord = vTextureCoord * vec2(filterArea.x / dimensions.x, 1.0 - filterArea.y / dimensions.y);
    gl_FragColor += godray(time, mappedCoord);
}