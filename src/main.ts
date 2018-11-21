import * as three from 'three'
import { OrbitControls } from './orbitControls'
import * as dat from 'dat.gui'
import * as parameters from './parameters'
import * as vec from './vector3'

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

const initCamera = (width: number, height: number) => (particleSystemDimensions: vec.t) => {
  const camera = perspectiveCamera(width, height)
  camera.position.z = particleSystemDimensions.z / 2
  camera.position.y = particleSystemDimensions.y / 2
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

const initGUI = (material: three.ShaderMaterial, params: parameters.t) => {
  const handleChange = () => {
    Object.keys(material.uniforms)
      .filter(x => x !== 'color')
      .forEach(prop => {
        if (params[prop] !== undefined) {
          material.uniforms[prop].value = params[prop]
        }
      })
    material.uniforms.color.value.set(params.color)
  }

  const controls = new dat.GUI()

  const add = (prop: string, min: number, max: number) => {
    controls.add(params, prop, min, max).onChange(handleChange)
  }

  [
    ['size', 1, 200],
    ['scale', 1, 100],
    ['gravityMultiplier', -50, 50],
    ['windMultiplier', -50, 50],
    ['opacity', 0, 1],
    ['radius', 0, 5]
  ].forEach(row => add(...row))

  controls.addColor(params, 'color').onChange(handleChange)

  return controls
}

export const init = (width: number, height: number) => (canvas: HTMLCanvasElement) => {
  // const dimensions = { x: 1000, y: 1000, z: 1000 }
  const dimensions = { x: 500, y: 500, z: 500 }

  // initialization
  const scene = initScene()
  const renderer = initRenderer(width, height)(canvas)
  const camera = initCamera(width, height)(dimensions)
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
    .then(model => scene.add(model))

  const numPoints = 50000

  const params = parameters.defaultValue()
  const snowParticles = snow.make(dimensions, params)(numPoints)
  scene.add(snowParticles.points)

  initGUI(snowParticles.material, params)

  const animate = (previous: number) => (now: number) => {
    snowParticles.points.material.uniforms.time.value = now * .001
    renderer.render(scene, camera)
    requestAnimationFrame(animate(now))
  }
  requestAnimationFrame(animate(0))
}
