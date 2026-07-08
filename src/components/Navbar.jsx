import { Link, useLocation } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'

function Navbar() {
  const { favourites } = useFavourites()
  const location = useLocation()

  return (
    <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <Link to="/" className="text-white font-semibold tracking-tight text-lg">
        PlayNext
      </Link>
      <div className="flex gap-8">
        <Link
          to="/"
          className={`text-sm font-medium transition-colors ${
            location.pathname === '/'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Search
        </Link>
        <Link
          to="/recommendations"
          className={`text-sm font-medium transition-colors ${
            location.pathname === '/recommendations'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Recommendations {favourites.length > 0 && `(${favourites.length})`}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar