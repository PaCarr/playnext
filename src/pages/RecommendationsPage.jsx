import { useState, useEffect } from 'react'
import { useFavourites } from '../context/FavouritesContext'

const API_KEY = import.meta.env.VITE_RAWG_API_KEY

function RecommendationsPage() {
  const { favourites } = useFavourites()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (favourites.length === 0) return
    getRecommendations()
  }, [favourites])

  console.log('Saved games:', favourites)

  const getRecommendations = async () => {
    setLoading(true)

    // Step 1: collect all genres from saved games
    const genreMap = {}
    favourites.forEach((game) => {
      if (game.genres) {
        game.genres.forEach((genre) => {
          genreMap[genre.id] = (genreMap[genre.id] || 0) + 1
        })
      }
    })

    // Step 2: get the top 3 most common genres
    const topGenres = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id)
      .join(',')

    if (!topGenres) {
      setLoading(false)
      return
    }

    // Step 3: fetch games matching those genres
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&genres=${topGenres}&page_size=20&ordering=-rating`
    )
    const data = await response.json()

    // Step 4: filter out already saved games
    const savedIds = favourites.map((g) => g.id)
    const filtered = data.results.filter((g) => !savedIds.includes(g.id))

    // Step 5: score each game by how many top genres it matches
    const scored = filtered.map((game) => {
      const matchCount = game.genres
        ? game.genres.filter((genre) => topGenres.includes(String(genre.id))).length
        : 0
      return { ...game, matchCount }
    })

    // Step 6: sort by match score
    scored.sort((a, b) => b.matchCount - a.matchCount)

    setRecommendations(scored)
    setLoading(false)
  }

  if (favourites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <h1 className="text-4xl font-bold text-white mb-4">🎯 Recommendations</h1>
        <p className="text-gray-400">You haven't saved any games yet. Go to search and save some games you like!</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-2">🎯 Recommendations</h1>
      <p className="text-gray-400 mb-8">Based on your {favourites.length} saved game(s)</p>

      {loading && <p className="text-gray-400">Finding recommendations...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {recommendations.map((game) => (
          <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-white font-semibold">{game.name}</h2>
              <p className="text-gray-400 text-sm mt-1">⭐ {game.rating}</p>
              <p className="text-purple-400 text-sm mt-1">🎯 {game.matchCount} genre match(es)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendationsPage