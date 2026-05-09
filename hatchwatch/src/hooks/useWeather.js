import { useQuery } from '@tanstack/react-query'

const degreesToCardinal = (deg) => {
  if (deg === null || deg === undefined) return null
  const d = ((deg % 360) + 360) % 360
  if (d >= 337.5 || d < 22.5)   return 'N'
  if (d < 67.5)                  return 'NE'
  if (d < 112.5)                 return 'E'
  if (d < 157.5)                 return 'SE'
  if (d < 202.5)                 return 'S'
  if (d < 247.5)                 return 'SW'
  if (d < 292.5)                 return 'W'
  return 'NW'
}

const fetchWeather = async (lat, lng) => {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,windspeed_10m,winddirection_10m,cloudcover,precipitation` +
    `&wind_speed_unit=mph&temperature_unit=fahrenheit&forecast_days=1`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open-Meteo fetch failed: ${res.status}`)
  const json = await res.json()

  const c = json?.current ?? {}
  return {
    tempF:          c.temperature_2m    ?? null,
    windMph:        c.windspeed_10m     ?? null,
    windDirection:  degreesToCardinal(c.winddirection_10m),
    cloudCoverPct:  c.cloudcover        ?? null,
    precipMm:       c.precipitation     ?? null,
  }
}

export const useWeather = (lat, lng) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: () => fetchWeather(lat, lng),
    staleTime: 1000 * 60 * 60,
    enabled: lat !== undefined && lng !== undefined,
  })

  return {
    tempF:         data?.tempF         ?? null,
    windMph:       data?.windMph       ?? null,
    windDirection: data?.windDirection ?? null,
    cloudCoverPct: data?.cloudCoverPct ?? null,
    precipMm:      data?.precipMm      ?? null,
    isLoading,
    isError,
  }
}
