import { useState, useCallback } from 'react'

const KEY = 'hatchwatch_favorites'

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(read)

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { favorites, toggleFavorite }
}
