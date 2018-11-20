import * as three from 'three'
import * as vec from './vector3'
import * as utils from './utils'

export interface t {
  baseVelocity: vec.t,
  drag: number,
  externalVelocity: vec.t,
  velocity: vec.t
}

const velocityVec = () => ({
  x: three.Math.randFloatSpread(10),
  y: 0,
  z: three.Math.randFloatSpread(10)
})

export const addForce = (force: vec.t) => (snowflake: t) => {
  const external = vec.scale(snowflake.drag)(force)
  const clamp = (component: string): number => utils.clamp(0, force[component])(external[component])
  const max = { x: clamp('x'), y: clamp('y'), z: clamp('z') }
  return {
    ...snowflake,
    externalVelocity: vec.scale(snowflake.drag)(force),
    velocity: snowflake.velocity + vec.scale(snowflake.drag)(force)
  }
}

export const create = () => {
  const baseVelocity = velocityVec()
  return {
    baseVelocity,
    drag: Math.random(),
    velocity: baseVelocity
  }
}
