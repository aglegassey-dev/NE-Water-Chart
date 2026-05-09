import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import HomeScreen from './pages/HomeScreen'
import RiverDetail from './pages/RiverDetail'
import HatchCalendar from './pages/HatchCalendar'
import Settings from './pages/Settings'

function BottomNav() {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/river')
    return location.pathname.startsWith(path)
  }

  const tabs = [
    { icon: '🎣', label: 'Rivers',   path: '/' },
    { icon: '🪲', label: 'Hatches',  path: '/hatches' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-olive-900 border-t border-olive-700"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-14">
        {tabs.map(tab => {
          const active = isActive(tab.path)
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-150 ${
                active ? 'text-amber' : 'text-slate-muted'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-amber rounded-b" />
              )}
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default function App() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const up   = () => setIsOnline(true)
    const down = () => setIsOnline(false)
    window.addEventListener('online',  up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online',  up)
      window.removeEventListener('offline', down)
    }
  }, [])

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-900 text-white text-sm text-center py-2">
          You're offline — showing cached data
        </div>
      )}
      <BrowserRouter>
        <div style={{ paddingBottom: 70 }}>
          <Routes>
            <Route path="/"               element={<HomeScreen />} />
            <Route path="/river/:riverId" element={<RiverDetail />} />
            <Route path="/hatches"        element={<HatchCalendar />} />
            <Route path="/settings"       element={<Settings />} />
          </Routes>
        </div>
        <BottomNav />
      </BrowserRouter>
    </>
  )
}
