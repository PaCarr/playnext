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

  if (loading) return <p className="text-gray-400 p-8">Loading...</p>
  if (!game) return <p className="text-gray-400 p-8">Game not found.</p>

  return (
    <div className="min-h-screen bg-gray-900">
      <div
        className="w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${game.background_image})` }}
      />
      <div className="p-8 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white mb-6 block"
        >
          ← Back
        </button>

        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-4xl font-bold text-white">{game.name}</h1>
          <button
            onClick={handleFavourite}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap ${
              isFavourite(game.id)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isFavourite(game.id) ? '♥ Saved' : '♡ Save'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Rating</p>
            <p className="text-white font-semibold">⭐ {game.rating} / 5</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Metacritic</p>
            <p className="text-white font-semibold">{game.metacritic ?? 'N/A'}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Released</p>
            <p className="text-white font-semibold">{game.released ?? 'N/A'}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Playtime</p>
            <p className="text-white font-semibold">{game.playtime} hrs avg</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Genres</h2>
          <div className="flex flex-wrap gap-2">
            {game.genres?.map((genre) => (
              <span key={genre.id} className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
                {genre.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Platforms</h2>
          <div className="flex flex-wrap gap-2">
            {game.platforms?.map(({ platform }) => (
              <span key={platform.id} className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full">
                {platform.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">About</h2>
          <p className="text-gray-400 leading-relaxed">
            {game.description_raw ?? 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default GameDetailPage