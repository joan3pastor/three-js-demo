import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, PresentationControls, ContactShadows, Html } from '@react-three/drei'

export default function App() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }} touch>
      <ambientLight intensity={0.4} />
      <spotLight position={[-10, 4, 20]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}>
        <Glasses rotation={[-Math.PI / 2, 0, Math.PI*3/4]} position={[-0.25, 0, 0]} scale={0.2}/>
      </PresentationControls>
      <ContactShadows rotation-x={Math.PI / 2} position={[0, -1, 0.3]} opacity={0.7} width={10} height={10} blur={2.5} far={5} />
    </Canvas>
  )
}

function Glasses(props) {

  const ref = useRef()
  const [hover, hovering] = useState(false);
  const over = () => hovering(true)
  const out = () => hovering(false)

  const { nodes, materials } = useGLTF('/glasses.glb')

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = -Math.PI / 2 + Math.cos(t / 3) / 10
    ref.current.rotation.y = Math.sin(t / 3) / 10
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })

  return (
    <group ref={ref} {...props} dispose={null} onPointerOver={over} onPointerOut={out}>
      <mesh geometry={nodes.Circle001_1.geometry} material={materials['Material.002']}>
        {hover && <Html scale={1} rotation={[Math.PI/2, Math.PI, 0]} position={[-4.5, 1, 0]} transform occlude>
          <div className='pricetag-wrapper'>
            <div className='pricetag-arrow'/>
            <div className='pricetag'>
              <span className='pricetag-label'>99,95 €</span>
            </div>
          </div>
        </Html>}
      </mesh>
      <mesh geometry={nodes.Circle001.geometry} material={materials['frame color']} />
      <mesh geometry={nodes.Circle001_2.geometry} material={materials['frame color']} />
      <mesh geometry={nodes.Circle001_3.geometry} material={materials['ear piece']} />
    </group>
  )
}

// TODO [impr.] display pricetag on drag (for better performance)
