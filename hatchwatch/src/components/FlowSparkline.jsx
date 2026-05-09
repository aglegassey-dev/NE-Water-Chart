import { AreaChart, Area } from 'recharts'

export default function FlowSparkline({ data }) {
  if (!data || data.length === 0) return null

  return (
    <AreaChart
      width={120}
      height={40}
      data={data}
      margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
    >
      <defs>
        <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="cfs"
        stroke="#0D9488"
        strokeWidth={2}
        fill="url(#tealGrad)"
        dot={false}
        isAnimationActive={false}
      />
    </AreaChart>
  )
}
