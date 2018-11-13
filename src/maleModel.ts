import * as three from 'three'
import { OBJLoader, MTLLoader } from 'three-obj-mtl-loader'
import { asPromise } from './loaders'

//models
import model from 'assets/obj/male02/male02.obj'
import mtl from 'assets/obj/male02/male02.mtl'
import tex from 'assets/textures/UV_Grid_Sm.jpg'

export const create = async () => {
  const objLoader = new OBJLoader()
  const mtlLoader = new MTLLoader()
  const textureLoader = new three.TextureLoader()

  const texture = textureLoader.load(tex)

  return asPromise(mtlLoader)(mtl)
    .then(materials => {
      materials.preload()
      objLoader.setMaterials(materials)
      return asPromise(objLoader)(model)
    })
    .then(obj => {
      obj.traverse(child => {
        if (child.isMesh) {
          child.material.map = texture
        }
      })
      return obj
    })
    .catch(e => console.log('Encountered an error while loading the model:', e))

}
