import * as three from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts'
import { OBJLoader } from 'three-obj-mtl-loader'

//models
import male from 'assets/obj/male02/male02.obj'

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

const initCamera = (width: number, height: number) => {
  const camera = new three.PerspectiveCamera(50, width / height, 1, 5000)
  camera.position.z = 2000
  return camera
}

const initDirectionalLight = () => {
  const directional = new three.DirectionalLight(0xffffff, .5)
  directional.position.set(10, 10, 10)
  directional.castShadow = true
  directional.shadow.mapSize.width = 1024
  directional.shadow.mapSize.height = 1024

  return directional
}

const initScene = () => new three.Scene()

export const init = (width: number, height: number) => (canvas: HTMLCanvasElement) => {
  // initialization
  const scene = initScene()
  const renderer = initRenderer(width, height)(canvas)
  const camera = initCamera(width, height)
  const directionalLight = initDirectionalLight()

  scene.add(directionalLight)
  initControls(renderer)(camera)

  const objLoader = new OBJLoader()
  objLoader.load(male, function(obj) { scene.add(obj) },
    xhr => console.log(`${xhr.loaded / xhr.total * 100}% loaded`),
    e => console.log('Encountered an error while loading the model:', e)
  )

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
}
