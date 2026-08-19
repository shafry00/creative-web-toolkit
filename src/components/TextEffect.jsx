import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Text effects: typewriter, glitch, kinetic typography
 */
export function TypewriterText({ text, speed = 0.05, delay = 0, className = '' }) {
  const ref = useRef(null)
  
  useEffect(() => {
    if (!ref.current) return
    
    const el = ref.current
    el.textContent = ''
    
    gsap.delayedCall(delay, () => {
      let i = 0
      const timer = setInterval(() => {
        if (i < text.length) {
          el.textContent += text[i]
          i++
        } else {
          clearInterval(timer)
        }
      }, speed * 1000)
    })
  }, [text, speed, delay])
  
  return <span ref={ref} className={className} />
}

export function GlitchText({ text, className = '' }) {
  const ref = useRef(null)
  
  useEffect(() => {
    if (!ref.current) return
    
    const el = ref.current
    const originalText = text
    
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'
    
    const glitch = () => {
      let iterations = 0
      const maxIterations = 10
      
      const interval = setInterval(() => {
        el.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iterations) return originalText[index]
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          })
          .join('')
        
        if (iterations >= originalText.length) {
          clearInterval(interval)
        }
        
        iterations += 1 / 3
      }, 30)
    }
    
    // Glitch on hover
    el.addEventListener('mouseenter', glitch)
    
    // Random glitch
    const randomGlitch = setInterval(() => {
      if (Math.random() > 0.95) glitch()
    }, 100)
    
    return () => {
      el.removeEventListener('mouseenter', glitch)
      clearInterval(randomGlitch)
    }
  }, [text])
  
  return (
    <span
      ref={ref}
      className={`inline-block cursor-pointer ${className}`}
      style={{ fontFamily: 'monospace' }}
    >
      {text}
    </span>
  )
}

export function KineticText({ text, className = '' }) {
  const containerRef = useRef(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const chars = containerRef.current.querySelectorAll('.char')
    
    const handleMouseMove = (e) => {
      chars.forEach((char, i) => {
        const rect = char.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const maxDistance = 150
        
        if (distance < maxDistance) {
          const power = 1 - distance / maxDistance
          gsap.to(char, {
            x: deltaX * power * 0.3,
            y: deltaY * power * 0.3,
            rotation: deltaX * power * 0.1,
            scale: 1 + power * 0.3,
            duration: 0.3,
            ease: 'power2.out'
          })
        } else {
          gsap.to(char, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
          })
        }
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="char inline-block"
          style={{ transformOrigin: 'center' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  )
}
