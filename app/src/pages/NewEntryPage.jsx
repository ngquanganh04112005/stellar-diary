import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEntries } from '../hooks/useStore'

const MOODS = [
  { id: 'stardust', label: 'BỤI SAO', icon: 'auto_awesome', color: '#ebb2ff' },
  { id: 'nebula', label: 'TINH VÂN', icon: 'blur_on', color: '#c3f5ff' },
  { id: 'supernova', label: 'SIÊU TÂN TINH', icon: 'flare', color: '#00e5ff' },
  { id: 'void', label: 'HƯ KHÔNG', icon: 'dark_mode', color: '#849396' },
  { id: 'comet', label: 'SAO CHỔI', icon: 'rocket_launch', color: '#9cf0ff' },
]

const CATEGORIES = [
  { id: 'general', label: 'Tổng hợp', icon: 'edit_note' },
  { id: 'language', label: 'Ngôn ngữ', icon: 'language' },
  { id: 'fitness', label: 'Thể lực', icon: 'fitness_center' },
  { id: 'reading', label: 'Đọc sách', icon: 'menu_book' },
  { id: 'reflection', label: 'Suy ngẫm', icon: 'self_improvement' },
]

export default function NewEntryPage() {
  const navigate = useNavigate()
  const { addEntry, hasEntryToday } = useEntries()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('stardust')
  const [category, setCategory] = useState('general')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!hasEntryToday) return
    const timer = setTimeout(() => navigate('/'), 1600)
    return () => clearTimeout(timer)
  }, [hasEntryToday, navigate])

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || hasEntryToday) return
    setSaving(true)
    setError('')
    try {
      await addEntry({ title, content, mood, category })
      navigate('/')
    } catch (err) {
      if (err.message === 'ENTRY_ALREADY_EXISTS_TODAY') {
        setError('Bạn đã viết nhật ký hôm nay. Hãy quay lại vào ngày mai.')
      } else {
        setError('Không thể lưu nhật ký. Vui lòng thử lại.')
      }
      console.error('Lỗi khi lưu:', err)
    } finally {
      setSaving(false)
    }
  }

  if (hasEntryToday) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <h2 className="text-headline-md text-on-surface">Nhật ký hôm nay</h2>
          <div className="w-10" />
        </div>

        <div className="glass-card p-6 text-center">
          <span className="material-symbols-outlined text-primary-container text-4xl mb-3">
            task_alt
          </span>
          <h3 className="text-headline-md text-on-surface mb-2">Bạn đã viết nhật ký hôm nay</h3>
          <p className="text-body-md text-on-surface-variant">
            Mỗi ngày chỉ viết được 1 lần. Hãy quay lại vào ngày mai.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </button>
        <h2 className="text-headline-md text-on-surface">Nhật ký mới</h2>
        <div className="w-10" />
      </div>

      {/* Mood Selection */}
      <div>
        <label className="text-label-caps text-on-surface-variant text-[10px] block mb-3">
          TÂM TRẠNG HÔM NAY
        </label>
        <div className="flex gap-2 flex-wrap">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all text-[11px] font-mono font-bold ${
                mood === m.id
                  ? 'border-primary-container bg-primary-container/15 text-primary-container shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'border-outline-variant bg-surface-container text-on-surface-variant hover:border-outline'
              }`}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={mood === m.id ? { color: m.color, fontVariationSettings: "'FILL' 1" } : {}}
              >
                {m.icon}
              </span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="text-label-caps text-on-surface-variant text-[10px] block mb-3">
          DANH MỤC
        </label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm ${
                category === c.id
                  ? 'border-secondary bg-secondary/10 text-secondary'
                  : 'border-outline-variant bg-surface-container text-on-surface-variant hover:border-outline'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title Input */}
      <div>
        <label className="text-label-caps text-on-surface-variant text-[10px] block mb-2">
          TIÊU ĐỀ
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tên cho bài nhật ký hôm nay..."
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all"
        />
      </div>

      {/* Content Textarea */}
      <div>
        <label className="text-label-caps text-on-surface-variant text-[10px] block mb-2">
          NỘI DUNG
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ghi lại hành trình của bạn hôm nay..."
          rows={8}
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all resize-none"
        />
      </div>

      {/* Save Button */}
      {error && (
        <p className="text-error text-sm text-center bg-error-container/20 border border-error/30 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={!title.trim() || !content.trim() || saving || hasEntryToday}
        className={`w-full py-4 rounded-xl font-bold text-label-caps transition-all active:scale-[0.98] ${
          title.trim() && content.trim() && !saving && !hasEntryToday
            ? 'bg-gradient-to-r from-[#00daf3] to-[#00e5ff] text-on-primary shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)]'
            : 'bg-surface-variant text-outline cursor-not-allowed'
        }`}
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ĐANG LƯU...
          </span>
        ) : (
          'GHI VÀO NHẬT KÝ  +25 XP'
        )}
      </button>
    </div>
  )
}
