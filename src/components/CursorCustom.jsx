import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Custom cursor dengan trail effect
 */
export function CursorCustom({
  size = 20,
  color = '#fff',
  trailLength = 5,
  mixBlendMode = 'difference'
}) {
  const cursorRef = useRef(null)
  const trailsRef = useRef([])
  
  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none'
    
    // Create cursor element
    const cursor = document.createElement('div')
    cursor.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      mix-blend-mode: ${mixBlendMode};
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: transform 0.1s ease;
    `
    document.body.appendChild(cursor)
    cursorRef.current = cursor
    
    // Create trail elements
    const trails = []
    for (let i = 0; i < trailLength; i++) {
      const trail = document.createElement('div')
      const trailSize = size * (1 - i * 0.15)
      trail.style.cssText = `
        position: fixed;
        width: ${trailSize}px;
        height: ${trailSize}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        mix-blend-mode: ${mixBlendMode};
        z-index: 9998;
        transform: translate(-50%, -50%);
        opacity: ${1 - i * 0.2};
      `
      document.body.appendChild(trail)
      trails.push(trail)
    }
    trailsRef.current = trails
    
    // Mouse move handler
    const handleMouseMove = (e) => {
      gsap.to(cursor, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      })
      
      trails.forEach((trail, i) => {
        gsap.to(trail, {
          left: e.clientX,
          top: e.clientY,
          duration: 0.3 + i * 0.1,
          ease: 'power2.out'
        })
      })
    }
    
    // Click effect
    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1
      })
    }
    
    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'elastic.out(1, 0.3)'
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.body.style.cursor = 'auto'
      cursor.remove()
      trails.forEach(t => t.remove())
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [size, color, trailLength, mixBlendMode])
  
  return null
}
