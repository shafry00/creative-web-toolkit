import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

/**
 * Anti-Gravity Demo
 * Partikel melayang dengan physics simulation
 */

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a0a0a)
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05)

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.getElementById('canvas-container').appendChild(renderer.domElement)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.enableZoom = true
controls.enablePan = false

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0x667eea, 2, 10)
pointLight.position.set(-3, 2, 2)
scene.add(pointLight)

// Particles
const particleCount = 200
const particles = []
const geometry = new THREE.DodecahedronGeometry(0.1, 0)

const colors = [
  new THREE.Color(0x667eea), // Blue
  new THREE.Color(0x764ba2), // Purple
  new THREE.Color(0xf093fb), // Pink
  new THREE.Color(0x4facfe), // Cyan
]

for (let i = 0; i < particleCount; i++) {
  const material = new THREE.MeshStandardMaterial({
    color: colors[Math.floor(Math.random() * colors.length)],
    metalness: 0.3,
    roughness: 0.4,
    transparent: true,
    opacity: 0.8
  })
  
  const mesh = new THREE.Mesh(geometry, material)
  
  // Random position
  mesh.position.set(
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 15
  )
  
  // Random scale
  const scale = 0.3 + Math.random() * 0.7
  mesh.scale.set(scale, scale, scale)
  
  // Store physics data
  mesh.userData = {
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01
    ),
    rotationSpeed: new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    ),
    originalY: mesh.position.y,
    floatOffset: Math.random() * Math.PI * 2
  }
  
  scene.add(mesh)
  particles.push(mesh)
}

// Mouse interaction
const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
})

// Click to add particles
window.addEventListener('click', (event) => {
  const material = new THREE.MeshStandardMaterial({
    color: colors[Math.floor(Math.random() * colors.length)],
    metalness: 0.3,
    roughness: 0.4,
    transparent: true,
    opacity: 0.8
  })
  
  const mesh = new THREE.Mesh(geometry, material)
  
  // Position at mouse
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects([])
  
  if (intersects.length > 0) {
    mesh.position.copy(intersects[0].point)
  } else {
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    )
  }
  
  const scale = 0.3 + Math.random() * 0.7
  mesh.scale.set(scale, scale, scale)
  
  mesh.userData = {
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    ),
    rotationSpeed: new THREE.Vector3(
      (Math.random() - 0.5) * 0.03,
      (Math.random() - 0.5) * 0.03,
      (Math.random() - 0.5) * 0.03
    ),
    originalY: mesh.position.y,
    floatOffset: Math.random() * Math.PI * 2
  }
  
  scene.add(mesh)
  particles.push(mesh)
})

// Animation loop
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  
  const time = clock.getElapsedTime()
  
  // Update particles
  particles.forEach((particle, i) => {
    const data = particle.userData
    
    // Anti-gravity float
    particle.position.y = data.originalY + Math.sin(time * 0.5 + data.floatOffset) * 0.5
    
    // Gentle drift
    particle.position.x += Math.cos(time * 0.3 + i * 0.1) * 0.002
    particle.position.z += Math.sin(time * 0.2 + i * 0.1) * 0.002
    
    // Apply velocity
    particle.position.add(data.velocity)
    
    // Mouse repulsion
    raycaster.setFromCamera(mouse, camera)
    const particlePos = particle.position.clone()
    const distance = raycaster.ray.distanceToPoint(particlePos)
    
    if (distance < 2) {
      const pushDirection = particlePos.sub(raycaster.ray.origin).normalize()
      particle.position.add(pushDirection.multiplyScalar(0.05))
    }
    
    // Rotation
    particle.rotation.x += data.rotationSpeed.x
    particle.rotation.y += data.rotationSpeed.y
    particle.rotation.z += data.rotationSpeed.z
    
    // Boundary wrap
    if (Math.abs(particle.position.x) > 10) particle.position.x *= -0.9
    if (Math.abs(particle.position.y) > 10) particle.position.y *= -0.9
    if (Math.abs(particle.position.z) > 10) particle.position.z *= -0.9
  })
  
  // Animate point light
  pointLight.position.x = Math.sin(time * 0.5) * 3
  pointLight.position.y = Math.cos(time * 0.3) * 2
  
  controls.update()
  renderer.render(scene, camera)
}

animate()

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
