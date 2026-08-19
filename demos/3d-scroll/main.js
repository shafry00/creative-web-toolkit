import * as THREE from 'three'

/**
 * 3D Scroll Demo
 * Scene berubah seiring scroll
 */

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a0a0a)

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.getElementById('canvas-container').appendChild(renderer.domElement)

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// Objects for each section
const objects = []

// Section 0: Sphere
const sphereGeo = new THREE.IcosahedronGeometry(1.5, 1)
const sphereMat = new THREE.MeshStandardMaterial({
  color: 0x667eea,
  wireframe: true,
  metalness: 0.3,
  roughness: 0.4
})
const sphere = new THREE.Mesh(sphereGeo, sphereMat)
sphere.visible = true
scene.add(sphere)
objects.push(sphere)

// Section 1: Torus
const torusGeo = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
const torusMat = new THREE.MeshStandardMaterial({
  color: 0x764ba2,
  metalness: 0.5,
  roughness: 0.3
})
const torus = new THREE.Mesh(torusGeo, torusMat)
torus.visible = false
scene.add(torus)
objects.push(torus)

// Section 2: Octahedron
const octaGeo = new THREE.OctahedronGeometry(1.5, 0)
const octaMat = new THREE.MeshStandardMaterial({
  color: 0xf093fb,
  metalness: 0.4,
  roughness: 0.3
})
const octa = new THREE.Mesh(octaGeo, octaMat)
octa.visible = false
scene.add(octa)
objects.push(octa)

// Section 3: Particles
const particleCount = 500
const particleGeo = new THREE.BufferGeometry()
const positions = new Float32Array(particleCount * 3)
const colors = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10
  positions[i * 3 + 1] = (Math.random() - 0.5) * 10
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  
  const color = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6)
  colors[i * 3] = color.r
  colors[i * 3 + 1] = color.g
  colors[i * 3 + 2] = color.b
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particleMat = new THREE.PointsMaterial({
  size: 0.05,
  vertexColors: true,
  transparent: true,
  opacity: 0
})

const particles = new THREE.Points(particleGeo, particleMat)
scene.add(particles)
objects.push(particles)

// Section 4: All together
const finalGeo = new THREE.DodecahedronGeometry(1.5, 0)
const finalMat = new THREE.MeshStandardMaterial({
  color: 0x4facfe,
  metalness: 0.6,
  roughness: 0.2
})
const finalObj = new THREE.Mesh(finalGeo, finalMat)
finalObj.visible = false
scene.add(finalObj)
objects.push(finalObj)

// Scroll tracking
let scrollProgress = 0
let currentSection = 0

const sections = document.querySelectorAll('.section')
const progressBar = document.getElementById('progress')

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress = scrollTop / docHeight
  
  // Update progress bar
  progressBar.style.width = `${scrollProgress * 100}%`
  
  // Determine current section
  const newSection = Math.min(4, Math.floor(scrollProgress * 5))
  if (newSection !== currentSection) {
    currentSection = newSection
    updateVisibility()
  }
  
  // Update section visibility
  sections.forEach((section, i) => {
    const rect = section.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.7 && rect.bottom > 0) {
      section.classList.add('visible')
    }
  })
})

function updateVisibility() {
  objects.forEach((obj, i) => {
    obj.visible = i === currentSection || i === 4
  })
}

// Animation loop
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  
  const time = clock.getElapsedTime()
  const sectionProgress = (scrollProgress * 5) % 1
  
  // Animate based on current section
  switch (currentSection) {
    case 0: // Sphere
      sphere.rotation.x = time * 0.5
      sphere.rotation.y = time * 0.3
      sphere.scale.setScalar(1 + Math.sin(time) * 0.1)
      break
      
    case 1: // Torus
      torus.rotation.x = time * 0.3
      torus.rotation.y = time * 0.5
      torus.scale.setScalar(0.5 + sectionProgress * 0.5)
      break
      
    case 2: // Octahedron
      octa.rotation.x = time * 0.4
      octa.rotation.z = time * 0.3
      const colors2 = [0xf093fb, 0x4facfe, 0x667eea]
      octa.material.color.setHex(colors2[Math.floor(time) % 3])
      break
      
    case 3: // Particles
      particleMat.opacity = sectionProgress
      particleGeo.attributes.position.array.forEach((_, i) => {
        if (i % 3 === 1) { // Y position
          particleGeo.attributes.position.array[i] += Math.sin(time + i) * 0.001
        }
      })
      particleGeo.attributes.position.needsUpdate = true
      particles.rotation.y = time * 0.1
      break
      
    case 4: // Finale
      finalObj.rotation.x = time * 0.5
      finalObj.rotation.y = time * 0.3
      finalObj.scale.setScalar(0.5 + Math.sin(time * 2) * 0.2)
      break
  }
  
  // Camera follows scroll
  camera.position.y = -scrollProgress * 3
  camera.lookAt(0, -scrollProgress * 3, 0)
  
  renderer.render(scene, camera)
}

animate()

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
