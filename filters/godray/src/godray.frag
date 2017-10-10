vec4 godray(float time, vec2 coord, float angle)
{
    float xx = cos(radians(angle));
    float yy = sin(radians(angle));
    vec3 dir = vec3((xx * coord.x) + (yy * coord.y), (xx * coord.x) + (yy * coord.y), 0.0);
    float noise = turb(dir + vec3(time, 0.0, 62.1 + time), vec3(480.0, 320.0, 480.0), 2.0, 0.5);
    noise = mix(noise, 0.0, 0.3);
    //fade vertically.
    vec4 mist = vec4(noise, noise, noise, 1.0) * coord.y; mist.a = 1.0;
    return mist;
}
