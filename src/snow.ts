import * as three from 'three'
import { range } from './utils'
import * as vec from './vector3'
import * as snowflake from './snowflake'

import snow1 from 'assets/textures/sprites/snowflake1.png'
import snow2 from 'assets/textures/sprites/snowflake2.png'
import snow3 from 'assets/textures/sprites/snowflake3.png'
import snow4 from 'assets/textures/sprites/snowflake4.png'
import snow5 from 'assets/textures/sprites/snowflake5.png'

const textureLoader = new three.TextureLoader()

export interface t {
  points: three.Points,
  geometry: three.BufferGeometry,
  snowflakes: snowflake.t[]
}

const createPoints3D = (dimensions: vec.t) => (n: number) => {
  const dimensionsAsArray = vec.asArray(dimensions)
  return range({ n: n * 3 }).map(m => three.Math.randFloatSpread(dimensionsAsArray[m % 3]))
}

const cloud = (dimensions: vec.t) => (n: number) => (material: three.PointsMaterial): t => {
  const vertices = createPoints3D(dimensions)(n)

  const geometry = new three.BufferGeometry()

  geometry.addAttribute('position', new three.Float32BufferAttribute(vertices, 3))

  const vertexDisplacement = new Float32Array(geometry.attributes.position.count)
  vertexDisplacement.forEach((_, i) => vertexDisplacement[i] = Math.sin(i))

  geometry.addAttribute('vertexDisplacement', new three.BufferAttribute(vertexDisplacement, 1))

  const points = new three.Points(geometry, material)

  const snowflakes = range({ n }).map(_ => snowflake.create(1))
  return { points, geometry, snowflakes }
}

export const make = (dimensions: vec.t) => (n: number) => [
  [snow1, 2.55],
  [snow2, 2],
  [snow3, 2],
  [snow4, .5],
  [snow5, 2.3]
].map(([tex, size]) => cloud(dimensions)(n / 5)(new three.PointsMaterial({
  size,
  depthWrite: false,
  blending: three.AdditiveBlending,
  map: textureLoader.load(tex),
  transparent: true,
  color: 0x888888
}))
)

export const update = (dimensions: vec.t) => (cameraPosition: vec.t) => (geometry: three.BufferGeometry, snowflakes: snowflake.t[]) => (time: number, cosTime: number) => {
  const outsideForces = vec.scale(time)({ x: 1 * cosTime * cosTime, y: .3 * -9.81, z: 0.5 * cosTime })
  // const outsideForces = { x: 1 * cosTime * cosTime, y: .3 * -9.81, z: 0.5 * cosTime }
  const posArr = geometry.getAttribute('position')
  snowflakes.forEach((sf, i) => {
    const pos = {
      x: posArr.getX(i),
      y: posArr.getY(i),
      z: posArr.getZ(i),
    }

    const v = snowflake.addForce(outsideForces)(sf)

    // const { x, y, z } = vec.addWithin(dimensions)(cameraPosition)
    const { x, y, z } = vec.addWithin(dimensions)({ x: 0, y: 0, z: 0 })
      (pos, v)

    geometry.getAttribute('position').setXYZ(i, x, y, z)

  })
  geometry.attributes.position.needsUpdate = true;
}
