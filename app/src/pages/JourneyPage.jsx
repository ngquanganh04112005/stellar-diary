import { useState, useEffect, useRef } from 'react'
import GlassCard from '../components/GlassCard'
import OrbitalProgress from '../components/OrbitalProgress'
import { useStats } from '../hooks/useStore'

const planetEmojis = {
  'Trái Đất': '🌍',
  'Sao Thủy': '☿',
  'Sao Kim': '♀',
  'Mặt Trăng': '🌕',
  'Sao Hỏa': '♂',
  'Sao Mộc': '♃',
  'Sao Thổ': '♄',
  'Thiên Vương Tinh': '♅',
  'Hải Vương Tinh': '♆',
  'Vành Đai Tiểu Hành Tinh': '☄️',
  'Tinh Vân': '🌌',
  'Chòm Sao': '⭐',
  'Cụm Sao': '🌠',
  'Thiên Hà': '🌌',
  'Ngân Hà': '✨',
  'Tâm Ngân Hà': '🌟',
}

export default function JourneyPage() {
  const { profile, journeyProgress, currentMilestone, totalEntries, planetsVisited, milestones } = useStats()
  const [activeTab, setActiveTab] = useState('map') // 'map' hoặc 'list'
  const scrollContainerRef = useRef(null)

  // Tạo danh sách tất cả các chặng bao gồm cả Trái Đất (0 bài) ở đầu
  const allStages = milestones ? [
    { name: 'Trái Đất', entries: 0 },
    ...milestones
  ] : []

  // Tìm chặng hiện tại đang hướng tới
  const targetIndex = allStages.findIndex(s => totalEntries < s.entries)

  // Tính toán tọa độ x, y cho các điểm mốc trên bản đồ SVG (ViewBox 360 x 1020)
  // Tổng cộng 16 điểm mốc, y sẽ chạy từ 980 (Trái Đất) lên 50 (Tâm Ngân Hà)
  const points = allStages.map((stage, i) => {
    // uốn lượn hình sin trái phải
    const x = 180 + Math.sin(i * 1.3) * 85
    const y = 970 - i * 61
    return { x, y, stage, index: i }
  })

  // Khởi dựng đường cong Cubic Bezier nối tất cả các điểm
  let pathD = ''
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1]
      const p1 = points[i]
      const cx1 = p0.x
      const cy1 = (p0.y + p1.y) / 2
      const cx2 = p1.x
      const cy2 = (p0.y + p1.y) / 2
      pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`
    }
  }

  // Khởi dựng đường cong phát sáng cho phần lộ trình ĐÃ hoàn thành
  let completedPathD = ''
  if (targetIndex !== 0 && points.length > 0) {
    const limit = targetIndex === -1 ? points.length : targetIndex + 1
    const completedPoints = points.slice(0, limit)
    completedPathD = `M ${completedPoints[0].x} ${completedPoints[0].y}`
    for (let i = 1; i < completedPoints.length; i++) {
      const p0 = completedPoints[i - 1]
      const p1 = completedPoints[i]
      const cx1 = p0.x
      const cy1 = (p0.y + p1.y) / 2
      const cx2 = p1.x
      const cy2 = (p0.y + p1.y) / 2
      completedPathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`
    }
  }

  // Tự động scroll đến điểm hành tinh hiện tại khi mở Bản đồ
  useEffect(() => {
    if (activeTab === 'map' && scrollContainerRef.current) {
      const activePoint = points.find(p => p.index === targetIndex)
      if (activePoint) {
        setTimeout(() => {
          const container = scrollContainerRef.current
          if (container) {
            const scrollTarget = activePoint.y - container.clientHeight / 2
            container.scrollTop = Math.max(0, scrollTarget)
          }
        }, 100)
      } else if (targetIndex === -1 && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
    }
  }, [activeTab, targetIndex])

  if (!profile || !milestones) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Hộp trạng thái hiện tại */}
      <GlassCard>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/30">
            <span className="text-label-caps text-primary-container text-[10px]">ĐIỂM ĐẾN TIẾP THEO</span>
          </div>
          <h2 className="text-display-lg-mobile text-primary">{currentMilestone.name}</h2>
          <p className="text-body-md text-on-surface-variant">
            {targetIndex === -1 ? (
              'Chúc mừng! Bạn đã hoàn thành toàn bộ hành trình vĩ đại và tiến tới Tâm Ngân Hà.'
            ) : (
              `Còn ${currentMilestone.entries - totalEntries} nhật ký nữa để đến đích. Hãy viết đều đặn để du hành vũ trụ.`
            )}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="glass-card !p-3 !rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
              <span className="text-[11px] text-on-surface-variant font-mono font-bold">
                {planetsVisited} THIÊN THỂ
              </span>
            </div>
            <div className="glass-card !p-3 !rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              <span className="text-[11px] text-on-surface-variant font-mono font-bold">{totalEntries} NHẬT KÝ</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <OrbitalProgress percentage={journeyProgress} size={150} color="#00e5ff">
            <span className="text-stats-number text-primary text-2xl">{journeyProgress}%</span>
            <span className="text-label-caps text-on-surface-variant text-[9px] mt-1">ĐÃ ĐI</span>
          </OrbitalProgress>
        </div>
      </GlassCard>

      {/* Pill Tabs Selector */}
      <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-2.5 rounded-lg text-label-caps text-xs font-bold transition-all ${
            activeTab === 'map'
              ? 'bg-primary-container/10 text-primary border border-primary-container/30'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Bản đồ sao
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2.5 rounded-lg text-label-caps text-xs font-bold transition-all ${
            activeTab === 'list'
              ? 'bg-primary-container/10 text-primary border border-primary-container/30'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Danh sách chặng
        </button>
      </div>

      {/* Nội dung Tab */}
      {activeTab === 'map' ? (
        <section className="relative h-[550px] w-full rounded-xl overflow-hidden glass-panel flex flex-col">
          <div className="p-3 bg-white/5 border-b border-white/10 flex justify-between items-center text-xs text-on-surface-variant font-mono">
            <span>🗺️ HÀNH TRÌNH VŨ TRỤ (SCROLL DỌC)</span>
            <span className="text-[10px] text-primary-container font-bold">5000 NĂM ÁNH SÁNG</span>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto pr-1 pb-16 scroll-smooth relative" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <svg className="w-full" viewBox="0 0 360 1020" height="1020" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="stars-page" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="0.8" fill="rgba(255,255,255,0.5)" />
                  <circle cx="45" cy="75" r="0.4" fill="rgba(255,255,255,0.3)" />
                  <circle cx="85" cy="35" r="1.0" fill="rgba(255,255,255,0.4)" />
                  <circle cx="65" cy="55" r="0.8" fill="rgba(0,229,255,0.3)" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#stars-page)" />

              {/* Đường lộ trình đứt nét toàn bộ */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />

              {/* Đường lộ trình nét liền phát sáng đã hoàn thành */}
              {completedPathD && (
                <path
                  d={completedPathD}
                  fill="none"
                  stroke="#00e5ff"
                  strokeWidth="3.5"
                  className="path-line"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.6))' }}
                />
              )}

              {/* Vẽ các hành tinh / điểm mốc */}
              {points.map((pt) => {
                const isCompleted = targetIndex === -1 || pt.index < targetIndex
                const isActive = targetIndex !== -1 && pt.index === targetIndex

                return (
                  <g key={pt.stage.name}>
                    {isCompleted ? (
                      <>
                        <circle cx={pt.x} cy={pt.y} r="8" fill="#00daf3" style={{ filter: 'drop-shadow(0 0 5px rgba(0, 229, 255, 0.8))' }} />
                        <circle cx={pt.x} cy={pt.y} r="14" fill="none" stroke="#00daf3" strokeWidth="1" opacity="0.3" />
                      </>
                    ) : isActive ? (
                      <>
                        <circle cx={pt.x} cy={pt.y} r="10" fill="#c3f5ff" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 1))' }}>
                          <animate attributeName="r" values="8;11;8" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={pt.x} cy={pt.y} r="20" fill="none" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8">
                          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
                        </circle>
                      </>
                    ) : (
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#1e2020" stroke="#3b494c" strokeWidth="1.5" />
                    )}

                    {/* Nhãn văn bản lệch trái/phải thông minh */}
                    <text
                      x={pt.x + (pt.x < 180 ? 16 : -16)}
                      y={pt.y + 3}
                      textAnchor={pt.x < 180 ? "start" : "end"}
                      fill={isActive ? "#00e5ff" : isCompleted ? "#bac9cc" : "#47464c"}
                      fontFamily="Space Mono"
                      fontWeight="700"
                      fontSize="9"
                    >
                      {planetEmojis[pt.stage.name] || '🪐'} {pt.stage.name.toUpperCase()} ({pt.stage.entries})
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </section>
      ) : (
        /* Tab danh sách chi tiết */
        <section className="flex flex-col gap-6">
          <h3 className="text-headline-md text-on-surface">Chi tiết các chặng</h3>
          
          <div className="relative pl-8 border-l border-outline-variant/30 ml-4 space-y-6 py-2">
            {allStages.map((stage, idx) => {
              const isCompleted = targetIndex === -1 || idx < targetIndex
              const isActive = targetIndex !== -1 && idx === targetIndex
              const isLocked = targetIndex !== -1 && idx > targetIndex

              return (
                <div key={stage.name} className="relative">
                  <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 z-10 ${
                    isCompleted 
                      ? 'border-primary-container bg-surface shadow-[0_0_12px_rgba(0,229,255,0.6)]' 
                      : isActive
                        ? 'border-primary bg-primary/20 scale-125 shadow-[0_0_20px_rgba(0,229,255,0.8)]'
                        : 'border-outline-variant bg-surface-dim'
                  }`}>
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[14px] text-primary-container font-bold">done</span>
                    ) : isActive ? (
                      <span className="material-symbols-outlined text-[12px] text-primary animate-bounce">rocket_launch</span>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                    )}
                  </div>

                  <div className={`glass-card p-4 transition-all duration-300 ${
                    isActive 
                      ? 'border-primary/40 bg-primary/5 shadow-[0_0_15px_rgba(0,229,255,0.1)]' 
                      : isLocked 
                        ? 'opacity-40' 
                        : ''
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`text-headline-sm font-bold flex items-center gap-2 ${
                          isCompleted ? 'text-primary-container' : isActive ? 'text-primary' : 'text-on-surface-variant'
                        }`}>
                          {stage.name}
                          {isCompleted && (
                            <span className="text-[9px] bg-primary-container/20 text-primary-container px-2 py-0.5 rounded-full font-mono">
                              ĐÃ ĐẠT
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono animate-pulse">
                              ĐANG BAY
                            </span>
                          )}
                        </h4>
                        <p className="text-body-sm text-on-surface-variant mt-1">
                          {stage.entries === 0 
                            ? 'Trạm xuất phát ban đầu' 
                            : `Yêu cầu đạt ${stage.entries} bài viết`
                          }
                        </p>
                      </div>
                      {stage.entries > 0 && (
                        <span className="text-[10px] font-mono text-outline">
                          {totalEntries} / {stage.entries}
                        </span>
                      )}
                    </div>
                    
                    {isActive && (
                      <div className="mt-3 w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full shadow-[0_0_8px_rgba(0,229,255,0.8)] transition-all duration-1000" 
                          style={{ width: `${journeyProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
