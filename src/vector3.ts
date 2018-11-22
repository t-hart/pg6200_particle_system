import * as three from 'three'
import { wrap } from './utils'

export interface t {
  x: number,
  y: number,
  z: number
}

export const add = (...vecs: t[]) =>
  vecs.reduce((acc, { x, y, z }) => ({ x: acc.x + x, y: acc.y + y, z: acc.z + z }))

export const subtract = (...vecs: t[]) =>
  vecs.reduce((acc, { x, y, z }) => ({ x: acc.x - x, y: acc.y - y, z: acc.z - z }))

export const zero = () => ({ x: 0, y: 0, z: 0 })

export const addWithin = (edges: t) => (center: t) => (...vecs: t[]) => {
  const offset = scale(.5)(edges)
  const min = subtract(center, offset)
  const max = add(center, offset)
  return vecs.reduce((acc, { x, y, z }) => ({
    x: wrap(min.x, max.x)(acc.x + x),
    y: wrap(min.y, max.y)(acc.y + y),
    z: wrap(min.z, max.z)(acc.z + z)
  }))
}


export const scaleWithin = (edges: t) => (s: number) => ({ x, y, z }: t) => ({
  x: (x * s) % edges.x,
  y: (y * s) % edges.y,
  z: (z * s) % edges.z
})

export const scale = (s: number) => ({ x, y, z }: t) => ({
  x: x * s,
  y: y * s,
  z: z * s
})

export const assignVectorThree = (vector3: three.Vector3, ...vecs: t[]) => {
  const { x, y, z } = add(...vecs)
  vector3.x = x
  vector3.y = y
  vector3.z = z
}

export const asArray = (vec: t) => [vec.x, vec.y, vec.z]

export const asThreeVector = ({ x, y, z }: t) => new three.Vector3(x, y, z)
