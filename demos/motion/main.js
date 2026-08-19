/**
 * Motion Demo
 * Smooth transitions & kinetic typography
 */

// Scroll reveal
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    }
  })
}, observerOptions)

// Observe cards
document.querySelectorAll('.card').forEach(card => {
  observer.observe(card)
})

// Observe reveal text
const revealText = document.querySelector('.reveal-text')
if (revealText) {
  observer.observe(revealText)
  
  // Stagger animation for each letter
  const letters = revealText.querySelectorAll('span')
  letters.forEach((letter, i) => {
    letter.style.transitionDelay = `${i * 0.05}s`
  })
}

// Magnetic button effect
const magneticBtn = document.querySelector('.magnetic-btn')
if (magneticBtn) {
  magneticBtn.addEventListener('mousemove', (e) => {
    const rect = magneticBtn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    magneticBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`
  })
  
  magneticBtn.addEventListener('mouseleave', () => {
    magneticBtn.style.transform = 'translate(0, 0) scale(1)'
  })
  
  magneticBtn.addEventListener('click', () => {
    magneticBtn.style.transform = 'scale(0.95)'
    setTimeout(() => {
      magneticBtn.style.transform = 'scale(1)'
    }, 150)
  })
}

// Smooth scroll with parallax
let scrollY = 0
let currentScrollY = 0

window.addEventListener('scroll', () => {
  currentScrollY = window.scrollY
})

// Floating elements parallax
const floatingElements = document.querySelectorAll('.floating')

function animateParallax() {
  scrollY += (currentScrollY - scrollY) * 0.1
  
  floatingElements.forEach((el, i) => {
    const speed = (i + 1) * 0.5
    el.style.transform = `translateY(${scrollY * speed}px)`
  })
  
  requestAnimationFrame(animateParallax)
}

animateParallax()

// Mouse trail effect
const trail = []
const trailLength = 10

for (let i = 0; i < trailLength; i++) {
  const dot = document.createElement('div')
  dot.style.cssText = `
    position: fixed;
    width: ${10 - i}px;
    height: ${10 - i}px;
    background: rgba(102, 126, 234, ${1 - i * 0.1});
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
  `
  document.body.appendChild(dot)
  trail.push({ el: dot, x: 0, y: 0 })
}

let mouseX = 0
let mouseY = 0

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
})

function animateTrail() {
  trail.forEach((dot, i) => {
    const prev = i === 0 ? { x: mouseX, y: mouseY } : trail[i - 1]
    
    dot.x += (prev.x - dot.x) * 0.3
    dot.y += (prev.y - dot.y) * 0.3
    
    dot.el.style.left = `${dot.x}px`
    dot.el.style.top = `${dot.y}px`
  })
  
  requestAnimationFrame(animateTrail)
}

animateTrail()

// Card tilt effect
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`
  })
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'
  })
})

console.log('✨ Motion Demo loaded')
