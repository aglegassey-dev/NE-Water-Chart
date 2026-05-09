import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { getRiverById } from '../data/rivers'
import { getActiveHatches } from '../data/hatches'
import { useStreamflow } from '../hooks/useStreamflow'
import { useWeather } from '../hooks/useWeather'
import { getFlowStatus } from '../utils/flowStatus'
import { formatCFS, formatTemp, formatLastUpdated } from '../utils/formatters'
import WeatherStrip from '../components/WeatherStrip'
import FlowSparkline from '../components/FlowSparkline'
import HatchCard from '../components/HatchCard'

const currentMonth = new Date().getMonth() + 1

export default function RiverDetail() {
  const { riverId } = useParams()
  const navigate = useNavigate()
  const river = getRiverById(riverId)

  const { cfs, gaugeHeight, waterTempF, lastUpdated, isLoading, isError } =
    useStreamflow(river?.usgsStationId)
  const { tempF, windMph, windDirection, cloudCoverPct, precipMm } =
    useWeather(river?.lat, river?.lng)

  const mockSparkData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString(),
        cfs: 300 + Math.sin(i) * 100 + Math.random() * 50,
      })),
    []
  )

  if (!river) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <p className="text-slate-muted">River not found.</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-amber"
        >
          <ArrowLeft size={16} /> Back to Rivers
        </button>
      </div>
    )
  }

  const flowStatus = getFlowStatus(cfs)
  const activeHatches = getActiveHatches(currentMonth, waterTempF ?? undefined)

  return (
    <div>
      {/* Header */}
      <header className="bg-olive-900 sticky top-0 z-20 px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-muted"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-river text-white text-lg truncate">{river.name}</h1>
          <p className="text-slate-muted text-xs truncate">{river.section}</p>
        </div>
        {river.flyFishingOnly && (
          <span className="text-amber text-xs font-medium flex-shrink-0">🎣 FFO</span>
        )}
      </header>

      <div className="px-4 py-4 space-y-5">
        {/* Weather strip */}
        <div className="bg-olive-800 rounded-xl p-3">
          <WeatherStrip
            tempF={tempF}
            windMph={windMph}
            windDirection={windDirection}
            cloudCoverPct={cloudCoverPct}
            precipMm={precipMm}
          />
        </div>

        {/* CFS display */}
        <div className="bg-olive-800 rounded-xl p-4 space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              <div className="bg-olive-700 animate-pulse rounded h-12 w-2/5" />
              <div className="bg-olive-700 animate-pulse rounded h-4 w-3/5" />
            </div>
          ) : isError ? (
            <p className="text-slate-muted">Flow data unavailable for this station.</p>
          ) : (
            <>
              <div className="flex items-end gap-3 flex-wrap">
                <span
                  className="text-5xl font-bold leading-none"
                  style={{ color: flowStatus?.color ?? '#94A3B8' }}
                >
                  {formatCFS(cfs)}
                </span>
                {flowStatus && (
                  <span
                    className="text-sm px-3 py-1 rounded-full font-medium mb-1"
                    style={{ backgroundColor: flowStatus.color + '33', color: flowStatus.color }}
                  >
                    {flowStatus.label}
                  </span>
                )}
              </div>

              {flowStatus && (
                <p className="text-slate-muted text-sm">{flowStatus.description}</p>
              )}

              <div className="flex items-center gap-4 flex-wrap text-sm">
                {gaugeHeight !== null && (
                  <span className="text-slate-muted">
                    Gauge: <span className="text-white">{gaugeHeight.toFixed(2)} ft</span>
                  </span>
                )}
                {waterTempF !== null && (
                  <span className="text-slate-muted">
                    Water: <span className="text-teal">{formatTemp(waterTempF)}</span>
                  </span>
                )}
              </div>

              {lastUpdated && (
                <p className="text-slate-muted text-xs">{formatLastUpdated(lastUpdated)}</p>
              )}
            </>
          )}

          {/* Sparkline */}
          <div className="pt-1">
            <p className="text-slate-muted text-xs mb-1">7-day trend</p>
            <FlowSparkline data={mockSparkData} />
          </div>
        </div>

        {/* Species */}
        <div>
          <h2 className="text-slate-muted text-xs uppercase tracking-wider mb-2">Target Species</h2>
          <div className="flex flex-wrap gap-2">
            {river.targetSpecies.map(s => (
              <span key={s} className="bg-olive-700 rounded-full px-3 py-1 text-sm text-white">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <p className="text-slate-muted italic text-sm leading-relaxed">{river.notes}</p>

        {/* Active hatches */}
        <div>
          <h2 className="text-slate-muted text-xs uppercase tracking-wider mb-3">
            Active Hatches This Month
          </h2>
          {activeHatches.length === 0 ? (
            <p className="text-slate-muted text-sm">No active hatches this month.</p>
          ) : (
            <div className="space-y-3">
              {activeHatches.map(h => (
                <HatchCard key={h.id} hatch={h} />
              ))}
            </div>
          )}
        </div>

        {/* USGS link */}
        <a
          href={`https://waterdata.usgs.gov/monitoring-location/${river.usgsStationId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-teal text-sm py-3 border border-olive-700 rounded-xl justify-center"
        >
          View on USGS <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}
