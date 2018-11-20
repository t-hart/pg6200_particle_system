import * as three from 'three'
import { OrbitControls } from './orbitControls'
import fresnel from './shaders/fresnel'

import * as maleModel from './maleModel'
import * as snow from './snow'


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
  camera.position.z = 250
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

const centerModel = (model: three.Object3D) => {
  const box = new three.Box3().setFromObject(model)
  const boundingBoxSize = box.max.sub(box.min)
  const height = boundingBoxSize.y
  model.position.y = - height / 2
  return model
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
  maleModel.create()
    .then(centerModel)
    .then(model => scene.add(model))

  const numPoints = 15000

  const dimensions = { x: 500, y: 500, z: 500 }
  const snowList = snow.make(dimensions)(numPoints)
  snowList.forEach(({ points }) => scene.add(points))
  const update = snow.update(dimensions)

  const gravity = { x: 0, y: -9.81, z: 0 }
  const winds = { x: 50, y: 0, z: 5 }

  const animate = (previous: number) => (now: number) => {
    const time = now * .01
    const timeTrunc = now * .0000005
    const cosTime = (Math.cos(timeTrunc * 997) + Math.cos(timeTrunc * 997)) + 2
    const delta = time - previous

    snowList.forEach(({ geometry, snowflakes }) => {
      update(camera.position)(geometry, snowflakes)(delta, cosTime)
    })

    renderer.render(scene, camera)

    requestAnimationFrame(animate(time))

  }
  requestAnimationFrame(animate(0))
}
