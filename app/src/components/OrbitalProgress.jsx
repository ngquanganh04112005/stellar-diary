export default function OrbitalProgress({
  percentage = 0,
  size = 120,
  strokeWidth = 4,
  color = '#00e5ff',
  secondaryRing = null,
  children,
}) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const secondaryRadius = 38
  const secondaryCircumference = 2 * Math.PI * secondaryRadius
  const secondaryOffset = secondaryRing
    ? secondaryCircumference - (secondaryRing.percentage / 100) * secondaryCircumference
    : 0

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background ring */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth - 1}
        />
        {/* Primary progress ring */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="orbital-ring transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        {/* Optional secondary ring */}
        {secondaryRing && (
          <>
            <circle
              cx="50" cy="50" r={secondaryRadius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={strokeWidth - 1}
            />
            <circle
              cx="50" cy="50" r={secondaryRadius}
              fill="none"
              stroke={secondaryRing.color || '#ebb2ff'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={secondaryCircumference}
              strokeDashoffset={secondaryOffset}
              className="orbital-ring transition-all duration-1000 ease-out"
            />
          </>
        )}
      </svg>
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}
