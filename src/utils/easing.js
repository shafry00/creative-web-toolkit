/**
 * Custom easing functions untuk animations
 */

export const easing = {
  // Smooth elastic
  elasticOut: (t) => {
    const p = 0.3
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1
  },
  
  // Bounce effect
  bounceOut: (t) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
    }
  },
  
  // Smooth back
  backOut: (t) => {
    const s = 1.70158
    return (t = t - 1) * t * ((s + 1) * t + s) + 1
  },
  
  // Exponential ease
  expoOut: (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  },
  
  // Smooth sine
  sineOut: (t) => {
    return Math.sin((t * Math.PI) / 2)
  },
  
  // Custom spring
  spring: (t, tension = 0.5) => {
    return 1 - Math.cos(t * Math.PI * tension) * Math.exp(-t * 6)
  },
  
  // Anticipation (slight pull back before moving forward)
  anticipate: (t) => {
    return t * t * ((2.5 + 1) * t - 2.5)
  }
}

/**
 * Interpolation helpers
 */
export const lerp = (start, end, t) => start + (end - start) * t

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin))
}

/**
 * Noise functions (simple 1D/2D)
 */
export const noise1D = (x) => {
  const n = Math.sin(x * 127.1) * 43758.5453
  return n - Math.floor(n)
}

export const noise2D = (x, y) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}
