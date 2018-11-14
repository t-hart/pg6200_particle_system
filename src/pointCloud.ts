import * as three from 'three'
import { createPoints3D, range, zip } from './utils'
import * as vec from './vector3'

//models
import tex from 'assets/textures/sprites/disc.png'

const velocityVec = () => ({
  x: Math.random() * 2 - 1,
  y: -(Math.random() + .5),
  z: Math.random() * 2 - 1
})

export const create = (n: number) => {
  const vertices = createPoints3D(n)

  const geometry = new three.BufferGeometry()

  const textureLoader = new three.TextureLoader()

  const sprite = textureLoader.load(tex)

  geometry.addAttribute('position', new three.Float32BufferAttribute(vertices, 3))

  const material = new three.PointsMaterial({
    size: 35,
    sizeAttenuation: false,
    map: sprite,
    alphaTest: 0.5,
    transparent: true
  })

  material.color.setHSL(1, .3, .7)

  const points = new three.Points(geometry, material)

  const velocities = range({ n }).map(velocityVec)
  const velocity = velocityVec()
  return { material, points, velocity, geometry, velocities }
}

export const update = (geometry: three.BufferGeometry, velocities: vec.t[]) => (time: number) => {
  const posArr = geometry.getAttribute('position')
  velocities.forEach((v, i) => {
    const pos = {
      x: posArr.getX(i),
      y: posArr.getY(i),
      z: posArr.getZ(i),
    }

    const { x, y, z } = vec.addWithin({ x: 1000, y: 1000, z: 1000 })(pos, vec.scale(time)(v), { x: 6, y: -5, z: 1 })
    geometry.getAttribute('position').setXYZ(i, x, y, z)
  })
  geometry.attributes.position.needsUpdate = true;
}
