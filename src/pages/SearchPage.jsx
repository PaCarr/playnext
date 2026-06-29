import { useState } from 'react'
import { useFavourites } from '../context/FavouritesContext'

const API_KEY = import.meta.env.VITE_RAWG_API_KEY

function SearchPage() {
  const [query, setQuery] = useState('')
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(false)
  const { addFavourite, removeFavourite, isFavourite } = useFavourites()

  const searchGames = async () => {
    if (!query) return
    setLoading(true)
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=12`
    )
    const data = await response.json()
    setGames(data.results)
    setLoading(false)
  }

  const handleFavourite = (game) => {
    if (isFavourite(game.id)) {
      removeFavourite(game.id)
    } else {
      addFavourite(game)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">🎮 PlayNext</h1>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Search for a game..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
        />
        <button
          onClick={searchGames}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-400">Searching...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {games.map((game) => (
          <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-white font-semibold">{game.name}</h2>
              <p className="text-gray-400 text-sm mt-1">⭐ {game.rating}</p>
              <button
                onClick={() => handleFavourite(game)}
                className={`mt-3 w-full py-2 rounded-lg text-sm font-medium ${
                  isFavourite(game.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {isFavourite(game.id) ? '♥ Saved' : '♡ Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchPage