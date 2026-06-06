import { useNavigate } from 'react-router-dom'
import Globe3D from '../components/Globe3D'
import GlassCard from '../components/GlassCard'
import { useStats } from '../hooks/useStore'

const PLANET_IMAGE_FILES = {
  'Trái Đất': 'earth.png',
  'Sao Thủy': 'mercury.png',
  'Sao Kim': 'venus.png',
  'Mặt Trăng': 'moon.png',
  'Sao Hỏa': 'mars.png',
  'Sao Mộc': 'jupiter.png',
  'Sao Thổ': 'saturn.png',
  'Thiên Vương Tinh': 'uranus.png',
  'Hải Vương Tinh': 'neptune.png',
  'Vành Đai Tiểu Hành Tinh': 'asteroid.png',
  'Tinh Vân': 'stellar nursery.png',
  'Chòm Sao': 'constellation World.png',
  'Cụm Sao': 'star Cluster.png',
  'Thiên Hà': 'spiral galaxy.png',
  'Ngân Hà': 'milky way.png',
  'Tâm Ngân Hà': 'galactic core.png',
}

function getPlanetImageUrl(planetName) {
  const fileName = PLANET_IMAGE_FILES[planetName] || 'earth.png'
  return `/image_planet/${encodeURIComponent(fileName)}`
}

export default function ExplorePlanetsPage() {
  const navigate = useNavigate()
  const { profile, totalEntries, milestones } = useStats()

  if (!profile || !milestones) return null

  const planets = [{ name: 'Trái Đất', entries: 0 }, ...milestones]

  return (
    <div className="flex flex-col gap-6 min-h-[calc(100dvh-150px)]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors"
          aria-label="Quay lại hồ sơ"
        >
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </button>
        <div className="text-center">
          <p className="text-label-caps text-primary-container text-[10px]">BẢN ĐỒ THIÊN THỂ</p>
          <h2 className="text-headline-md text-on-surface">Khám phá các hành tinh</h2>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth gap-4 -mx-6 px-6 pb-4">
        {planets.map((planet, index) => {
          const planetName = planet.name.trim()
          const unlocked = totalEntries >= planet.entries
          const remaining = Math.max(0, planet.entries - totalEntries)
          const imageUrl = getPlanetImageUrl(planetName)

          return (
            <section
              key={planet.name}
              className="snap-center shrink-0 w-full min-h-[620px] flex items-stretch"
            >
              <GlassCard className="w-full flex flex-col items-center justify-between text-center gap-6 py-8">
                <div
                  className="absolute inset-0 opacity-15 bg-cover bg-center blur-sm scale-110"
                  style={{ backgroundImage: `url("${imageUrl}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-surface/30 via-surface/70 to-surface" />

                <div className="w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary-container/30 bg-primary-container/10 text-primary-container text-[10px] font-mono font-bold">
                    <span className="material-symbols-outlined text-sm">
                      {unlocked ? 'travel_explore' : 'lock'}
                    </span>
                    CHẶNG {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-display-lg-mobile text-on-surface mt-4 glow-text">
                    {planetName}
                  </h3>
                  <p className="text-body-md text-on-surface-variant mt-2">
                    {planet.entries === 0
                      ? 'Trạm xuất phát của hành trình.'
                      : `Mở khóa khi đạt ${planet.entries} bài nhật ký.`}
                  </p>
                </div>

                <div className="relative w-72 h-72 flex items-center justify-center z-10">
                  <div className={`transition-all duration-500 ${unlocked ? 'opacity-100' : 'opacity-40 brightness-50 grayscale'}`}>
                    <Globe3D imageUrl={imageUrl} size={260} speed={0.0025} />
                  </div>
                  {!unlocked && (
                    <div className="absolute right-8 top-8 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-surface/70 border border-outline-variant flex items-center justify-center backdrop-blur-md shadow-[0_0_16px_rgba(0,0,0,0.45)]">
                        <span className="material-symbols-outlined text-on-surface-variant text-2xl">
                          lock
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full relative z-10">
                  <div className="mb-5 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
                    <img
                      src={imageUrl}
                      alt={`Ảnh bề mặt ${planetName}`}
                      className="h-24 w-full object-cover opacity-95"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = '/image_planet/earth.png'
                      }}
                    />
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-label-caps text-[10px] ${
                      unlocked
                        ? 'border-primary-container/40 bg-primary-container/10 text-primary-container'
                        : 'border-outline-variant bg-surface-container-low text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {unlocked ? 'check_circle' : 'lock'}
                    </span>
                    {unlocked ? 'ĐÃ KHÁM PHÁ' : `KHÓA • CẦN THÊM ${remaining} BÀI VIẾT`}
                  </div>

                  <div className="mt-6 flex justify-center gap-2">
                    {planets.map((dot) => (
                      <span
                        key={dot.name}
                        className={`h-1.5 rounded-full ${
                          dot.name === planet.name
                            ? 'w-6 bg-primary-container shadow-[0_0_8px_rgba(0,229,255,0.8)]'
                            : 'w-1.5 bg-outline-variant'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </GlassCard>
            </section>
          )
        })}
      </div>
    </div>
  )
}
