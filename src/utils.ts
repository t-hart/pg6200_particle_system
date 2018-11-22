export const range = ({ n, offset = 0, stepSize = 1 }: { n: number, offset?: number, stepSize?: number }) =>
  Array.from(Array(n).keys()).map(x => x * stepSize + offset)
