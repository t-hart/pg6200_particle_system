export const range = ({ n, offset = 0, stepSize = 1 }: { n: number, offset?: number, stepSize?: number }) =>
  Array(n).fill().map(x => x * stepSize + offset)

export const zip = (...arrs: [[]]) =>
  arrs.reduce((shortest, x) => x.length < shortest.length ? x : shortest)
    .map((_, i) => arrs.map((_, j) => arrs[j][i]))

export const wrap = (min: number, max: number) => (n: number): number =>
  n < min ? wrap(min, max)(max - (min - n)) :
    n > max ? wrap(min, max)(min + (n - max))
      : n
