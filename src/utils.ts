export const range = ({ n, offset = 0, stepSize = 1 }: { n: number, offset?: number, stepSize?: number }) =>
  Array.from(Array(n).keys()).map(x => x * stepSize + offset)

export const zip = (...arrs: [[]]) =>
  arrs.reduce((shortest, x) => x.length < shortest.length ? x : shortest)
    .map((_, i) => arrs.map((_, j) => arrs[j][i]))

export const wrap = (min: number, max: number) => (n: number): number => {
  const diff = max - min
  if (n < min) {
    return max - Math.abs(n - min) % diff
  } else if (n > max) {
    return min + Math.abs(n - max) % diff
  } else {
    return n
  }
  // n < min ? max - (n % min) :
  //   n > max ? min + (n % max)
  //     : n
}
export const clamp = (min: number, max: number) => (n: number) => n < min ? min : n > max ? max : n
