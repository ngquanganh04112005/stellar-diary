import Badge from '../components/Badge'
import OrbitalProgress from '../components/OrbitalProgress'
import { useAchievements, useStats } from '../hooks/useStore'

export default function StatsPage() {
  const { achievements } = useAchievements()
  const { profile, totalEntries, planetsVisited } = useStats()

  if (!profile || !achievements) return null

  const totalCompleted = achievements.filter((a) => a.unlocked).length

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <section className="text-center">
        <h2 className="text-display-lg-mobile text-on-surface mb-2 glow-text">
          Huy chương thành tựu
        </h2>
        <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
          Hành trình của bạn được ghi lại bằng ánh sáng. Mỗi huy chương là một giai đoạn đã hoàn thành trong sứ mệnh khám phá vũ trụ.
        </p>
      </section>

      {/* Badge Grid */}
      <section className="grid grid-cols-2 gap-4">
        {achievements.map((ach) => (
          <Badge
            key={ach.id}
            icon={ach.icon}
            title={ach.title}
            subtitle={ach.unlocked
              ? `Đã mở khóa • ${new Date(ach.unlockedAt).toLocaleDateString('vi-VN')}`
              : ach.subtitle
            }
            unlocked={ach.unlocked}
            color={ach.color || 'primary-container'}
          />
        ))}
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4">
        <div className="glass-panel rounded-xl p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-label-caps text-on-surface-variant text-[10px] mb-2">
              TỔNG HÀNH TINH ĐÃ GHÉ THĂM
            </span>
            <span className="text-display-lg-mobile text-primary-container glow-text">
              {String(planetsVisited).padStart(2, '0')}
            </span>
          </div>
          <OrbitalProgress percentage={(planetsVisited / 16) * 100} size={96} color="#00e5ff">
            <span className="material-symbols-outlined text-primary-container">language</span>
          </OrbitalProgress>
        </div>

        <div className="glass-panel rounded-xl p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-label-caps text-on-surface-variant text-[10px] mb-2">
              TỔNG BÀI NHẬT KÝ
            </span>
            <span className="text-display-lg-mobile text-secondary glow-text">
              {String(totalEntries).padStart(2, '0')}
            </span>
          </div>
          <OrbitalProgress percentage={Math.min(100, (totalEntries / 365) * 100)} size={96} color="#ebb2ff">
            <span className="material-symbols-outlined text-secondary">description</span>
          </OrbitalProgress>
        </div>

        <div className="glass-panel rounded-xl p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-label-caps text-on-surface-variant text-[10px] mb-2">
              THÀNH TỰU ĐÃ MỞ KHÓA
            </span>
            <span className="text-display-lg-mobile text-primary glow-text">
              {totalCompleted}/{achievements.length}
            </span>
          </div>
          <OrbitalProgress percentage={(totalCompleted / achievements.length) * 100} size={96} color="#c3f5ff">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
          </OrbitalProgress>
        </div>
      </section>
    </div>
  )
}
