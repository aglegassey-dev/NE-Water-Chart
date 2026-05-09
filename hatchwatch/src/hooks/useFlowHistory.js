import { useQuery } from '@tanstack/react-query'

const fetchFlowHistory = async (stationId) => {
  const url =
    `https://waterservices.usgs.gov/nwis/dv/?format=json&sites=${stationId}` +
    `&parameterCd=00060&period=P7D`
  const res = await fetch(url)
  if (!res.ok) return []

  const json = await res.json()
  const timeSeries = json?.value?.timeSeries ?? []
  const series = timeSeries.find(s => s.variable.variableCode[0].value === '00060')
  if (!series) return []

  return (series.values?.[0]?.value ?? [])
    .filter(v => v.value !== '-999999' && v.value !== null)
    .map(v => ({ date: v.dateTime.slice(0, 10), cfs: parseFloat(v.value) }))
    .filter(v => !isNaN(v.cfs))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export const useFlowHistory = (stationId) => {
  const { data, isLoading } = useQuery({
    queryKey: ['flowHistory', stationId],
    queryFn: () => fetchFlowHistory(stationId),
    staleTime: 1000 * 60 * 60 * 6,
    enabled: Boolean(stationId),
  })

  return { history: data ?? [], isLoading }
}
