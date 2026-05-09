import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { getRiverById } from '../data/rivers'
import { getActiveHatches } from '../data/hatches'
import { useStreamflow } from '../hooks/useStreamflow'
import { useWeather } from '../hooks/useWeather'
import { useFlowHistory } from '../hooks/useFlowHistory'
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
  const { history: sparkData, isLoading: sparkLoading } =
    useFlowHistory(river?.usgsStationId)

  if (!river) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <p className="text-slate-muted">River not found.</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
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
      {/* Header — full width on all breakpoints */}
      <header className="bg-olive-900 sticky top-0 z-20 px-4 h-14 flex items-center gap-3 md:px-6">
        <button
          onClick={() => navigate('/')}
          className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-muted
            hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-olive-900"
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

      {/* Two-column grid on desktop */}
      <div className="md:grid md:grid-cols-[1fr_380px] md:gap-6 md:items-start px-4 md:px-6 py-4">

        {/* Left column */}
        <div className="space-y-4">
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

          {/* CFS display + sparkline */}
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

            {sparkLoading ? (
              <div className="bg-olive-700 animate-pulse rounded h-10 w-[120px] mt-1" />
            ) : sparkData.length > 0 ? (
              <div className="pt-1">
                <p className="text-slate-muted text-xs mb-1">7-day trend</p>
                <FlowSparkline data={sparkData} />
              </div>
            ) : null}
          </div>

          {/* Species */}
          <div>
            <h2 className="text-slate-muted text-xs uppercase tracking-wider mb-2">
              Target Species
            </h2>
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

          {/* USGS link */}
          <a
            href={`https://waterdata.usgs.gov/monitoring-location/${river.usgsStationId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-teal text-sm py-3 border border-olive-700 rounded-xl justify-center
              hover:border-teal hover:bg-olive-800 transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            View on USGS <ExternalLink size={14} />
          </a>
        </div>

        {/* Right column — hatches (stacks below on mobile, beside on desktop) */}
        <div className="mt-6 md:mt-0">
          <h2 className="font-river text-lg text-white mb-3">Active Hatches</h2>
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

      </div>
    </div>
  )
}
