in vec2 aPosition;
in vec2 aTextureCoord;

out vec2 vTextureCoord;

uniform mat3 projectionMatrix;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}