uniform float size;
uniform float scale;
uniform float time;
uniform float height;
uniform float gravityMultiplier;
uniform float windMultiplier;
uniform float radius;

void main() {
  vec3 pos = position;
  pos.x += cos((time + position.z) * 0.25 * windMultiplier) * radius;
  pos.y = mod(pos.y - time * gravityMultiplier, height);
  pos.z += sin((time + position.x) * 0.25 * windMultiplier) * radius;

  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1);
  gl_PointSize = size * ( scale / length(modelViewPosition.xyz));
  gl_Position = projectionMatrix * modelViewPosition;
}
