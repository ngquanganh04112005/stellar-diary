import { useEffect, useRef, useState } from 'react'

export default function Globe3D({ imageUrl, size = 256, speed = 0.005 }) {
  const canvasRef = useRef(null)
  const [textureLoaded, setTextureLoaded] = useState(false)
  const textureDataRef = useRef(null)
  const textureSizeRef = useRef({ width: 0, height: 0 })
  const lutRef = useRef([])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      
      try {
        const imgData = ctx.getImageData(0, 0, img.width, img.height)
        textureDataRef.current = imgData.data
        textureSizeRef.current = { width: img.width, height: img.height }
        
        // Generate Look-Up Table (LUT) for orthographic sphere mapping
        const R = size / 2
        const lut = []
        for (let y = 0; y < size; y++) {
          const dy = y - R
          for (let x = 0; x < size; x++) {
            const dx = x - R
            const d2 = dx * dx + dy * dy
            if (d2 <= R * R) {
              const dz = Math.sqrt(R * R - d2)
              const latitude = Math.asin(dy / R)
              const longitude = Math.atan2(dx, dz)
              lut.push({
                destIdx: (y * size + x) * 4,
                lat: latitude,
                lon: longitude,
              })
            }
          }
        }
        lutRef.current = lut
        setTextureLoaded(true)
      } catch (e) {
        console.error('Failed to read image data for 3D Globe:', e)
      }
    }

    img.onerror = (err) => {
      console.error('Failed to load image for 3D Globe:', imageUrl, err)
    }

    img.src = imageUrl
  }, [imageUrl, size])

  useEffect(() => {
    if (!textureLoaded) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let angle = 0

    const { width: texWidth, height: texHeight } = textureSizeRef.current
    const texData = textureDataRef.current
    const lut = lutRef.current

    // Tilt angle of the axis (23.5 degrees for Earth, converted to radians)
    const tilt = 23.5 * Math.PI / 180
    const cosTilt = Math.cos(tilt)
    const sinTilt = Math.sin(tilt)

    const renderFrame = () => {
      const imgData = ctx.createImageData(size, size)
      const data = imgData.data

      // Loop through the cached sphere coordinates
      for (let i = 0; i < lut.length; i++) {
        const { destIdx, lat, lon } = lut[i]

        // Rotate around Y-axis (longitude rotation)
        let phi = lon + angle
        phi = ((phi + Math.PI) % (2 * Math.PI)) - Math.PI
        if (phi < -Math.PI) phi += 2 * Math.PI

        // Apply axial tilt to the sphere coordinates
        const x3d = Math.cos(lat) * Math.sin(phi)
        const y3d = Math.sin(lat)
        const z3d = Math.cos(lat) * Math.cos(phi)

        // Rotate coordinates on the Z-axis to tilt the axis
        const tiltedY = y3d * cosTilt - x3d * sinTilt
        const tiltedX = x3d * cosTilt + y3d * sinTilt
        const tiltedZ = z3d

        // Recalculate tilted spherical coordinates
        const tiltedLat = Math.asin(tiltedY)
        const tiltedPhi = Math.atan2(tiltedX, tiltedZ)

        // Map back to texture coordinates (u, v)
        const u = Math.floor(((tiltedPhi + Math.PI) / (2 * Math.PI)) * texWidth)
        const v = Math.floor(((tiltedLat + Math.PI / 2) / Math.PI) * texHeight)

        // Clamp values
        const clampedU = Math.max(0, Math.min(texWidth - 1, u))
        const clampedV = Math.max(0, Math.min(texHeight - 1, v))

        const texIdx = (clampedV * texWidth + clampedU) * 4
        
        data[destIdx] = texData[texIdx]
        data[destIdx + 1] = texData[texIdx + 1]
        data[destIdx + 2] = texData[texIdx + 2]
        data[destIdx + 3] = 255
      }

      ctx.putImageData(imgData, 0, 0)
      angle += speed
      animationId = requestAnimationFrame(renderFrame)
    }

    renderFrame()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [textureLoaded, size, speed])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-primary-container/20 blur-xl animate-pulse" />
      
      {/* Spherical shadow overlay */}
      <div 
        className="absolute inset-0 rounded-full z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.85) 80%, rgba(0, 0, 0, 0.98) 100%)',
          boxShadow: 'inset -20px -20px 50px rgba(0, 0, 0, 0.95), inset 20px 20px 40px rgba(255, 255, 255, 0.2), 0 0 25px rgba(0, 229, 255, 0.35)',
          border: '1px solid rgba(0, 229, 255, 0.2)'
        }}
      />
      
      {/* Canvas */}
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        className="rounded-full z-10 relative bg-black/40"
      />
    </div>
  )
}
