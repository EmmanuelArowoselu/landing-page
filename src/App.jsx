import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Environment } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'

function Banana({ z }) {
  const ref = useRef()
  const { nodes, materials } = useGLTF('/banana-v1-transformed.glb')
  const { viewport, camera } = useThree()
  const { width, height} = viewport.getCurrentViewport(camera, [0, 0, -10])

  const [data] = useState ({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  })

  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    ref.current.rotation.set((data.rX += 0.001), (data.rY += 0.001), (data.rZ += 0.0001))
    ref.current.position.set(data.x * width, (data.y += 0.025), z)
    if (data.y > height ) {
      data.y = -height
    }
  })

  return(
  
    <mesh ref = {ref} geometry={nodes.banana_high.geometry} material={materials.skin} material-emmisive='orange'/>
      
  )
}

export default function App( { count = 100, depth = 80 }) {
  return (
  <Canvas gl = {{ alpha: false}} camera={{near: 0.01, far: 110, fov:30}}>
    <color attach='background' args = {['#ffbf40']}/>
    <spotLight position={[10, 10, 10]} intensity={1}/>
    <Suspense fallback={null}>
    <Environment preset='sunset'/>
    {Array.from({ length: count }, (_, i) => (<Banana key = {i} z={-(i/ count) * depth - 20} />))}
    </Suspense>
    <EffectComposer>
      <DepthOfField target={[0,0,depth / 2]} focalLength={1} bokehScale={11} height={700}/>
    </EffectComposer>
    </Canvas>
  )
}

