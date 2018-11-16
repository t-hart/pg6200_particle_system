uniform float time;

void main() {
  vec3 newPos = position;
  newPos.y += y;
  gl_PointSize = 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4 (newPos, 1.0)
}
