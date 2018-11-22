uniform float size;
uniform float scale;
uniform float time;
uniform float gravity;
uniform float windX;
uniform float windZ;
uniform float radius;
uniform vec3 maxCoordinates;
uniform vec3 minCoordinates;

float wrap (float min, float max, float n) {
  float diff = max - min;
  return n < min ? max - mod(abs(n - min), diff) :
    n > max ? min + mod(abs(n - max), diff) :
    n;
}

void main() {
  vec3 pos = position;
  pos.x = wrap(minCoordinates.x, maxCoordinates.x, pos.x + time * windX + cos(time + pos.x) * windX * radius);
  pos.y = wrap(minCoordinates.y, maxCoordinates.y, pos.y - time * gravity);
  pos.z = wrap(minCoordinates.z, maxCoordinates.z, pos.z + time * windZ + cos(time + pos.z) * windZ * radius);

  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1);
  gl_PointSize = size * (scale / length(modelViewPosition.xyz));
  gl_Position = projectionMatrix * modelViewPosition;
}
