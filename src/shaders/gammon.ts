import vertexShader from './gammonVertex.glsl'
import fragmentShader from './gammonFragment.glsl'
export default {
  uniforms: {
    delta: { value: 0 }
  },
  vertexShader,
  fragmentShader
}
