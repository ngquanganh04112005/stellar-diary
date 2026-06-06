import GlassCard from '../components/GlassCard'
import OrbitalProgress from '../components/OrbitalProgress'
import { useEntries, useObjectives, useStats } from '../hooks/useStore'

const MOOD_LABELS = {
  stardust: 'BỤI SAO',
  nebula: 'TINH VÂN',
  supernova: 'SIÊU TÂN TINH',
  void: 'HƯ KHÔNG',
  comet: 'SAO CHỔI',
}

const CATEGORY_ICONS = {
  general: 'edit_note',
  language: 'language',
  fitness: 'fitness_center',
  reading: 'menu_book',
  reflection: 'self_improvement',
}

export default function JournalPage() {
  const { entries } = useEntries()
  const { completedCount, totalCount } = useObjectives()
  const { profile } = useStats()

  if (!profile) return null

  const latestEntry = entries?.[0]
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <section>
        <div className="inline-block px-3 py-1 rounded-full bg-surface-variant border border-outline-variant text-label-caps text-primary-container mb-3 text-[10px]">
          NHẬT KÝ: NGÀY SAO {profile.totalEntries}
        </div>
        <h1 className="text-display-lg-mobile text-on-surface mb-2">Nhật ký gần nhất</h1>
        <p className="text-on-surface-variant text-body-lg">
          Cấp {profile.level} • Chuỗi {profile.currentStreak} ngày
        </p>
      </section>

      {/* Latest Entry */}
      {latestEntry ? (
        <GlassCard className="group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-full blur-[40px] group-hover:bg-primary-container/20 transition-all duration-700" />
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant">
                <span className="material-symbols-outlined text-secondary">
                  {CATEGORY_ICONS[latestEntry.category] || 'edit_note'}
                </span>
              </div>
              <div>
                <h2 className="text-headline-md text-on-surface text-lg">{latestEntry.title}</h2>
                <p className="text-[11px] text-on-surface-variant">
                  {new Date(latestEntry.createdAt).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Mood chip */}
          <div className="mb-3 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-[10px] font-mono font-bold">
              {MOOD_LABELS[latestEntry.mood] || latestEntry.mood}
            </span>
          </div>

          {/* Content */}
          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/50 relative z-10">
            <p className="text-body-md text-on-surface/80 italic leading-relaxed">
              "{latestEntry.content}"
            </p>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="text-center py-10">
          <span className="material-symbols-outlined text-4xl text-outline mb-3">edit_note</span>
          <p className="text-on-surface-variant">Chưa có bài nhật ký nào</p>
        </GlassCard>
      )}

      {/* All Entries List */}
      {entries && entries.length > 1 && (
        <section>
          <h3 className="text-label-caps text-on-surface-variant text-[10px] mb-3">
            CÁC BÀI TRƯỚC ({entries.length - 1})
          </h3>
          <div className="space-y-2">
            {entries.slice(1, 6).map((entry) => (
              <div
                key={entry.id}
                className="glass-card !p-4 !rounded-xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">
                    {CATEGORY_ICONS[entry.category] || 'edit_note'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface truncate">{entry.title}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    {new Date(entry.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-secondary px-2 py-1 rounded-full bg-secondary/10 shrink-0">
                  {MOOD_LABELS[entry.mood] || ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mission Progress & Quote */}
      <div className="grid grid-cols-1 gap-4">
        <GlassCard className="flex flex-col items-center gap-5">
          <h3 className="text-label-caps text-on-surface-variant tracking-widest text-center w-full text-[10px]">
            TIẾN TRÌNH NHIỆM VỤ
          </h3>
          <OrbitalProgress
            percentage={completionPercent}
            size={160}
            color="#00e5ff"
          >
            <span className="text-display-lg-mobile text-primary-container leading-none text-3xl">
              {completionPercent}<span className="text-lg text-on-surface-variant">%</span>
            </span>
            <span className="text-label-caps text-on-surface text-[10px] mt-1">
              {completedCount}/{totalCount} XONG
            </span>
          </OrbitalProgress>
        </GlassCard>

        {/* Quote Card */}
        <GlassCard className="text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-primary-container/50 text-3xl">auto_awesome</span>
            <blockquote className="text-[20px] leading-[28px] text-on-surface font-light tracking-wide" style={{ fontFamily: 'Sora' }}>
              "Đến những vì sao qua gian khó."
            </blockquote>
            <div className="w-12 h-px bg-primary-container/30" />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
