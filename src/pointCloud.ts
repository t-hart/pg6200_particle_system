import * as three from 'three'
import { range, zip } from './utils'
import * as vec from './vector3'
import fresnel from './shaders/fresnel'
import gammon from './shaders/gammon'

//models
import disc from 'assets/textures/sprites/disc.png'

import snow1 from 'assets/textures/sprites/snowflake1.png'
import snow2 from 'assets/textures/sprites/snowflake2.png'
import snow3 from 'assets/textures/sprites/snowflake3.png'
import snow4 from 'assets/textures/sprites/snowflake4.png'
import snow5 from 'assets/textures/sprites/snowflake5.png'

const textureLoader = new three.TextureLoader()

const velocityVec = () => ({
  x: Math.random() - .5,
  y: 0,
  z: Math.random() - .5
})

const gammonMtl = new three.ShaderMaterial(gammon);

const createPoints3D = (n: number) => range({ n: n * 3 }).map(_ => 2000 * Math.random() - 1000)

const cloud = (n: number) => (material: three.PointsMaterial) => (h: number, s: number, l: number) => {
  const vertices = createPoints3D(n)

  const geometry = new three.BufferGeometry()

  geometry.addAttribute('position', new three.Float32BufferAttribute(vertices, 3))

  material.color.setHSL(h, s, l)

  const points = new three.Points(geometry, material)

  const velocities = range({ n }).map(velocityVec)
  const velocity = velocityVec()
  return { material, points, velocity, geometry, velocities }
}

export const snow = (n: number) => [
  [snow1, [1, .2, .5], 17],
  [snow2, [.95, .1, .5], 19],
  [snow3, [.9, .05, .5], 23],
  [snow4, [.85, 0, .5], 29],
  [snow5, [.8, 0, .5], 31]
].map(([tex, hsl, size]) => cloud(n / 5)(new three.PointsMaterial({
  size,
  blending: three.AdditiveBlending,
  depthTest: false,
  map: textureLoader.load(tex),
  alphaTest: 0.5,
  transparent: true
}))(...hsl)
)

export const create = (n: number) => cloud(n)(new three.PointsMaterial({
  size: 35,
  map: textureLoader.load(disc),
  alphaTest: 0.5,
  transparent: true
}))(1, .3, .7)

export const update = (geometry: three.BufferGeometry, velocities: vec.t[]) => (time: number) => {
  const posArr = geometry.getAttribute('position')
  velocities.forEach((v, i) => {
    const pos = {
      x: posArr.getX(i),
      y: posArr.getY(i),
      z: posArr.getZ(i),
    }

    const outsideForces = { x: 0, y: -.5, z: 0 }
    const velocity = vec.scale(time)(vec.add(v, outsideForces))
    const { x, y, z } = vec.addWithin({ x: 1000, y: 1000, z: 1000 })
      (pos, velocity)

    geometry.getAttribute('position').setXYZ(i, x, y, z)

  })
  geometry.attributes.position.needsUpdate = true;
}
