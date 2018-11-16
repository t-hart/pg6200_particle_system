void main () {
  gl_PointSize = 100;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}
