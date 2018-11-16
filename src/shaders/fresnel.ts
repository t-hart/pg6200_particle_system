import vertexShader from './fresnelVertex.glsl'
import fragmentShader from './fresnelFragment.glsl'
export default {
  uniforms: {
    mRefractionRatio: { value: 1.02 },
    mFresnelBias: { value: .1 },
    mFresnelPower: { value: 2 },
    mFresnelScale: { value: 1 },
    tCube: { value: null },
  },
  vertexShader,
  fragmentShader
}
