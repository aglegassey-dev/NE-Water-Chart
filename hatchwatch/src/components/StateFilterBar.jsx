const STATES = ['All', 'ME', 'NH', 'VT']

export default function StateFilterBar({ activeState, onStateChange }) {
  return (
    <div className="sticky top-14 z-10 bg-olive-900 py-2 px-4 flex gap-2">
      {STATES.map(s => (
        <button
          key={s}
          onClick={() => onStateChange(s)}
          className={`min-h-[44px] px-4 rounded-full text-sm font-medium transition-colors duration-150 ${
            activeState === s
              ? 'bg-amber text-olive-900 font-semibold'
              : 'bg-olive-700 text-slate-muted'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
