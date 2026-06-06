export default function GlassCard({ children, className = '', glow = false, onClick }) {
  return (
    <div
      className={`glass-card p-6 relative overflow-hidden transition-all duration-300 ${glow ? 'neon-glow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
