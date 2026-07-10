import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'

const API_KEY = import.meta.env.VITE_RAWG_API_KEY

function SearchPage() {
  const [query, setQuery] = useState('')
  const [games, setGames] = useState([])
  const [popularGames, setPopularGames] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const { addFavourite, removeFavourite, isFavourite } = useFavourites()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPopular = async () => {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-rating&page_size=8&metacritic=80,100`
      )
      const data = await response.json()
      setPopularGames(data.results)
    }
    fetchPopular()
  }, [])

  const searchGames = async () => {
    if (!query) return
    setLoading(true)
    setHasSearched(true)
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=12`
    )
    const data = await response.json()
    setGames(data.results)
    setLoading(false)
  }

  const handleFavourite = (e, game) => {
    e.stopPropagation()
    if (isFavourite(game.id)) {
      removeFavourite(game.id)
    } else {
      addFavourite(game)
    }
  }

  const displayGames = hasSearched ? games : popularGames
  const isPopular = !hasSearched

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 page-fade">
      <h1 className="text-2xl font-semibold text-white mb-1">Find your next game</h1>
      <p className="text-gray-500 text-sm mb-6">Search for games you enjoy and save them to get recommendations</p>

      <div className="flex gap-3 mb-10">
        <input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchGames()}
          className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-white text-base border border-gray-700 focus:outline-none focus:border-gray-500 placeholder-gray-500"
        />
        <button
          onClick={searchGames}
          className="px-5 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Search
        </button>
      </div>

      {isPopular && (
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Top Rated Games</p>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
          Searching...
        </div>
      )}

      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${isPopular ? 'opacity-70' : ''}`}>
        {displayGames.map((game) => (
          <div
            key={game.id}
            className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => navigate(`/game/${game.id}`)}
          >
            <div className="relative">
              <img
                src={game.background_image}
                alt={game.name}
                className="w-full h-36 object-cover group-hover:opacity-80 transition-opacity"
              />
            </div>
            <div className="p-3">
              <h2 className="text-white text-sm font-medium leading-tight mb-1">{game.name}</h2>
              <p className="text-gray-500 text-xs mb-2">⭐ {game.rating}</p>
              {!isPopular && (
                <button
                  onClick={(e) => handleFavourite(e, game)}
                  className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isFavourite(game.id)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  {isFavourite(game.id) ? '♥ Saved' : '♡ Save'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchPage