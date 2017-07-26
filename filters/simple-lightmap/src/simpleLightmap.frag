varying vec4 vColor;
varying vec2 vTextureCoord;
uniform sampler2D u_texture; //diffuse map
uniform sampler2D u_lightmap;   //light map
uniform vec2 resolution; //resolution of screen
uniform vec4 ambientColor; //ambient RGB, alpha channel is intensity
void main() {
    vec4 diffuseColor = texture2D(u_texture, vTextureCoord);
    vec2 lighCoord = (gl_FragCoord.xy / resolution.xy);
    vec4 light = texture2D(u_lightmap, vTextureCoord);
    vec3 ambient = ambientColor.rgb * ambientColor.a;
    vec3 intensity = ambient + light.rgb;
    vec3 finalColor = diffuseColor.rgb * intensity;
    gl_FragColor = vColor * vec4(finalColor, diffuseColor.a);
}
