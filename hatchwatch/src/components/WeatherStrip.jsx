const cloudEmoji = (pct) => {
  if (pct === null || pct === undefined) return ''
  if (pct < 20) return '☀️'
  if (pct <= 60) return '🌤️'
  return '☁️'
}

const fmt = (val, decimals = 1) =>
  val === null || val === undefined ? '—' : Number(val).toFixed(decimals)

export default function WeatherStrip({ tempF, windMph, windDirection, cloudCoverPct, precipMm }) {
  return (
    <div className="flex items-center gap-3 text-xs text-slate-muted flex-wrap">
      <span className="text-white">{fmt(tempF, 0)}°F</span>
      <span>💨 {fmt(windMph, 1)}mph {windDirection ?? '—'}</span>
      <span>{cloudEmoji(cloudCoverPct)}</span>
      {precipMm !== null && precipMm !== undefined && precipMm > 0.5 && (
        <span>🌧️</span>
      )}
    </div>
  )
}
