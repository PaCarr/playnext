import { Link, useLocation } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { favourites } = useFavourites()
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <nav className="border-b border-gray-800 px-4 md:px-8 py-4 flex items-center justify-between">
      <Link to="/" className="text-white font-semibold tracking-tight text-lg" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        PlayNext
      </Link>
      <div className="flex items-center gap-4 md:gap-8">
        <Link
          to="/"
          className={`text-xs md:text-sm font-medium transition-colors ${
            location.pathname === '/' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Search
        </Link>
        <Link
          to="/favourites"
          className={`text-xs md:text-sm font-medium transition-colors ${
            location.pathname === '/favourites' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Saved {favourites.length > 0 && `(${favourites.length})`}
        </Link>
        <Link
          to="/recommendations"
          className={`text-xs md:text-sm font-medium transition-colors ${
            location.pathname === '/recommendations' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Recs
        </Link>
        <button
          onClick={logout}
          className="text-xs md:text-sm text-gray-500 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 px-2 md:px-3 py-1.5 rounded-lg"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}

export default Navbar