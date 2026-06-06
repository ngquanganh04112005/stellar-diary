import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopAppBar from './components/TopAppBar'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import JourneyPage from './pages/JourneyPage'
import JournalPage from './pages/JournalPage'
import StatsPage from './pages/StatsPage'
import ProfilePage from './pages/ProfilePage'
import NewEntryPage from './pages/NewEntryPage'
import ExplorePlanetsPage from './pages/ExplorePlanetsPage'
import LoginPage from './pages/LoginPage'
import { seedDatabase } from './seed'

export default function App() {
  const [ready, setReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true')

  useEffect(() => {
    seedDatabase().then(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <img
          src="/image_planet/logo.png"
          alt="Stellar Diary"
          className="h-20 w-20 rounded-full object-cover shadow-[0_0_32px_rgba(0,229,255,0.35)] animate-float"
        />
        <p className="text-label-caps text-on-surface-variant tracking-widest">
          ĐANG KHỞI ĐỘNG HỆ THỐNG...
        </p>
      </div>
    )
  }

  // Nếu chưa đăng nhập, hiển thị màn hình đăng nhập độc lập (không có thanh điều hướng)
  if (!isLoggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <TopAppBar />
        <main className="flex-grow pt-[72px] pb-safe-bottom px-6 max-w-lg mx-auto w-full">
          <div className="py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/journey" element={<JourneyPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/new-entry" element={<NewEntryPage />} />
              <Route path="/explore-planets" element={<ExplorePlanetsPage />} />
            </Routes>
          </div>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
