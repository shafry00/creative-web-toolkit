import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Anti-gravity physics simulation
 * Elemen melayang dengan physics yang realistis
 */
export function PhysicsWorld({ count = 50, bounds = 5 }) {
  const meshRef = useRef()
  
  // Generate random positions and velocities
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * bounds * 2,
          (Math.random() - 0.5) * bounds * 2,
          (Math.random() - 0.5) * bounds * 2
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        scale: 0.1 + Math.random() * 0.3,
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
      })
    }
    return temp
  }, [count, bounds])
  
  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    meshRef.current.children.forEach((child, i) => {
      const p = particles[i]
      
      // Anti-gravity: float upward with sine wave
      p.position.y += Math.sin(time + i) * 0.005
      p.position.x += Math.cos(time * 0.5 + i) * 0.003
      
      // Apply velocity
      p.position.add(p.velocity)
      
      // Boundary check (bounce)
      if (Math.abs(p.position.x) > bounds) p.velocity.x *= -1
      if (Math.abs(p.position.y) > bounds) p.velocity.y *= -1
      if (Math.abs(p.position.z) > bounds) p.velocity.z *= -1
      
      // Update position
      child.position.copy(p.position)
      
      // Rotation
      child.rotation.x += p.rotationSpeed.x
      child.rotation.y += p.rotationSpeed.y
      child.rotation.z += p.rotationSpeed.z
    })
  })
  
  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <mesh key={i} scale={p.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={p.color}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}
