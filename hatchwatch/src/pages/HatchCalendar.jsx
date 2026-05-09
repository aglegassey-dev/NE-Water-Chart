import { useState } from 'react'
import { getActiveHatches } from '../data/hatches'
import HatchCard from '../components/HatchCard'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const TYPE_FILTERS = [
  { label: 'All',      value: 'all' },
  { label: 'Mayfly',   value: 'mayfly' },
  { label: 'Caddis',   value: 'caddis' },
  { label: 'Stonefly', value: 'stonefly' },
  { label: 'Streamer', value: 'baitfish' },
]

const currentMonth = new Date().getMonth() + 1

export default function HatchCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [typeFilter, setTypeFilter] = useState('all')

  const hatches = getActiveHatches(selectedMonth).filter(
    h => typeFilter === 'all' || h.type === typeFilter
  )

  return (
    <div>
      {/* Header */}
      <header className="bg-olive-900 sticky top-0 z-20 px-4 h-14 flex items-center">
        <h1 className="font-river text-amber text-xl">Hatch Calendar</h1>
      </header>

      {/* Month selector */}
      <div className="sticky top-14 z-10 bg-olive-900 py-2">
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
          {MONTHS.map((m, i) => {
            const month = i + 1
            const active = selectedMonth === month
            return (
              <button
                key={m}
                onClick={() => setSelectedMonth(month)}
                className={`flex-shrink-0 min-h-[44px] px-3 rounded-full text-sm font-medium transition-colors duration-150 ${
                  active
                    ? 'bg-amber text-olive-900 font-semibold'
                    : 'bg-olive-700 text-slate-muted'
                }`}
              >
                {m}
              </button>
            )
          })}
        </div>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none">
        {TYPE_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(f.value)}
            className={`flex-shrink-0 min-h-[44px] px-3 rounded-full text-sm font-medium transition-colors duration-150 ${
              typeFilter === f.value
                ? 'bg-amber text-olive-900 font-semibold'
                : 'bg-olive-700 text-slate-muted'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Hatch list */}
      <div className="px-4 pb-4 space-y-3">
        {hatches.length === 0 ? (
          <p className="text-slate-muted text-sm text-center py-8">
            No hatches recorded for this month.
          </p>
        ) : (
          hatches.map(h => <HatchCard key={h.id} hatch={h} />)
        )}
      </div>
    </div>
  )
}
