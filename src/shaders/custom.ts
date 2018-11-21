import * as three from 'three'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import * as parameters from '../parameters'

const initUniforms = (params: parameters.t, height: number, texture: three.Texture) => ({
  color: { type: 'c', value: new three.Color(params.color) },
  height: { type: 'f', value: height },
  time: { type: 'f', value: 0 },
  radius: { type: 'f', value: params.radius },
  size: { type: 'f', value: params.size },
  scale: { type: 'f', value: params.scale },
  opacity: { type: 'f', value: params.opacity },
  texture: { type: 't', value: texture },
  windMultiplier: { type: 'f', value: params.windMultiplier },
  gravityMultiplier: { type: 'f', value: params.gravityMultiplier }
})

export const create = (params: parameters.t, height: number, texture: three.Texture) => ({
  uniforms: initUniforms(params, height, texture),
  vertexShader,
  fragmentShader,
  blending: three.AdditiveBlending,
  transparent: true,
  depthTest: false
})
