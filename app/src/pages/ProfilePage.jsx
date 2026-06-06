import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import OrbitalProgress from '../components/OrbitalProgress'
import { useStats } from '../hooks/useStore'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { profile, xpProgress, xpToNextLevel, totalEntries, planetsVisited, totalXp } = useStats()

  if (!profile) return null

  return (
    <div className="flex flex-col gap-8">
      {/* Avatar & Info */}
      <section className="flex flex-col items-center pt-4">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full bg-surface-container-high border-2 border-primary-container/40 flex items-center justify-center overflow-hidden animate-pulse-glow">
            <span
              className="material-symbols-outlined text-5xl text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              person
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.5)]">
            <span className="text-on-primary text-xs font-bold font-mono">{profile.level}</span>
          </div>
        </div>
        <h2 className="text-headline-md text-on-surface mb-1">{profile.name}</h2>
        <p className="text-label-caps text-primary-container text-[10px]">
          CẤP ĐỘ {profile.level} • {profile.level >= 10 ? 'BẬC THẦY' : profile.level >= 5 ? 'NGƯỜI KHÁM PHÁ' : 'TÂN BINH'}
        </p>
      </section>

      {/* XP Progress */}
      <GlassCard className="flex flex-col items-center gap-4">
        <OrbitalProgress percentage={xpProgress} size={140} color="#00e5ff">
          <span className="text-stats-number text-primary-container text-xl">{profile.xp}</span>
          <span className="text-label-caps text-on-surface-variant text-[9px] mt-1">XP HIỆN TẠI</span>
        </OrbitalProgress>
        <div className="w-full">
          <div className="flex justify-between text-xs text-on-surface-variant mb-1">
            <span>Cấp {profile.level}</span>
            <span>Cấp {profile.level + 1}</span>
          </div>
          <div className="w-full bg-surface-variant rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-primary-container to-primary h-1.5 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.5)] transition-all duration-1000"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="text-center text-xs text-on-surface-variant mt-2">
            Còn <span className="text-primary-container font-bold">{xpToNextLevel} XP</span> để lên cấp • Tổng: <span className="text-primary font-bold">{totalXp} XP</span>
          </p>
        </div>
      </GlassCard>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 flex flex-col items-center gap-1">
          <span className="text-stats-number text-primary-container">{profile.currentStreak}</span>
          <span className="text-[9px] text-on-surface-variant font-mono font-bold">CHUỖI NGÀY</span>
        </div>
        <div className="glass-card p-3 flex flex-col items-center gap-1">
          <span className="text-stats-number text-secondary">{totalEntries}</span>
          <span className="text-[9px] text-on-surface-variant font-mono font-bold">NHẬT KÝ</span>
        </div>
        <div className="glass-card p-3 flex flex-col items-center gap-1">
          <span className="text-stats-number text-primary">{planetsVisited}</span>
          <span className="text-[9px] text-on-surface-variant font-mono font-bold">HÀNH TINH</span>
        </div>
      </div>

      {/* Settings Menu */}
      <section className="flex flex-col gap-2">
        <h3 className="text-label-caps text-on-surface-variant text-[10px] mb-2 px-1">CÀI ĐẶT</h3>

        {[
          { icon: 'edit', label: 'Chỉnh sửa hồ sơ' },
          { icon: 'notifications', label: 'Thông báo' },
          { icon: 'palette', label: 'Giao diện' },
          { icon: 'travel_explore', label: 'Khám phá các hành tinh', path: '/explore-planets' },
          { icon: 'info', label: 'Về ứng dụng' },
        ].map((item) => (
          <div
            key={item.icon}
            onClick={() => item.path && navigate(item.path)}
            className="glass-card !p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors !rounded-xl"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-xl">{item.icon}</span>
            <span className="text-body-md text-on-surface">{item.label}</span>
            <span className="material-symbols-outlined text-outline-variant text-lg ml-auto">chevron_right</span>
          </div>
        ))}

        {/* Nút Đăng xuất */}
        <div
          onClick={() => {
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('currentUserId')
            window.location.reload()
          }}
          className="glass-card !p-4 flex items-center gap-4 cursor-pointer hover:bg-error/10 border-error/20 transition-colors !rounded-xl mt-4"
        >
          <span className="material-symbols-outlined text-error text-xl">logout</span>
          <span className="text-body-md text-error font-medium">Đăng xuất hành trình</span>
          <span className="material-symbols-outlined text-error/40 text-lg ml-auto">chevron_right</span>
        </div>
      </section>
    </div>
  )
}
