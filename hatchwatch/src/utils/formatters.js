const getFlowUnit = () => localStorage.getItem('hatchwatch_units_flow') ?? 'cfs'
const getTempUnit = () => localStorage.getItem('hatchwatch_units_temp') ?? 'f'

export const formatCFS = (cfs, unit) => {
  if (cfs === null || cfs === undefined) return '—'
  const u = unit ?? getFlowUnit()
  if (u === 'cms') {
    return `${(cfs * 0.0283168).toFixed(2)} m³/s`
  }
  return `${Math.round(cfs).toLocaleString()} cfs`
}

export const formatTemp = (tempF, unit) => {
  if (tempF === null || tempF === undefined) return '—'
  const u = unit ?? getTempUnit()
  if (u === 'c') {
    return `${((tempF - 32) * 5 / 9).toFixed(1)}°C`
  }
  return `${Math.round(tempF)}°F`
}

export const formatWindDir = (degrees) => {
  if (degrees === null || degrees === undefined) return '—'
  const d = ((degrees % 360) + 360) % 360
  if (d >= 337.5 || d < 22.5)  return 'N'
  if (d < 67.5)                 return 'NE'
  if (d < 112.5)                return 'E'
  if (d < 157.5)                return 'SE'
  if (d < 202.5)                return 'S'
  if (d < 247.5)                return 'SW'
  if (d < 292.5)                return 'W'
  return 'NW'
}

export const formatLastUpdated = (date) => {
  if (!date) return 'Not updated'
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1)   return 'Updated just now'
  if (diffMin < 60)  return `Updated ${diffMin} min ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24)   return `Updated ${diffHr}h ago`
  const diffDays = Math.floor(diffHr / 24)
  return `Updated ${diffDays}d ago`
}
