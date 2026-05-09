import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

const TYPE_EMOJI = {
  caddis:      '🪲',
  mayfly:      '🦋',
  stonefly:    '🪨',
  midge:       '🦟',
  terrestrial: '🌿',
  baitfish:    '🐟',
}

const TIME_LABELS = {
  morning:   'Morning',
  afternoon: 'Afternoon',
  evening:   'Evening',
  'all-day': 'All Day',
}

function PatternSection({ title, patterns, open, onToggle }) {
  if (!patterns || patterns.length === 0) return null
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 w-full text-left py-1.5 min-h-[44px]
          hover:text-white transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal"
      >
        <ChevronRight
          size={14}
          className="text-slate-muted transition-transform duration-200 flex-shrink-0"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
        <span className="text-slate-muted text-sm font-medium">{title}</span>
        <span className="text-slate-muted text-xs ml-1">({patterns.length})</span>
      </button>
      {open && (
        <div className="ml-5 space-y-2 mb-1">
          {patterns.map((p, i) => (
            <div key={i}>
              <span className="bg-olive-700 text-xs px-2 py-1 rounded-full inline-block text-white">
                {p.name} {p.sizes}
              </span>
              {p.notes && (
                <p className="text-slate-muted italic text-xs mt-0.5 ml-1">{p.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function HatchCard({ hatch }) {
  const [open, setOpen] = useState({ nymph: false, dry: false, wet: false, streamer: false })
  const toggle = (k) => setOpen(prev => ({ ...prev, [k]: !prev[k] }))

  return (
    <div className="bg-olive-800 rounded-xl p-4 border-l-4 border-teal">
      {/* Header */}
      <div className="flex items-start gap-3 mb-2">
        <span className="text-2xl flex-shrink-0">{TYPE_EMOJI[hatch.type] ?? '🪲'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white">{hatch.commonName}</span>
            <span className="bg-olive-700 text-slate-muted text-xs px-2 py-0.5 rounded">
              {TIME_LABELS[hatch.timeOfDay] ?? hatch.timeOfDay}
            </span>
          </div>
          <div className="text-slate-muted italic text-xs mt-0.5">{hatch.latinName}</div>
          <div className="text-teal text-sm mt-1">
            {hatch.waterTempMinF}°–{hatch.waterTempMaxF}°F
          </div>
        </div>
      </div>

      <p className="text-slate-muted text-sm mb-3 italic">{hatch.notes}</p>

      <div className="divide-y divide-olive-700">
        <PatternSection
          title="Nymph"
          patterns={hatch.patterns.nymph}
          open={open.nymph}
          onToggle={() => toggle('nymph')}
        />
        <PatternSection
          title="Dry"
          patterns={hatch.patterns.dry}
          open={open.dry}
          onToggle={() => toggle('dry')}
        />
        <PatternSection
          title="Wet"
          patterns={hatch.patterns.wet}
          open={open.wet}
          onToggle={() => toggle('wet')}
        />
        <PatternSection
          title="Streamer"
          patterns={hatch.patterns.streamer}
          open={open.streamer}
          onToggle={() => toggle('streamer')}
        />
      </div>
    </div>
  )
}
