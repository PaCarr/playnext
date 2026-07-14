import { useState, useEffect } from 'react'
import { useFavourites } from '../context/FavouritesContext'
import { useNavigate } from 'react-router-dom'

const API_KEY = import.meta.env.VITE_RAWG_API_KEY

function RecommendationsPage() {
  const { favourites } = useFavourites()
  const [groupedRecs, setGroupedRecs] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (favourites.length === 0) return
    getRecommendations()
  }, [favourites])

  const getRecommendations = async () => {
    setLoading(true)

    const savedIds = favourites.map((g) => g.gameId)
    const allSeenIds = new Set(savedIds)
    const groups = []

    for (const savedGame of favourites) {
      // Get top tags for this specific game
      const topTags = savedGame.tags
        ? savedGame.tags
            .slice(0, 8)
            .map((t) => t.id)
            .join(',')
        : ''

      // Get genres for this specific game
      const topGenres = savedGame.genres
        ? savedGame.genres.map((g) => g.id).join(',')
        : ''

      if (!topGenres && !topTags) continue

      const results = []

      // Fetch by tags if available
      if (topTags) {
        try {
          const tagRes = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&tags=${topTags}&page_size=20&ordering=-rating&metacritic=60,100`
          )
          const tagData = await tagRes.json()
          if (tagData.results) results.push(...tagData.results)
        } catch (e) {}
      }

      // Fetch by genres
      if (topGenres) {
        try {
          const genreRes = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&genres=${topGenres}&page_size=20&ordering=-rating&metacritic=60,100`
          )
          const genreData = await genreRes.json()
          if (genreData.results) results.push(...genreData.results)
        } catch (e) {}
      }

      // Deduplicate, filter out saved games and already shown games
      const seen = new Set()
      const filtered = results.filter((g) => {
        if (allSeenIds.has(g.id) || seen.has(g.id)) return false
        seen.add(g.id)
        return true
      })

      // Score each game
      const savedTagIds = new Set(savedGame.tags?.map((t) => String(t.id)) || [])
      const savedGenreIds = new Set(savedGame.genres?.map((g) => String(g.id)) || [])

      const scored = filtered.map((game) => {
        const tagScore = game.tags
          ? game.tags.filter((t) => savedTagIds.has(String(t.id))).length * 2
          : 0
        const genreScore = game.genres
          ? game.genres.filter((g) => savedGenreIds.has(String(g.id))).length
          : 0
        const ratingBoost = game.rating / 5
        const totalScore = tagScore + genreScore + ratingBoost
        return { ...game, totalScore }
      })

      scored.sort((a, b) => b.totalScore - a.totalScore)

      const top6 = scored.slice(0, 6)

      // Add these game IDs to seen so they don't appear in other groups
      top6.forEach((g) => allSeenIds.add(g.id))

      if (top6.length > 0) {
        groups.push({
          basedOn: savedGame.name,
          games: top6
        })
      }
    }

    setGroupedRecs(groups)
    setLoading(false)
  }

  if (favourites.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-10 page-fade">
        <h1 className="text-2xl font-semibold text-white mb-1">Recommended for you</h1>
        <p className="text-gray-500 text-sm">You haven't saved any games yet — go to Search and save some games you like!</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 page-fade">
      <h1 className="text-2xl font-semibold text-white mb-1">Recommended for you</h1>
      <p className="text-gray-500 text-sm mb-10">Based on your {favourites.length} saved game(s)</p>

      {loading && (
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
          Finding recommendations...
        </div>
      )}

      {groupedRecs.map((group) => (
        <div key={group.basedOn} className="mb-12">
          <p className="text-white text-xs uppercase tracking-widest mb-4">
            Because you saved <span className="text-purple-400">{group.basedOn}</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {group.games.map((game) => (
              <div
                key={game.id}
                className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer group transition-transform hover:-translate-y-1"
                onClick={() => navigate(`/game/${game.id}`)}
              >
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-28 object-cover group-hover:opacity-80 transition-opacity"
                />
                <div className="p-2">
                  <h2 className="text-white text-xs font-medium leading-tight mb-1">{game.name}</h2>
                  <p className="text-gray-500 text-xs">⭐ {game.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecommendationsPage