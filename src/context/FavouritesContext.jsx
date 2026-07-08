import { createContext, useContext, useState, useEffect } from 'react'

const FavouritesContext = createContext()

const API_URL = 'http://localhost:5000/api'

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([])

  // Load favourites from backend on startup
  useEffect(() => {
    fetch(`${API_URL}/favourites`)
      .then((res) => res.json())
      .then((data) => setFavourites(data))
      .catch((err) => console.log('Error loading favourites:', err))
  }, [])

  const addFavourite = async (game) => {
    const response = await fetch(`${API_URL}/favourites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        genres: game.genres,
      }),
    })
    const saved = await response.json()
    setFavourites((prev) => {
      if (prev.find((g) => g.gameId === saved.gameId)) return prev
      return [...prev, saved]
    })
  }

  const removeFavourite = async (gameId) => {
    await fetch(`${API_URL}/favourites/${gameId}`, { method: 'DELETE' })
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