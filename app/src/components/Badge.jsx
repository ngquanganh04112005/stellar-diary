export default function Badge({ icon, title, subtitle, unlocked = false, color = 'primary-container' }) {
  if (unlocked) {
    return (
      <div className="glass-badge-unlocked rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 aspect-square relative overflow-hidden">
        <div className={`absolute inset-0 bg-${color}/5 rounded-xl`} />
        <div
          className="w-14 h-14 rounded-full bg-surface-variant flex items-center justify-center border relative z-10"
          style={{
            borderColor: `var(--color-${color}, rgba(0,229,255,0.5))`,
            boxShadow: `0 0 15px var(--color-${color}, rgba(0,229,255,0.4))`,
          }}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{
              color: `var(--color-${color})`,
              filter: `drop-shadow(0 0 8px var(--color-${color}))`,
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {icon}
          </span>
        </div>
        <div className="relative z-10">
          <h3 className="text-label-caps text-xs mb-1" style={{ color: `var(--color-${color})` }}>
            {title}
          </h3>
          <p className="text-[10px] text-on-surface-variant">{subtitle}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-badge-locked rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 aspect-square relative">
      <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant">
        <span className="material-symbols-outlined text-2xl text-outline">{icon}</span>
      </div>
      <div>
        <h3 className="text-label-caps text-xs text-outline mb-1">{title}</h3>
        <p className="text-[10px] text-outline-variant">{subtitle}</p>
      </div>
      <span className="material-symbols-outlined text-sm text-outline absolute top-3 right-3">lock</span>
    </div>
  )
}
