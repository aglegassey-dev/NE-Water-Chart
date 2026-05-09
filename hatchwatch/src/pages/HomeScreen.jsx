import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Settings, RefreshCw } from 'lucide-react'
import { useQueries, useQueryClient } from '@tanstack/react-query'

import rivers from '../data/rivers'
import { getActiveHatches } from '../data/hatches'
import { fetchStreamflow } from '../hooks/useStreamflow'
import { useFavorites } from '../hooks/useFavorites'
import { getFlowStatus } from '../utils/flowStatus'
import RiverCard from '../components/RiverCard'
import StateFilterBar from '../components/StateFilterBar'

const currentMonth = new Date().getMonth() + 1

export default function HomeScreen() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeState, setActiveState] = useState('All')
  const [showFavorites, setShowFavorites] = useState(false)
  const { favorites, toggleFavorite } = useFavorites()

  const flowResults = useQueries({
    queries: rivers.map(r => ({
      queryKey: ['streamflow', r.usgsStationId],
      queryFn: () => fetchStreamflow(r.usgsStationId),
      staleTime: 1000 * 60 * 60,
    })),
  })

  const idealCount = flowResults.filter(
    q => q.data && getFlowStatus(q.data.cfs)?.status === 'ideal'
  ).length

  const firstHatch = getActiveHatches(currentMonth)[0]

  const filtered = rivers
    .filter(r => activeState === 'All' || r.state === activeState)
    .filter(r => !showFavorites || favorites.includes(r.id))

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['streamflow'] })
    queryClient.invalidateQueries({ queryKey: ['weather'] })
  }

  return (
    <div>
      {/* Header — md:pl-6 for extra breathing room beside sidebar */}
      <header className="bg-olive-900 sticky top-0 z-20 px-4 h-14 flex items-center justify-between md:pl-6">
        <h1 className="font-river text-amber text-xl">HatchWatch</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowFavorites(f => !f)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-olive-900"
            aria-label="Toggle favorites"
          >
            <Heart
              size={20}
              className={showFavorites ? 'fill-amber text-amber' : 'fill-none text-slate-muted'}
            />
          </button>
          <Link
            to="/settings"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center md:hidden
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-olive-900"
          >
            <Settings size={20} className="text-slate-muted" />
          </Link>
        </div>
      </header>

      {/* State filter */}
      <StateFilterBar activeState={activeState} onStateChange={setActiveState} />

      {/* Conditions banner */}
      <div className="bg-olive-700 mx-4 my-2 rounded-lg p-3 flex flex-col gap-1 md:mx-6">
        <span className="text-teal font-semibold text-sm">
          {idealCount > 0
            ? `${idealCount} river${idealCount === 1 ? '' : 's'} in ideal condition`
            : 'Checking conditions…'}
        </span>
        {firstHatch && (
          <span className="text-slate-muted text-xs">
            Active hatch: <span className="text-white">{firstHatch.commonName}</span>
          </span>
        )}
      </div>

      {/* River list */}
      <div className="px-4 pb-4 md:px-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-muted text-xs">{filtered.length} rivers</span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-slate-muted text-xs min-h-[44px] px-2
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-olive-900"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {showFavorites && favorites.length === 0 ? (
          <p className="text-slate-muted text-sm text-center py-8">
            Tap the heart on any river card to save favorites.
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-muted text-sm text-center py-8">
            No rivers match this filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(river => (
              <RiverCard
                key={river.id}
                river={river}
                onTap={() => navigate(`/river/${river.id}`)}
                isFavorited={favorites.includes(river.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
