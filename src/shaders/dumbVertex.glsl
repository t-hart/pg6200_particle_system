void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1);
  gl_PointSize = 0.0 * (length(mvPosition.xyz));
  gl_Position = projectionMatrix * modelViewMatrix * vec4 (position, 1.0);
}
