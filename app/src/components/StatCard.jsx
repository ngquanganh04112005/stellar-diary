export default function StatCard({ icon, label, value, glowColor = 'rgba(0, 229, 255, 0.5)' }) {
  return (
    <div className="glass-card p-4 flex flex-col items-center justify-center gap-2">
      <span
        className="material-symbols-outlined text-2xl"
        style={{ color: glowColor, fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <p className="text-label-caps text-on-surface-variant">{label}</p>
      <p className="text-stats-number text-on-surface">{value}</p>
    </div>
  )
}
