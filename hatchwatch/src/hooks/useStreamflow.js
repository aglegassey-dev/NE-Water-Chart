import { useQuery } from '@tanstack/react-query'

const USGS_BASE = 'https://waterservices.usgs.gov/nwis/iv/'

const findSeries = (timeSeries, code) =>
  timeSeries.find(s => s.variable.variableCode[0].value === code)

const latestValue = (series) => {
  if (!series) return null
  const raw = series.values?.[0]?.value?.[0]?.value
  if (raw === undefined || raw === null || raw === '-999999') return null
  const n = parseFloat(raw)
  return isNaN(n) ? null : n
}

const latestDateTime = (series) => {
  if (!series) return null
  const dt = series.values?.[0]?.value?.[0]?.dateTime
  return dt ? new Date(dt) : null
}

export const fetchStreamflow = async (stationId) => {
  const url = `${USGS_BASE}?format=json&sites=${stationId}&parameterCd=00060,00065,00010&siteStatus=active`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`USGS fetch failed: ${res.status}`)
  const json = await res.json()

  const timeSeries = json?.value?.timeSeries ?? []
  const dischargeSeries = findSeries(timeSeries, '00060')
  const gaugeSeries     = findSeries(timeSeries, '00065')
  const tempSeries      = findSeries(timeSeries, '00010')

  const cfs         = latestValue(dischargeSeries)
  const gaugeHeight = latestValue(gaugeSeries)
  const tempC       = latestValue(tempSeries)
  const waterTempF  = tempC !== null ? (tempC * 9 / 5) + 32 : null
  const lastUpdated = latestDateTime(dischargeSeries) ?? latestDateTime(gaugeSeries)

  return { cfs, gaugeHeight, waterTempF, lastUpdated }
}

export const useStreamflow = (stationId) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['streamflow', stationId],
    queryFn: () => fetchStreamflow(stationId),
    staleTime: 1000 * 60 * 60,
    enabled: Boolean(stationId),
  })

  return {
    cfs: data?.cfs ?? null,
    gaugeHeight: data?.gaugeHeight ?? null,
    waterTempF: data?.waterTempF ?? null,
    lastUpdated: data?.lastUpdated ?? null,
    isLoading,
    isError,
    refetch,
  }
}
