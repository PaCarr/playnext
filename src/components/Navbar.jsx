import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'

function Navbar() {
  const { favourites } = useFavourites()

  return (
    <nav className="bg-gray-800 px-8 py-4 flex items-center justify-between">
      <Link to="/" className="text-white text-xl font-bold">🎮 PlayNext</Link>
      <div className="flex gap-6">
        <Link to="/" className="text-gray-300 hover:text-white">Search</Link>
        <Link to="/recommendations" className="text-gray-300 hover:text-white">
          Recommendations {favourites.length > 0 && `(${favourites.length})`}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar