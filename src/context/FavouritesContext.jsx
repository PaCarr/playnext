import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FavouritesContext = createContext()

const API_URL = 'https://playnext-production-2b7c.up.railway.app/api'

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    fetch(`${API_URL}/favourites?userId=${user.uid}`)
      .then((res) => res.json())
      .then((data) => setFavourites(data))
      .catch((err) => console.log('Error loading favourites:', err))
  }, [user])

const addFavourite = async (game) => {
    // Fetch full game details including tags
    const detailsResponse = await fetch(
      `https://api.rawg.io/api/games/${game.id}?key=${import.meta.env.VITE_RAWG_API_KEY}`
    )
    const fullGame = await detailsResponse.json()

    const response = await fetch(`${API_URL}/favourites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.uid,
        gameId: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        genres: fullGame.genres || game.genres,
        tags: fullGame.tags || [],
      }),
    })
    const saved = await response.json()
    setFavourites((prev) => {
      if (prev.find((g) => g.gameId === saved.gameId)) return prev
      return [...prev, saved]
    })
  }

  const removeFavourite = async (gameId) => {
    await fetch(`${API_URL}/favourites/${gameId}?userId=${user.uid}`, { method: 'DELETE' })
    setFavourites((prev) => prev.filter((g) => g.gameId !== gameId))
  }

  const isFavourite = (gameId) => {
    return favourites.some((g) => g.gameId === gameId)
  }

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  return useContext(FavouritesContext)
}