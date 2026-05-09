import { ChevronRight, RefreshCw, Heart } from 'lucide-react'
import { useStreamflow } from '../hooks/useStreamflow'
import { useWeather } from '../hooks/useWeather'
import { getFlowStatus } from '../utils/flowStatus'
import { formatCFS, formatTemp } from '../utils/formatters'
import WeatherStrip from './WeatherStrip'

export default function RiverCard({ river, onTap, isFavorited, onToggleFavorite }) {
  const { cfs, gaugeHeight, waterTempF, isLoading, isError, refetch } =
    useStreamflow(river.usgsStationId)
  const { tempF, windMph, windDirection, cloudCoverPct, precipMm } =
    useWeather(river.lat, river.lng)

  const handleHeartClick = (e) => {
    e.stopPropagation()
    onToggleFavorite?.(river.id)
  }

  if (isLoading) {
    return (
      <div className="bg-olive-800 rounded-xl p-4 min-h-[44px] space-y-2">
        <div className="bg-olive-700 animate-pulse rounded h-4 w-3/5" />
        <div className="bg-olive-700 animate-pulse rounded h-4 w-2/5" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-olive-800 rounded-xl p-4 min-h-[44px] flex items-center gap-2">
        <span className="text-slate-muted text-sm flex-1">Flow data unavailable</span>
        <button
          onClick={(e) => { e.stopPropagation(); refetch() }}
          className="text-slate-muted p-1 min-h-[44px] min-w-[44px] flex items-center justify-center
            hover:text-white transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-olive-900"
          aria-label="Retry"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    )
  }

  const flowStatus = getFlowStatus(cfs)

  return (
    <button
      onClick={onTap}
      className="w-full bg-olive-800 rounded-xl p-4 text-left min-h-[44px] flex flex-col gap-2
        hover:bg-olive-700 transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
    >
      {/* Top row */}
      <div className="flex items-center gap-2">
        <span className="font-river text-white text-base leading-snug flex-1 min-w-0 truncate">
          {river.name}
        </span>
        <span className="bg-olive-700 text-slate-muted text-xs px-2 py-0.5 rounded flex-shrink-0">
          {river.state}
        </span>
        {river.flyFishingOnly && (
          <span className="text-amber text-xs font-medium flex-shrink-0">🎣 FFO</span>
        )}
        <button
          onClick={handleHeartClick}
          className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2
            hover:scale-110 transition-transform
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-olive-800"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={18}
            className={isFavorited ? 'fill-amber text-amber' : 'fill-none text-slate-muted'}
          />
        </button>
        <span className="w-2 h-2 rounded-full bg-teal animate-pulse flex-shrink-0" />
      </div>

      {/* Middle row */}
      <div className="flex items-baseline gap-3">
        <span
          className="text-2xl font-bold"
          style={{ color: flowStatus?.color ?? '#94A3B8' }}
        >
          {formatCFS(cfs)}
        </span>
        {gaugeHeight !== null && (
          <span className="text-slate-muted text-sm">{gaugeHeight.toFixed(2)} ft</span>
        )}
        {flowStatus && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: flowStatus.color + '33', color: flowStatus.color }}
          >
            {flowStatus.label}
          </span>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          {waterTempF !== null && (
            <span className="text-teal text-sm">{formatTemp(waterTempF)}</span>
          )}
          <WeatherStrip
            tempF={tempF}
            windMph={windMph}
            windDirection={windDirection}
            cloudCoverPct={cloudCoverPct}
            precipMm={precipMm}
          />
        </div>
        <ChevronRight size={16} className="text-slate-muted flex-shrink-0" />
      </div>
    </button>
  )
}
