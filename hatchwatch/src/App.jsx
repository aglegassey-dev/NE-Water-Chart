import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import HomeScreen from './pages/HomeScreen'
import RiverDetail from './pages/RiverDetail'
import HatchCalendar from './pages/HatchCalendar'
import Settings from './pages/Settings'

const NAV_TABS = [
  { icon: '🎣', label: 'Rivers',   path: '/' },
  { icon: '🪲', label: 'Hatches',  path: '/hatches' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
]

const useActiveTab = (path) => {
  const location = useLocation()
  if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/river')
  return location.pathname.startsWith(path)
}

function Sidebar() {
  const location = useLocation()
  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/' || location.pathname.startsWith('/river')
      : location.pathname.startsWith(path)

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-olive-900 border-r border-olive-700 z-20 px-4 py-6">
      <span className="font-river text-amber text-xl mb-10 px-2">HatchWatch</span>
      <nav className="flex flex-col gap-1">
        {NAV_TABS.map(tab => {
          const active = isActive(tab.path)
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-olive-900
                ${active
                  ? 'bg-olive-700 text-amber'
                  : 'text-slate-muted hover:text-white hover:bg-olive-800'
                }`}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

function BottomNav() {
  const location = useLocation()
  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/' || location.pathname.startsWith('/river')
      : location.pathname.startsWith(path)

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-olive-900 border-t border-olive-700"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-14">
        {NAV_TABS.map(tab => {
          const active = isActive(tab.path)
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber
                ${active ? 'text-amber' : 'text-slate-muted'}`}
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
        <div className="min-h-screen bg-olive-900">
          <div className="max-w-6xl mx-auto relative">
            <Sidebar />
            <main className="pb-20 md:pb-6 md:pl-56">
              <Routes>
                <Route path="/"               element={<HomeScreen />} />
                <Route path="/river/:riverId" element={<RiverDetail />} />
                <Route path="/hatches"        element={<HatchCalendar />} />
                <Route path="/settings"       element={<Settings />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </div>
      </BrowserRouter>
    </>
  )
}
