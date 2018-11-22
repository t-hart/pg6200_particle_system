import * as three from 'three'

export interface t {
  x: number,
  y: number,
  z: number
}

export const subtract = (...vecs: t[]) =>
  vecs.reduce((acc, { x, y, z }) => ({ x: acc.x - x, y: acc.y - y, z: acc.z - z }))

export const asArray = (vec: t) => [vec.x, vec.y, vec.z]

export const asThreeVector = ({ x, y, z }: t) => new three.Vector3(x, y, z)
