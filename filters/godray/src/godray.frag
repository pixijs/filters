precision mediump float;

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

// 3D gradient Noise
// MIT License
// Copyright © 2013 Inigo Quilez
// https://www.shadertoy.com/view/Xsl3Dl

vec3 hash(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)),
           dot(p, vec3(113.5, 271.9, 124.6)));

  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);

  vec3 u = f * f * (3.0 - 2.0 * f);

  return mix(
      mix(mix(dot(hash(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
              dot(hash(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x),
          mix(dot(hash(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
              dot(hash(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x),
          u.y),
      mix(mix(dot(hash(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
              dot(hash(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x),
          mix(dot(hash(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
              dot(hash(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x),
          u.y),
      u.z);
}

const mat3 m = mat3(0.00, 0.80, 0.60, -0.80, 0.36, -0.48, -0.60, -0.48, 0.64);

float turb(vec3 pos, float lacunarity, float gain ) {
  float f;
  vec3 q = 8.0 * pos;
  f = gain * noise(q);
  q = m * q * 2.01 * lacunarity;
  f += (gain * gain) * noise(q);
  q = m * q * 2.02 * lacunarity;
  f += (gain * gain * gain) * noise(q);
  q = m * q * 2.03 * lacunarity;
  f += (gain * gain * gain * gain) * noise(q);
  q = m * q * 2.01 * lacunarity;
  f = 0.5 + 0.5 * f;
  return clamp(f, 0.0, 1.0);
}

void main(void) {
  gl_FragColor = texture2D(uSampler, vTextureCoord);

  float d = 0.0;
  vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;
  if (parallel) {
    float _cos = light.x;
    float _sin = light.y;
    d = (_cos * coord.x) + (_sin * coord.y * aspect);
  } else {
    float dx = coord.x - light.x / dimensions.x;
    float dy = (coord.y - light.y / dimensions.y) * aspect;
    float dis = sqrt(dx * dx + dy * dy) + 0.00001;
    d = dy / dis;
  }
  vec2 dir = vec2(d, d);
  float noise = turb(vec3(dir, time), lacunarity, gain);
  // fade vertically
  vec4 mist = vec4(noise, noise, noise, 1.0);
  mist = clamp(mist, 0.0, 1.0);
  mist *= 1.0 - coord.y;
  mist = clamp(mist, 0.0, 1.0);

  gl_FragColor += mist;
}
