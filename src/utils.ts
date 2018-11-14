export const range = ({ n, offset = 0, stepSize = 1 }: { n: number, offset?: number, stepSize?: number }) => Array.from(Array(n).keys()).map(x => x * stepSize + offset)

export const createPoints3D = (n: number) => range({ n: n * 3 }).map(_ => 2000 * Math.random() - 1000)

export const zip = (...arrs: [[]]) =>
  arrs.reduce((shortest, x) => x.length < shortest.length ? x : shortest)
    .map((_, i) => arrs.map((_, j) => arrs[j][i]))

export const wrap = (min: number, max: number) => (n: number) =>
  n < min ? max - (min - n) :
    n > max ? min + (n - max)
      : n
