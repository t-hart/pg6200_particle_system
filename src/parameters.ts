export interface t {
  size: number,
  gravityMultiplier: number,
  windX: number,
  windZ: number,
  color: number,
  opacity: number,
  radius: number,
  scale: number
}

export const defaultValue = (): t => ({
  color: 0xFFFFFF,
  radius: .5,
  size: 70,
  opacity: .5,
  gravityMultiplier: 9.81,
  windX: 7,
  windZ: 7,
  scale: 30
})
