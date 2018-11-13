export const range = (n: number, offset: number = 0) => Array.from(Array(n).keys()).map(x => x + offset)

export const createPoints3D = (n: number) => range(n * 3).map(_ => 2000 * Math.random() - 1000)
