import * as three from 'three'
import { range, zip } from './utils'
import * as vec from './vector3'

//models
import disc from 'assets/textures/sprites/disc.png'

import snow1 from 'assets/textures/sprites/snowflake1.png'
import snow2 from 'assets/textures/sprites/snowflake2.png'
import snow3 from 'assets/textures/sprites/snowflake3.png'
import snow4 from 'assets/textures/sprites/snowflake4.png'
import snow5 from 'assets/textures/sprites/snowflake5.png'

const textureLoader = new three.TextureLoader()

const velocityVec = () => ({
  x: three.Math.randFloatSpread(10),
  y: 0,
  z: three.Math.randFloatSpread(10)
})

const createPoints3D = (dimensions: vec.t) => (n: number) => {
  const dimensionsAsArray = vec.asArray(dimensions)
  return range({ n: n * 3 }).map(m => three.Math.randFloatSpread(dimensionsAsArray[m % 3]))
}

const cloud = (dimensions: vec.t) => (n: number) => (material: three.PointsMaterial) => (h: number, s: number, l: number) => {
  const vertices = createPoints3D(dimensions)(n)

  const geometry = new three.BufferGeometry()

  geometry.addAttribute('position', new three.Float32BufferAttribute(vertices, 3))

  const vertexDisplacement = new Float32Array(geometry.attributes.position.count)
  vertexDisplacement.forEach((_, i) => vertexDisplacement[i] = Math.sin(i))

  geometry.addAttribute('vertexDisplacement', new three.BufferAttribute(vertexDisplacement, 1))
  // material.color.setHSL(h, s, l)

  const points = new three.Points(geometry, material)

  const velocities = range({ n }).map(velocityVec)
  const velocity = velocityVec()
  return { material, points, velocity, geometry, velocities }
}

export const snow = (dimensions: vec.t) => (n: number) => [
  [snow1, [1, .2, .5], 3.55],
  [snow2, [.95, .1, .5], 4],
  [snow3, [.9, .05, .5], 3.33],
  [snow4, [.85, 0, .5], 2],
  [snow5, [.8, 0, .5], 3]
].map(([tex, hsl, size]) => cloud(dimensions)(n / 5)(new three.PointsMaterial({
  size,
  blending: three.AdditiveBlending,
  depthTest: false,
  map: textureLoader.load(tex),
  // alphaTest: 0.5,
  transparent: true,
  // color: 0x888888
}))(...hsl)
)

export const create = (n: number) => cloud(n)(new three.PointsMaterial({
  size: 35,
  map: textureLoader.load(disc),
  alphaTest: 0.5,
  transparent: true
}))(1, .3, .7)

export const update = (dimensions: vec.t) => (cameraPosition: vec.t) => (geometry: three.BufferGeometry, velocities: vec.t[]) => (time: number, cosTime: number) => {
  const outsideForces = { x: .1 + 15 * (1 + cosTime), y: -9.81, z: 2 * cosTime }
  const posArr = geometry.getAttribute('position')
  velocities.forEach((v, i) => {
    const pos = {
      x: posArr.getX(i),
      y: posArr.getY(i),
      z: posArr.getZ(i),
    }

    const velocity = vec.scale(time)(vec.add(v, outsideForces))
    const { x, y, z } = vec.addWithin(dimensions)(cameraPosition)
      (pos, velocity)

    geometry.getAttribute('position').setXYZ(i, x, y, z)

  })
  geometry.attributes.position.needsUpdate = true;
}
