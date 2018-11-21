import * as three from 'three'
import * as vec from './vector3'
import * as utils from './utils'

export interface t {
  baseVelocity: vec.t,
  drag: number,
  velocity: vec.t
}

const velocityVec = (spread: number = 1) => ({
  x: three.Math.randFloatSpread(spread),
  y: 0,
  z: three.Math.randFloatSpread(spread)
})

export const getVelocity = ({ baseVelocity, velocity }: t): vec.t => vec.add(baseVelocity, velocity)

export const addForce = (force: vec.t) => (snowflake: t): vec.t => {
  const velocity = vec.add(vec.scale(snowflake.drag)(snowflake.velocity), vec.scale(snowflake.drag)(force))
  snowflake.velocity = velocity
  return vec.add(snowflake.baseVelocity, velocity)
}

export const create = (xzBiasSpread: number): t => {
  const drag = Math.random() * .1 + .05
  const baseVelocity = vec.scale(drag)(velocityVec(xzBiasSpread))
  return {
    baseVelocity,
    drag,
    velocity: baseVelocity
  }
}
