import * as three from 'three'
import { wrap } from './utils'

export interface t {
  x: number,
  y: number,
  z: number
}

export const add = (...vecs: t[]) =>
  vecs.reduce((acc, { x, y, z }) => ({ x: acc.x + x, y: acc.y + y, z: acc.z + z }))

export const addWithin = (bounds: t) => (...vecs: t[]) =>
  vecs.reduce((acc, { x, y, z }) => ({
    x: wrap(-bounds.x, bounds.x)(acc.x + x),
    y: wrap(-bounds.x, bounds.x)(acc.y + y),
    z: wrap(-bounds.x, bounds.x)(acc.z + z)
  }))


export const scaleWithin = (bounds: t) => (s: number) => ({ x, y, z }: t) => ({
  x: (x * s) % bounds.x,
  y: (y * s) % bounds.y,
  z: (z * s) % bounds.z
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
