export interface t {
  size: number,
  gravity: number,
  windX: number,
  windZ: number,
  color: number,
  opacity: number,
  horizontalRadius: number,
  verticalRadius: number,
  scale: number
}

export const defaultValue = (): t => ({
  color: 0xFFFFFF,
  horizontalRadius: 5,
  verticalRadius: 5,
  size: 70,
  opacity: .5,
  gravity: 20,
  windX: 7,
  windZ: 7,
  scale: 30
})
