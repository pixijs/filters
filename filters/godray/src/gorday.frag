varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec2 dimensions;

uniform vec2 light;
uniform bool parallel;
uniform float aspect;

uniform float gain;
uniform float lacunarity;
uniform float time;
uniform float alpha;

${perlin}

void main(void){
    vec2 coord=vTextureCoord*filterArea.xy/dimensions.xy;
    
    float d;
    
    if(parallel){
        float _cos=light.x;
        float _sin=light.y;
        d=(_cos*coord.x)+(_sin*coord.y*aspect);
    }else{
        float dx=coord.x-light.x/dimensions.x;
        float dy=(coord.y-light.y/dimensions.y)*aspect;
        float dis=sqrt(dx*dx+dy*dy)+.00001;
        d=dy/dis;
    }
    
    vec3 dir=vec3(d,d,0.);
    
    float noise=turb(dir+vec3(time,0.,62.1+time)*.05,vec3(480.,320.,480.),lacunarity,gain);
    noise=mix(noise,0.,.3);
    //fade vertically.
    vec4 mist=vec4(noise,noise,noise,1.)*(1.-coord.y);
    mist.a=1.;
    mist*=alpha;
    
    gl_FragColor=texture2D(uSampler,vTextureCoord)+mist;
    
}
