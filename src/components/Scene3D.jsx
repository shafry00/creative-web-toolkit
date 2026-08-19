import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

/**
 * Reusable 3D Scene wrapper
 * Setup Three.js scene dengan lighting, camera, dan controls
 */
export function Scene3D({
  children,
  camera = { position: [0, 0, 5], fov: 75 },
  controls = true,
  background = '#000000',
  className = ''
}) {
  return (
    <div className={`w-full h-full ${className}`} style={{ background }}>
      <Canvas>
        <PerspectiveCamera makeDefault {...camera} />
        {controls && <OrbitControls enableZoom={false} enablePan={false} />}
        
        {/* Default lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {children}
      </Canvas>
    </div>
  )
}
