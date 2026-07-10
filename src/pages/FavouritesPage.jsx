import { useNavigate } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'

function FavouritesPage() {
  const { favourites, removeFavourite } = useFavourites()
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 page-fade">
      <h1 className="text-2xl font-semibold text-white mb-1">Your Saved Games</h1>
      <p className="text-gray-500 text-sm mb-8">
        {favourites.length === 0
          ? 'No saved games yet'
          : `${favourites.length} game(s) saved — these are used to generate your recommendations`}
      </p>

      {favourites.length === 0 ? (
        <p className="text-gray-600 text-sm">Go to Search and save some games you enjoy!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favourites.map((game) => (
            <div
              key={game.gameId}
              className="bg-gray-800 rounded-xl overflow-hidden group"
            >
              <img
                src={game.background_image}
                alt={game.name}
                onClick={() => navigate(`/game/${game.gameId}`)}
                className="w-full h-36 object-cover cursor-pointer group-hover:opacity-80 transition-opacity"
              />
              <div className="p-3">
                <h2 className="text-white text-sm font-medium leading-tight mb-1">{game.name}</h2>
                <p className="text-gray-500 text-xs mb-3">⭐ {game.rating}</p>
                <button
                  onClick={() => removeFavourite(game.gameId)}
                  className="w-full py-1.5 rounded-lg text-xs font-medium bg-gray-700 text-gray-400 hover:bg-red-900 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FavouritesPage