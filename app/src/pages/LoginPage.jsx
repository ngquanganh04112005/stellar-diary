import { useState } from 'react'
import Globe3D from '../components/Globe3D'
import GlassCard from '../components/GlassCard'
import db from '../db'
import { seedUser } from '../seed'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [passcode, setPasscode] = useState('')
  const [confirmPasscode, setConfirmPasscode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập!')
      return
    }
    if (!passcode) {
      setError('Vui lòng nhập mật khẩu!')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isRegister) {
        // ========== CHẾ ĐỘ ĐĂNG KÝ ==========
        if (passcode.length < 4) {
          setError('Mật khẩu phải có ít nhất 4 ký tự!')
          setLoading(false)
          return
        }
        if (passcode !== confirmPasscode) {
          setError('Mật khẩu xác nhận không khớp!')
          setLoading(false)
          return
        }

        // Kiểm tra tên đăng nhập đã tồn tại chưa
        const existingAccount = await db.accounts
          .where('username')
          .equalsIgnoreCase(username.trim())
          .first()

        if (existingAccount) {
          setError('Tên đăng nhập đã tồn tại! Hãy chọn tên khác.')
          setLoading(false)
          return
        }

        // Tạo tài khoản mới
        const newUserId = await db.accounts.add({
          username: username.trim(),
          password: passcode,
        })

        // Khởi tạo dữ liệu cho người dùng mới
        await seedUser(newUserId, username.trim())

        // Lưu phiên đăng nhập
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('currentUserId', String(newUserId))
        onLogin()
      } else {
        // ========== CHẾ ĐỘ ĐĂNG NHẬP ==========
        const account = await db.accounts
          .where('username')
          .equalsIgnoreCase(username.trim())
          .first()

        if (!account) {
          setError('Tài khoản không tồn tại! Hãy đăng ký trước.')
          setLoading(false)
          return
        }

        if (account.password !== passcode) {
          setError('Mật khẩu không đúng! Vui lòng thử lại.')
          setLoading(false)
          return
        }

        // Đăng nhập thành công
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('currentUserId', String(account.id))
        onLogin()
      }
    } catch (err) {
      console.error('Lỗi:', err)
      setError('Hệ thống gặp sự cố. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setError('')
    setSuccess('')
    setConfirmPasscode('')
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative px-6 py-12 overflow-hidden bg-void">
      {/* Background space effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-container/3 rounded-full blur-3xl pointer-events-none" />

      {/* Stars pattern overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="stars-login" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="0.8" fill="white" />
            <circle cx="45" cy="75" r="0.4" fill="white" />
            <circle cx="85" cy="35" r="1.0" fill="white" />
            <circle cx="65" cy="55" r="0.6" fill="#00e5ff" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#stars-login)" />
        </svg>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-6 relative z-10">
        {/* Title */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2 text-primary-container animate-float">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              rocket_launch
            </span>
          </div>
          <h1 className="text-display-lg-mobile text-on-surface tracking-widest uppercase font-bold glow-text mt-2">
            CELESTIAL
          </h1>
          <p className="text-label-caps text-primary-container text-[11px] tracking-[0.25em]">
            ODYSSEY JOURNAL
          </p>
        </header>

        {/* 3D Rotating Earth Globe */}
        <div className="relative w-40 h-40 flex items-center justify-center select-none pointer-events-none">
          <Globe3D imageUrl="/image_planet/earth.png" size={150} speed={0.0025} />
        </div>

        {/* Glassmorphic Form Card */}
        <GlassCard className="w-full !p-6 flex flex-col gap-5 border border-white/10 backdrop-blur-2xl">
          <div className="text-center space-y-1">
            <h2 className="text-headline-md text-on-surface text-lg font-semibold">
              {isRegister ? 'Tạo tài khoản mới' : 'Mở khóa nhật ký'}
            </h2>
            <p className="text-body-sm text-on-surface-variant text-xs">
              {isRegister
                ? 'Đăng ký phi hành gia mới để khám phá vũ trụ'
                : 'Nhập thông tin phi hành gia để bắt đầu du hành'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-caps text-[9px] text-on-surface-variant tracking-wider pl-1">
                TÊN ĐĂNG NHẬP
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">
                  person
                </span>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest/50 border border-outline-variant/40 text-on-surface placeholder-outline focus:border-primary-container/80 focus:outline-none transition-colors text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Passcode input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-caps text-[9px] text-on-surface-variant tracking-wider pl-1">
                MẬT KHẨU
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">
                  lock
                </span>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest/50 border border-outline-variant/40 text-on-surface placeholder-outline focus:border-primary-container/80 focus:outline-none transition-colors text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm password - chỉ hiển thị khi đăng ký */}
            {isRegister && (
              <div className="flex flex-col gap-1.5">
                <label className="text-label-caps text-[9px] text-on-surface-variant tracking-wider pl-1">
                  XÁC NHẬN MẬT KHẨU
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">
                    lock_reset
                  </span>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest/50 border border-outline-variant/40 text-on-surface placeholder-outline focus:border-primary-container/80 focus:outline-none transition-colors text-sm"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-error text-xs text-center font-semibold bg-error-container/10 border border-error-container/20 py-2 px-3 rounded-lg">
                ⚠️ {error}
              </p>
            )}

            {success && (
              <p className="text-primary-container text-xs text-center font-semibold bg-primary-container/10 border border-primary-container/20 py-2 px-3 rounded-lg">
                ✅ {success}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-primary-container to-primary text-on-primary font-bold text-xs tracking-widest font-mono uppercase shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.65)] active:scale-[0.98] transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {loading
                ? 'ĐANG XỬ LÝ...'
                : isRegister
                  ? '🚀 ĐĂNG KÝ HÀNH TRÌNH'
                  : '🌌 BẮT ĐẦU DU HÀNH'}
            </button>
          </form>

          {/* Toggle login / register */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-xs text-primary-container/80 hover:text-primary-container transition-colors underline underline-offset-4 cursor-pointer"
            >
              {isRegister
                ? 'Đã có tài khoản? Đăng nhập tại đây'
                : 'Chưa có tài khoản? Đăng ký ngay'}
            </button>
          </div>
        </GlassCard>

        {/* Footer info */}
        <footer className="text-[10px] text-on-surface-variant/50 font-mono tracking-widest text-center">
          SYSTEM VERSION 2.0.0 • LOCAL DATA SECURED
        </footer>
      </div>
    </div>
  )
}
