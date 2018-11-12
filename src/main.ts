import * as three from 'three'
import { OrbitControls } from './orbitControls'
import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader'

//models
import male from 'assets/obj/male02/male02.obj'
import maleMtl from 'assets/obj/male02/male02.mtl'
import uvTexture from 'assets/textures/UV_Grid_Sm.jpg'

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
    console.log(camera.aspect)
    camera.aspect = innerWidth / innerHeight
    console.log(camera.aspect)
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  }
}

const animate = (renderer: three.Renderer, scene: three.Scene, camera: three.Camera) => {
  renderer.render(scene, camera)
}

export const init = (width: number, height: number) => (canvas: HTMLCanvasElement) => {
  // initialization
  const scene = initScene()
  const renderer = initRenderer(width, height)(canvas)
  const camera = initCamera(width, height)
  const directionalLight = initDirectionalLight()
  const ambientLight = initAmbientLight()

  addResizeListener(renderer, camera)

  scene.add(ambientLight)
  scene.add(directionalLight)
  initControls(renderer)(camera)

  const objLoader = new OBJLoader()
  const mtlLoader = new MTLLoader()
  const textureLoader = new three.TextureLoader()

  const texture = textureLoader.load(uvTexture)

  mtlLoader.load(maleMtl, (materials) => {
    materials.preload()
    objLoader.setMaterials(materials)
    objLoader.load(male, obj => {
      obj.traverse(child => {
        if (child.isMesh) {
          child.material.map = texture
        }
      })
      scene.add(obj)
    },
      xhr => console.log(`${xhr.loaded / xhr.total * 100}% loaded`),
      e => console.log('Encountered an error while loading the model:', e)
    )
  })

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
}
