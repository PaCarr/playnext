import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'

function FavouritesPage() {
  const { saved, watchlist, removeGame } = useFavourites()
  const [activeTab, setActiveTab] = useState('played')
  const navigate = useNavigate()

  const displayGames = activeTab === 'played' ? saved : watchlist

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 page-fade">
      <h1 className="text-2xl font-semibold text-white mb-1">Your Games</h1>
      <p className="text-gray-500 text-sm mb-8">
        {saved.length} played · {watchlist.length} want to play
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab('played')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'played'
              ? 'bg-white text-gray-900'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Played ({saved.length})
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'watchlist'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Want to Play ({watchlist.length})
        </button>
      </div>

      {displayGames.length === 0 ? (
        <p className="text-gray-600 text-sm">
          {activeTab === 'played'
            ? 'No played games yet — go to Search and mark games you have played!'
            : 'No games on your want to play list yet!'}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayGames.map((game) => (
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
                  onClick={() => removeGame(game.gameId)}
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