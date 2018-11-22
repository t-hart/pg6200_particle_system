import * as three from 'three'
import { range } from './utils'
import * as vec from './vector3'
import * as parameters from './parameters'
import * as boundingBox from './boundingBox'

import snowflake from 'assets/textures/sprites/snowflake2.png'

import * as shader from './shaders/custom'

const snowTexture = three.ImageUtils.loadTexture(snowflake)

export interface t {
  points: three.Points,
  material: three.ShaderMaterial
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
