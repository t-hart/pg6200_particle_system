export interface t {
  size: number,
  gravityMultiplier: number,
  windMultiplier: number,
  color: number,
  opacity: number,
  radius: number,
  scale: number
}

export const defaultValue = (): t => ({
  color: 0xFFFFFF,
  radius: 2.5,
  size: 30,
  opacity: .5,
  gravityMultiplier: 9.81,
  windMultiplier: 7,
  scale: 30
})
