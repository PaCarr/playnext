import { useState, useEffect } from 'react'
import { useFavourites } from '../context/FavouritesContext'
import { useNavigate } from 'react-router-dom'

const API_KEY = import.meta.env.VITE_RAWG_API_KEY

function RecommendationsPage() {
  const { favourites } = useFavourites()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [availableGenres, setAvailableGenres] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (favourites.length === 0) return
    getRecommendations()
  }, [favourites])

  const getRecommendations = async () => {
    setLoading(true)

    //collect all genres from saved games
    const genreMap = {}
    favourites.forEach((game) => {
      if (game.genres) {
        game.genres.forEach((genre) => {
          genreMap[genre.id] = (genreMap[genre.id] || 0) + 1
        })
      }
    })

    //get the top 3 most common genres
    const topGenres = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id)
      .join(',')

    if (!topGenres) {
      setLoading(false)
      return
    }

    //fetch games matching those genres
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&genres=${topGenres}&page_size=40&ordering=-rating&metacritic=60,100`
    )
    const data = await response.json()

    // Step 4: filter out already saved games
    const savedIds = favourites.map((g) => g.gameId)
    const filtered = data.results.filter((g) => !savedIds.includes(g.id))

    // Step 5: score each game by how many top genres it matches
    const scored = filtered.map((game) => {
      const matchCount = game.genres
        ? game.genres.filter((genre) => topGenres.includes(String(genre.id))).length
        : 0
      return { ...game, matchCount }
    })

    //sort by match score
    scored.sort((a, b) => b.matchCount - a.matchCount)

    //collect all unique genres from results for the filter
    const allGenres = []
    scored.forEach((game) => {
      game.genres?.forEach((genre) => {
        if (!allGenres.find((g) => g.id === genre.id)) {
          allGenres.push(genre)
        }
      })
    })
    setAvailableGenres(allGenres)
    setRecommendations(scored)
    setLoading(false)
  }

  // Filter recommendations by selected genre
  const filtered = selectedGenre === 'All'
    ? recommendations
    : recommendations.filter((game) =>
        game.genres?.some((g) => g.name === selectedGenre)
      )

  if (favourites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <h1 className="text-4xl font-bold text-white mb-4"> Recommendations</h1>
        <p className="text-gray-400">You haven't saved any games yet. Go to search and save some games you like!</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-semibold text-white mb-1">Recommended for you</h1>
      <p className="text-gray-500 text-sm mb-6">Based on your {favourites.length} saved game(s)</p>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedGenre('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            selectedGenre === 'All'
              ? 'bg-white text-gray-900'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          All
        </button>
        {availableGenres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedGenre === genre.name
                ? 'bg-white text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500 text-sm">Finding recommendations...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((game) => (
          <div
            key={game.id}
            className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => navigate(`/game/${game.id}`)}
          >
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-36 object-cover group-hover:opacity-80 transition-opacity"
            />
            <div className="p-3">
              <h2 className="text-white text-sm font-medium leading-tight mb-1">{game.name}</h2>
              <p className="text-gray-500 text-xs mb-1">⭐ {game.rating}</p>
              <p className="text-gray-600 text-xs"> {game.matchCount} genre match(es)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendationsPage