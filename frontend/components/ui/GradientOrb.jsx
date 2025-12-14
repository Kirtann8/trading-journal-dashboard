'use client'

import { memo, useEffect, useRef } from 'react'

const GradientOrb = memo(({
  className = '',
  size = 400,
  color = 'primary',
  blur = 100,
  opacity = 0.3,
  animate = true,
  position = { top: 0, right: 0 },
}) => {
  const orbRef = useRef(null)

  const colors = {
    primary: 'hsl(238, 84%, 67%)',
    accent: 'hsl(347, 83%, 58%)',
    success: 'hsl(160, 84%, 39%)',
    warning: 'hsl(43, 96%, 56%)',
    mixed: 'linear-gradient(135deg, hsl(238, 84%, 67%), hsl(347, 83%, 58%))',
  }

  useEffect(() => {
    if (!animate || !orbRef.current) return

    let animationId
    let time = 0

    const animateOrb = () => {
      time += 0.003
      const x = Math.sin(time) * 30
      const y = Math.cos(time * 0.8) * 20
      
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
      
      animationId = requestAnimationFrame(animateOrb)
    }

    animateOrb()
    return () => cancelAnimationFrame(animationId)
  }, [animate])

  return (
    <div
      ref={orbRef}
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: colors[color] || color,
        filter: `blur(${blur}px)`,
        opacity,
        borderRadius: '50%',
        ...position,
      }}
    />
  )
})

GradientOrb.displayName = 'GradientOrb'

export default GradientOrb
