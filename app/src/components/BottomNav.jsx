import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/journey', icon: 'map', label: 'HÀNH TRÌNH' },
  { to: '/journal', icon: 'dashboard', label: 'NHẬT KÝ' },
  { to: '/', icon: 'home', label: 'TRANG CHỦ' },
  { to: '/stats', icon: 'query_stats', label: 'THỐNG KÊ' },
  { to: '/profile', icon: 'person', label: 'HỒ SƠ' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pt-3 backdrop-blur-[40px] bg-white/5 border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] rounded-t-xl bottom-nav-height">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
              isActive
                ? 'text-primary-container drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] font-bold scale-110'
                : 'text-outline opacity-60 hover:text-primary hover:opacity-80'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-[9px] font-mono tracking-widest font-bold">
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
