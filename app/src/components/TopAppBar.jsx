export default function TopAppBar() {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-primary-container/30 bg-surface-container-high shadow-[0_0_18px_rgba(0,229,255,0.25)]">
          <img
            src="/image_planet/logo.png"
            alt="Stellar Diary"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <h1 className="text-label-caps tracking-widest text-primary-fixed-dim">
        TRUNG TÂM ĐIỀU KHIỂN
      </h1>
      <button className="text-primary-fixed-dim hover:opacity-80 transition-opacity active:scale-95 duration-200">
        <span className="material-symbols-outlined">notifications</span>
      </button>
    </header>
  )
}
