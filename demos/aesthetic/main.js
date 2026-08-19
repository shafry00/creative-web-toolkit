import * as THREE from 'three'

/**
 * Aesthetic Demo
 * Glitch, noise, distortion effects
 */

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a0a0a)

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 3

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.getElementById('canvas-container').appendChild(renderer.domElement)

// Shader material for effects
const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Wave distortion
    pos.x += sin(pos.y * 10.0 + uTime * 2.0) * uIntensity * 0.1;
    pos.y += cos(pos.x * 10.0 + uTime * 2.0) * uIntensity * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform int uEffect; // 0: glitch, 1: noise, 2: wave, 3: rgb
  
  // Random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Noise function
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    vec2 uv = vUv;
    vec3 color;
    
    // Glitch effect
    if (uEffect == 0) {
      float glitch = step(0.9, random(vec2(uTime * 10.0, 0.0)));
      float shift = random(vec2(uTime * 20.0, uv.y * 100.0)) * 0.1 * glitch * uIntensity;
      uv.x += shift;
      
      float r = random(vec2(uv.x * 100.0, uTime));
      float g = random(vec2(uv.x * 100.0 + 1.0, uTime));
      float b = random(vec2(uv.x * 100.0 + 2.0, uTime));
      
      float scanline = sin(uv.y * 500.0 + uTime * 10.0) * 0.02 * glitch;
      color = vec3(r + scanline, g, b);
    }
    // Noise effect
    else if (uEffect == 1) {
      float n = noise(uv * 10.0 + uTime * 0.5);
      float n2 = noise(uv * 20.0 + uTime * 0.3);
      float n3 = noise(uv * 40.0 + uTime * 0.2);
      
      float combined = n * 0.5 + n2 * 0.3 + n3 * 0.2;
      
      vec3 color1 = vec3(0.4, 0.2, 0.8);
      vec3 color2 = vec3(0.9, 0.2, 0.6);
      vec3 color3 = vec3(0.1, 0.8, 0.6);
      
      color = mix(color1, color2, combined);
      color = mix(color, color3, noise(uv * 5.0 + uTime * 0.1));
    }
    // Wave effect
    else if (uEffect == 2) {
      float wave = sin(uv.x * 20.0 + uTime * 2.0) * uIntensity;
      float wave2 = cos(uv.y * 20.0 + uTime * 1.5) * uIntensity;
      
      vec3 color1 = vec3(0.4, 0.5, 1.0);
      vec3 color2 = vec3(1.0, 0.2, 0.6);
      
      color = mix(color1, color2, sin(wave + wave2) * 0.5 + 0.5);
      color *= 1.0 + sin(uv.x * 50.0 + uTime * 5.0) * 0.1;
    }
    // RGB split
    else {
      float offset = uIntensity * 0.05;
      float r = noise(uv * 10.0 + uTime + vec2(offset, 0.0));
      float g = noise(uv * 10.0 + uTime);
      float b = noise(uv * 10.0 + uTime + vec2(0.0, offset));
      
      color = vec3(r, g, b);
      color *= 1.0 + sin(uv.y * 100.0 + uTime * 10.0) * 0.05;
    }
    
    // Add vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.8;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

// Create plane with shader
const geometry = new THREE.PlaneGeometry(6, 6, 32, 32)
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 1.0 },
    uEffect: { value: 0 }
  }
})

const plane = new THREE.Mesh(geometry, material)
scene.add(plane)

// Effect buttons
let currentEffect = 0
const buttons = document.querySelectorAll('.btn')

buttons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    currentEffect = i
    material.uniforms.uEffect.value = i
  })
})

// Mouse interaction
let mouseX = 0
let mouseY = 0

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1
})

// Animation loop
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  
  const time = clock.getElapsedTime()
  
  material.uniforms.uTime.value = time
  material.uniforms.uIntensity.value = 1.0 + Math.sin(time) * 0.5
  
  // Mouse influence
  plane.rotation.x = mouseY * 0.1
  plane.rotation.y = mouseX * 0.1
  
  renderer.render(scene, camera)
}

animate()

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
