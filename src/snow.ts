import * as three from 'three'
import { range } from './utils'
import * as vec from './vector3'
import * as parameters from './parameters'

import snow1 from 'assets/textures/sprites/snowflake1.png'
import snow2 from 'assets/textures/sprites/snowflake2.png'
import snow3 from 'assets/textures/sprites/snowflake3.png'
import snow4 from 'assets/textures/sprites/snowflake4.png'
import snow5 from 'assets/textures/sprites/snowflake5.png'

import * as shader from './shaders/custom'

const snowTexture = three.ImageUtils.loadTexture(snow3)

export interface t {
  points: three.Points,
  material: three.ShaderMaterial
}

const createPoints3D = (dimensions: vec.t) => (n: number) => {
  const dimensionsAsArray = vec.asArray(dimensions)
  return range({ n: n * 3 }).map(m => three.Math.randFloatSpread(dimensionsAsArray[m % 3]))
}

export const make = (dimensions: vec.t, params: parameters.t) => (n: number): t => {
  const vertices = createPoints3D(dimensions)(n)

  const geometry = new three.BufferGeometry()
  geometry.addAttribute('position', new three.Float32BufferAttribute(vertices, 3))

  const material = new three.ShaderMaterial(shader.create(params, dimensions.y, snowTexture))
  const points = new three.Points(geometry, material)

  return { points, material }
}
