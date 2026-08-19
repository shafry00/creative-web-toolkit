import { useState, useEffect } from 'react'

/**
 * Track mouse position & velocity
 */
export function useMouse() {
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    isMoving: false
  })
  
  useEffect(() => {
    let prevX = 0
    let prevY = 0
    let prevTime = Date.now()
    
    const handleMouseMove = (e) => {
      const currentTime = Date.now()
      const deltaTime = currentTime - prevTime
      
      if (deltaTime > 0) {
        setMouse({
          x: e.clientX,
          y: e.clientY,
          velocityX: (e.clientX - prevX) / deltaTime,
          velocityY: (e.clientY - prevY) / deltaTime,
          isMoving: true
        })
      }
      
      prevX = e.clientX
      prevY = e.clientY
      prevTime = currentTime
    }
    
    const handleMouseStop = () => {
      setMouse(prev => ({ ...prev, isMoving: false }))
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    // Detect when mouse stops
    let timeout
    const startTimeout = () => {
      clearTimeout(timeout)
      timeout = setTimeout(handleMouseStop, 100)
    }
    window.addEventListener('mousemove', startTimeout)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousemove', startTimeout)
      clearTimeout(timeout)
    }
  }, [])
  
  return mouse
}
