import { init } from './main'
const canvas = document.querySelector('#canvas')

if (canvas !== null) {
  const width = window.innerWidth
  const height = window.innerHeight

  init(width, height)(canvas)
}
