import * as three from 'three'
import { range } from './utils'
import * as vec from './vector3'
import * as parameters from './parameters'
import * as boundingBox from './boundingBox'

import snow1 from 'assets/textures/sprites/snowflake1.png'
import snow2 from 'assets/textures/sprites/snowflake2.png'
import snow3 from 'assets/textures/sprites/snowflake3.png'
import snow4 from 'assets/textures/sprites/snowflake4.png'
import snow5 from 'assets/textures/sprites/snowflake5.png'

import * as shader from './shaders/custom'

const snowTexture = three.ImageUtils.loadTexture(snow2)

export interface t {
  points: three.Points,
  material: three.ShaderMaterial
}

const createPoints3D = (dimensions: vec.t) => (n: number) => {
  const dimensionsAsArray = vec.asArray(dimensions)
  return range({ n: n * 3 }).map(m => three.Math.randFloatSpread(dimensionsAsArray[m % 3]))
}

export const make = (bounds: boundingBox.t, params: parameters.t) => (n: number): t => {
  const differences = vec.asArray(vec.subtract(bounds.max, bounds.min))
  const mins = vec.asArray(bounds.min)
  const vertices = range({ n: n * 3 }).map(m => {
    const index = m % 3
    return Math.random() * differences[index] + mins[index]
  })

  const geometry = new three.BufferGeometry()
  geometry.addAttribute('position', new three.Float32BufferAttribute(vertices, 3))

  const material = new three.ShaderMaterial(shader.create(params, bounds, snowTexture))
  const points = new three.Points(geometry, material)

  return { points, material }
}
