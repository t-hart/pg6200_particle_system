import * as three from 'three'
import * as boundingBox from '../boundingBox'
import * as vec from '../vector3'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import * as parameters from '../parameters'

const initUniforms = (params: parameters.t, bounds: boundingBox.t, texture: three.Texture) => ({
  color: { type: 'c', value: new three.Color(params.color) },
  time: { type: 'f', value: 0 },
  radius: { type: 'f', value: params.radius },
  size: { type: 'f', value: params.size },
  scale: { type: 'f', value: params.scale },
  opacity: { type: 'f', value: params.opacity },
  texture: { type: 't', value: texture },
  windX: { type: 'f', value: params.windX },
  windZ: { type: 'f', value: params.windZ },
  gravity: { type: 'f', value: params.gravity },
  maxCoordinates: { type: 'v3', value: vec.asThreeVector(bounds.max) },
  minCoordinates: { type: 'v3', value: vec.asThreeVector(bounds.min) }
})

export const create = (params: parameters.t, bounds: boundingBox.t, texture: three.Texture) => ({
  uniforms: initUniforms(params, bounds, texture),
  vertexShader,
  fragmentShader,
  blending: three.AdditiveBlending,
  transparent: true,
  depthTest: false
})
