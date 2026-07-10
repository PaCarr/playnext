import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useFavourites } from '../context/FavouritesContext'

const API_KEY = import.meta.env.VITE_RAWG_API_KEY

function GameDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addFavourite, removeFavourite, isFavourite } = useFavourites()

  useEffect(() => {
    const fetchGame = async () => {
      const response = await fetch(
        `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
      )
      const data = await response.json()
      setGame(data)
      setLoading(false)
    }
    fetchGame()
  }, [id])

  const handleFavourite = () => {
    if (isFavourite(game.id)) {
      removeFavourite(game.id)
    } else {
      addFavourite(game)
    }
  }

  if (loading) return <p className="text-gray-500 text-sm p-8">Loading...</p>
  if (!game) return <p className="text-gray-500 text-sm p-8">Game not found.</p>

  return (
    <div className="min-h-screen">
      <div
        className="w-full h-72 bg-cover bg-center"
        style={{ backgroundImage: `url(${game.background_image})` }}
      >
        <div className="w-full h-full bg-black/50 flex items-end">
          <div className="max-w-6xl mx-auto px-8 pb-6 w-full flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white">{game.name}</h1>
              <p className="text-gray-300 text-sm mt-1">⭐ {game.rating} / 5</p>
            </div>
            <button
              onClick={handleFavourite}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isFavourite(game.id)
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isFavourite(game.id) ? '♥ Saved' : '♡ Save game'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 overflow-x-hidden page-fade">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-300 text-sm mb-8 block transition-colors"
        >
          ← Back
        </button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-xl">
            <p className="text-gray-500 text-xs mb-1">Metacritic</p>
            <p className="text-white font-medium">{game.metacritic ?? 'N/A'}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl">
            <p className="text-gray-500 text-xs mb-1">Released</p>
            <p className="text-white font-medium">{game.released ?? 'N/A'}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl">
            <p className="text-gray-500 text-xs mb-1">Playtime</p>
            <p className="text-white font-medium">{game.playtime} hrs avg</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl">
            <p className="text-gray-500 text-xs mb-1">Rating</p>
            <p className="text-white font-medium">⭐ {game.rating} / 5</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-white font-medium mb-3">About</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {game.description_raw ?? 'No description available.'}
            </p>
          </div>
          <div>
            <div className="mb-6">
              <h2 className="text-white font-medium mb-3">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {game.genres?.map((genre) => (
                  <span key={genre.id} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-lg">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-white font-medium mb-3">Platforms</h2>
              <div className="flex flex-wrap gap-2">
                {game.platforms?.map(({ platform }) => (
                  <span key={platform.id} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-lg">
                    {platform.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDetailPage