import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { getRiverById } from '../data/rivers'
import { formatCFS, formatTemp, formatLastUpdated } from '../utils/formatters'

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-olive-900'

const SectionHeading = ({ children }) => (
  <p className="text-slate-muted text-xs uppercase tracking-wider mb-3">{children}</p>
)

function UnitToggle({ options, value, onChange }) {
  return (
    <div className="bg-olive-700 rounded-lg flex overflow-hidden">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors duration-150 ${RING} ${
            value === opt.value
              ? 'bg-amber text-olive-900 font-semibold'
              : 'text-slate-muted hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function Settings() {
  const queryClient = useQueryClient()
  const { favorites, toggleFavorite } = useFavorites()

  const [flowUnit, setFlowUnit] = useState(
    () => localStorage.getItem('hatchwatch_units_flow') ?? 'cfs'
  )
  const [tempUnit, setTempUnit] = useState(
    () => localStorage.getItem('hatchwatch_units_temp') ?? 'f'
  )
  const [alerts, setAlerts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hatchwatch_alerts') ?? '{}')
    } catch {
      return {}
    }
  })

  const handleFlowUnit = (u) => {
    setFlowUnit(u)
    localStorage.setItem('hatchwatch_units_flow', u)
  }

  const handleTempUnit = (u) => {
    setTempUnit(u)
    localStorage.setItem('hatchwatch_units_temp', u)
  }

  const toggleAlert = (id) => {
    setAlerts(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('hatchwatch_alerts', JSON.stringify(next))
      return next
    })
  }

  const handleRefreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['streamflow'] })
    queryClient.invalidateQueries({ queryKey: ['weather'] })
  }

  const allCached = queryClient.getQueryCache().getAll()
  const lastUpdatedAt = allCached.reduce(
    (max, q) => Math.max(max, q.state.dataUpdatedAt ?? 0),
    0
  )
  const lastUpdated = lastUpdatedAt ? new Date(lastUpdatedAt) : null
  const favoriteRivers = favorites.map(id => getRiverById(id)).filter(Boolean)

  return (
    <div>
      <header className="bg-olive-900 sticky top-0 z-20 px-4 h-14 flex items-center md:px-6">
        <h1 className="font-river text-amber text-xl">Settings</h1>
      </header>

      <div className="max-w-2xl px-4 md:px-6 py-4 space-y-4">

        {/* Section 1 — MY RIVERS */}
        <div className="bg-olive-800 rounded-xl p-4">
          <SectionHeading>My Rivers</SectionHeading>
          {favoriteRivers.length === 0 ? (
            <p className="text-slate-muted text-sm">
              No favorites yet. Tap the heart on any river card.
            </p>
          ) : (
            <div className="space-y-2">
              {favoriteRivers.map(river => (
                <div key={river.id} className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{river.name}</p>
                    <p className="text-slate-muted text-xs truncate">
                      {river.section} · {river.state}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(river.id)}
                    className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-muted hover:text-white transition-colors ${RING}`}
                    aria-label={`Remove ${river.name}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2 — UNITS & DISPLAY */}
        <div className="bg-olive-800 rounded-xl p-4 space-y-4">
          <SectionHeading>Units &amp; Display</SectionHeading>

          <div>
            <p className="text-white text-sm mb-2">Flow</p>
            <UnitToggle
              options={[{ label: 'CFS', value: 'cfs' }, { label: 'CMS', value: 'cms' }]}
              value={flowUnit}
              onChange={handleFlowUnit}
            />
            <p className="text-slate-muted text-xs mt-2">
              Preview: <span className="text-white">{formatCFS(1234, flowUnit)}</span>
            </p>
          </div>

          <div>
            <p className="text-white text-sm mb-2">Temperature</p>
            <UnitToggle
              options={[{ label: '°F', value: 'f' }, { label: '°C', value: 'c' }]}
              value={tempUnit}
              onChange={handleTempUnit}
            />
            <p className="text-slate-muted text-xs mt-2">
              Preview: <span className="text-white">{formatTemp(55, tempUnit)}</span>
            </p>
          </div>
        </div>

        {/* Section 3 — FLOW ALERTS */}
        <div className="bg-olive-800 rounded-xl p-4">
          <SectionHeading>Flow Alerts</SectionHeading>
          {favoriteRivers.length === 0 ? (
            <p className="text-slate-muted text-sm">Add favorite rivers to set flow alerts.</p>
          ) : (
            <div className="space-y-3">
              {favoriteRivers.map(river => (
                <div key={river.id} className="flex items-center justify-between gap-3">
                  <p className="text-white text-sm flex-1 min-w-0 truncate">{river.name}</p>
                  <button
                    onClick={() => toggleAlert(river.id)}
                    className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 ${RING} ${
                      alerts[river.id] ? 'bg-teal' : 'bg-olive-700'
                    }`}
                    aria-pressed={!!alerts[river.id]}
                    aria-label={`Alert for ${river.name}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        alerts[river.id] ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-slate-muted text-xs mt-3 italic">
            Push notifications coming in a future update.
          </p>
        </div>

        {/* Section 4 — DATA */}
        <div className="bg-olive-800 rounded-xl p-4 space-y-3">
          <SectionHeading>Data</SectionHeading>
          <div className="flex items-center justify-between">
            <span className="text-slate-muted text-sm">Last refreshed</span>
            <span className="text-white text-sm">
              {lastUpdated ? formatLastUpdated(lastUpdated) : 'Not yet loaded'}
            </span>
          </div>
          <button
            onClick={handleRefreshAll}
            className={`w-full bg-olive-700 rounded-lg py-3 text-sm text-white font-medium transition-colors hover:bg-olive-600 active:bg-olive-600 ${RING}`}
          >
            Refresh All Data
          </button>
        </div>

        {/* Section 5 — ABOUT */}
        <div className="bg-olive-800 rounded-xl p-4 space-y-2">
          <SectionHeading>About</SectionHeading>
          <div className="flex items-center justify-between">
            <span className="text-slate-muted text-sm">Version</span>
            <span className="text-white text-sm">1.0.0</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-slate-muted text-sm">Data sources</span>
            <span className="text-white text-sm text-right">USGS Water Services · Open-Meteo</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-slate-muted text-sm">Hatch data</span>
            <span className="text-white text-sm text-right">
              Curated for Maine, New Hampshire &amp; Vermont
            </span>
          </div>
          <a
            href="https://www.usgs.gov/legal"
            target="_blank"
            rel="noopener noreferrer"
            className={`block text-teal text-sm pt-1 hover:text-teal-light transition-colors ${RING}`}
          >
            USGS Terms of Service →
          </a>
        </div>

      </div>
    </div>
  )
}
