import * as three from 'three'
import { OrbitControls } from './orbitControls'
import * as vec from './vector3'

import * as maleModel from './maleModel'
import * as pointCloud from './pointCloud'


const initControls = (renderer: three.WebGLRenderer) => (camera: three.PerspectiveCamera) => {
  const controls = new OrbitControls(camera, renderer.domElement)

  controls.minDistance = 0
  controls.maxDistance = Infinity
  controls.enableZoom = true
  controls.zoomSpeed = 1

  controls.enablePan = true
  controls.enableDamping = false

  return controls
}

const initRenderer = (width: number, height: number) => (canvas: HTMLCanvasElement) => {
  const renderer = new three.WebGLRenderer({
    canvas
  })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  return renderer
}

const perspectiveCamera = (width: number, height: number) => new three.PerspectiveCamera(50, width / height, 1, 5000)

const initCamera = (width: number, height: number) => {
  const camera = perspectiveCamera(width, height)
  camera.position.z = 500
  return camera
}

const initDirectionalLight = () => {
  const directional = new three.DirectionalLight(0xffffff)
  directional.position.set(10, 10, 10)
  directional.castShadow = true
  directional.shadow.mapSize.width = 1024
  directional.shadow.mapSize.height = 1024

  return directional
}

const initAmbientLight = () => new three.AmbientLight(0xcccccc, 0.8)

const initScene = () => new three.Scene()

const addResizeListener = (renderer: three.Renderer, camera: three.Camera) => {
  window.onresize = ({ target }) => {
    const { innerWidth, innerHeight } = target
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  }
}

export const init = (width: number, height: number) => (canvas: HTMLCanvasElement) => {
  // initialization
  const scene = initScene()
  const renderer = initRenderer(width, height)(canvas)
  const camera = initCamera(width, height)
  const directionalLight = initDirectionalLight()
  const ambientLight = initAmbientLight()

  // resize listening
  addResizeListener(renderer, camera)


  // lighting
  scene.add(ambientLight)
  scene.add(directionalLight)

  // controls
  initControls(renderer)(camera)

  //models
  maleModel.create().then(x => scene.add(x))

  const numPoints = 10000
  // const { material, points, velocity, geometry, velocities } = pointCloud.create(numPoints)
  // scene.add(points)
  // const updatePoints = pointCloud.update(geometry, velocities)

  const snow = pointCloud.snow(numPoints)
  snow.forEach(({ points }) => scene.add(points))

  const animate = (now) => {
    const time = now * .00001
    requestAnimationFrame(animate)
    const h = (360 * (1 + time * 5) % 360) / 360
    // material.color.setHSL(h, .5, .5)

    // updatePoints(time)

    // vec.assignVectorThree(points.position, addPoints(points.position, vec.scale(time)(velocity)))

    renderer.render(scene, camera)
  }
  requestAnimationFrame(animate)
}
