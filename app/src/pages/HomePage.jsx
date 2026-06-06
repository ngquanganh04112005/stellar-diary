import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import GlassCard from '../components/GlassCard'
import Globe3D from '../components/Globe3D'
import { useStats, useObjectives } from '../hooks/useStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { profile, journeyProgress, currentMilestone, totalXp, milestones } = useStats()
  const { objectives, completeObjective, completedCount, totalCount } = useObjectives()
  const [selectedObjectives, setSelectedObjectives] = useState([])

  const currentMilestoneIndex = milestones ? milestones.findIndex((m) => profile?.totalEntries < m.entries) : -1
  const currentLocation = currentMilestoneIndex > 0 
    ? milestones[currentMilestoneIndex - 1].name 
    : currentMilestoneIndex === 0 
      ? 'Trái Đất' 
      : 'Tâm Ngân Hà'

  const planetImageUrls = {
    'Trái Đất': '/image_planet/earth.png',
    'Sao Thủy': '/image_planet/mercury.png',
    'Sao Kim': '/image_planet/venus.png',
    'Mặt Trăng': '/image_planet/moon.png',
    'Sao Hỏa': '/image_planet/mars.png',
    'Sao Mộc': '/image_planet/jupiter.png',
    'Sao Thổ': '/image_planet/saturn.png',
    'Thiên Vương Tinh': '/image_planet/uranus.png',
    'Hải Vương Tinh': '/image_planet/neptune.png',
    'Vành Đai Tiểu Hành Tinh': '/image_planet/asteroids.png',
    'Tinh Vân': '/image_planet/nebula.png',
    'Chòm Sao': '/image_planet/constellation.png',
    'Cụm Sao': '/image_planet/cluster.png',
    'Thiên Hà': '/image_planet/galaxy.png',
    'Ngân Hà': '/image_planet/milkyway.png',
    'Tâm Ngân Hà': '/image_planet/core.png',
  }

  const [globeImage, setGlobeImage] = useState('/image_planet/earth.png')
  
  useEffect(() => {
    if (!profile) return
    const targetImage = planetImageUrls[currentLocation] || '/image_planet/earth.png'
    const img = new Image()
    img.src = targetImage
    img.onload = () => setGlobeImage(targetImage)
    img.onerror = () => setGlobeImage('/image_planet/earth.png')
  }, [currentLocation, profile])

  const toggleObjective = (id) => {
    setSelectedObjectives((prev) =>
      prev.includes(id) ? prev.filter((oId) => oId !== id) : [...prev, id]
    )
  }

  const handleConfirmObjectives = async () => {
    for (const id of selectedObjectives) {
      await completeObjective(id)
    }
    setSelectedObjectives([])
  }

  if (!profile) return null

  return (
    <div className="flex flex-col gap-10">
      {/* Earth Header */}
      <section className="flex flex-col items-center justify-center pt-4 pb-2 relative">
        <div className="relative w-64 h-64 mb-6 flex items-center justify-center">
          <Globe3D imageUrl={globeImage} size={240} speed={0.003} />
        </div>
        <h2 className="text-display-lg-mobile text-on-surface text-center glow-text">
          {currentLocation === 'Trái Đất' ? 'KHỞI HÀNH TỪ TRÁI ĐẤT' : `TRẠM DỪNG: ${currentLocation.toUpperCase()}`}
        </h2>
        <p className="text-body-md text-on-surface-variant text-center mt-2">
          Ngày {profile.totalEntries} trên 365 • Cấp {profile.level}
        </p>
      </section>

      {/* Mission Status Cards */}
      <section className="grid grid-cols-3 gap-4">
        <StatCard
          icon="local_fire_department"
          label="Chuỗi ngày"
          value={`${profile.currentStreak} Ngày`}
          glowColor="#00e5ff"
        />
        <StatCard
          icon="task_alt"
          label="Mục tiêu"
          value={`${completedCount}/${totalCount}`}
          glowColor="#ebb2ff"
        />
        <StatCard
          icon="star"
          label="Tổng XP"
          value={totalXp.toLocaleString()}
          glowColor="#00e5ff"
        />
      </section>

      {/* Journey Progress */}
      <GlassCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-headline-md text-on-surface">Tiến trình hành trình</h3>
          <span className="text-label-caps text-primary px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-[10px]">
            {currentMilestone.name.toUpperCase()}
          </span>
        </div>
        <div className="relative pt-8 pb-4">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 overflow-hidden">
            <div
              className="h-full bg-primary-container shadow-[0_0_10px_rgba(0,229,255,0.8)] transition-all duration-1000"
              style={{ width: `${journeyProgress}%` }}
            />
          </div>
          <div className="flex justify-between relative z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary-container shadow-[0_0_15px_rgba(0,229,255,1)]" />
              <span className="text-label-caps text-on-surface-variant text-[10px]">TRÁI ĐẤT</span>
            </div>
            <div className="flex flex-col items-center gap-2 absolute -translate-x-1/2 transition-all duration-1000" style={{ left: `${journeyProgress}%` }}>
              <span
                className="material-symbols-outlined text-primary-container -mt-6 animate-bounce text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                rocket
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-outline-variant bg-surface-dim" />
              <span className="text-label-caps text-on-surface-variant text-[10px]">{currentMilestone.name.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Daily Objectives */}
      <section className="flex flex-col gap-4">
        <h3 className="text-headline-md text-on-surface">Nhiệm vụ hàng ngày</h3>

        {objectives?.map((obj) => {
          const isSelected = selectedObjectives.includes(obj.id)
          return (
            <GlassCard
              key={obj.id}
              className={`!p-4 flex items-center justify-between cursor-pointer group transition-all duration-300 ${
                obj.completed 
                  ? 'opacity-60' 
                  : isSelected 
                    ? 'border-primary-container bg-primary-container/10' 
                    : 'hover:bg-white/5'
              }`}
              onClick={() => !obj.completed && toggleObjective(obj.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                  obj.completed || isSelected
                    ? 'border-primary-container bg-primary-container/20'
                    : 'border-primary group-hover:bg-primary/20'
                }`}>
                  <span className={`material-symbols-outlined text-primary text-[16px] transition-opacity ${
                    obj.completed || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} style={obj.completed || isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    check
                  </span>
                </div>
                <div>
                  <p className={`text-body-lg text-on-surface ${obj.completed ? 'line-through' : ''}`}>{obj.title}</p>
                  <p className="text-body-md text-on-surface-variant text-sm">{obj.subtitle}</p>
                </div>
              </div>
              <span className="text-label-caps text-outline-variant text-[10px]">+{obj.xp} XP</span>
            </GlassCard>
          )
        })}

        {selectedObjectives.length > 0 && (
          <button
            onClick={handleConfirmObjectives}
            className="w-full py-4 mt-2 mb-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-container text-white font-bold text-label-caps shadow-[0_0_15px_rgba(235,178,255,0.4)] hover:shadow-[0_0_25px_rgba(235,178,255,0.6)] transition-shadow active:scale-[0.98]"
          >
            XÁC NHẬN HOÀN THÀNH ({selectedObjectives.length})
          </button>
        )}

        {profile.lastEntryDate !== new Date().toISOString().split('T')[0] && (
          <button
            onClick={() => navigate('/new-entry')}
            className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#00daf3] to-[#00e5ff] text-on-primary font-bold text-label-caps shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-shadow active:scale-[0.98]"
          >
            GHI NHẬT KÝ MỚI
          </button>
        )}
      </section>
    </div>
  )
}
