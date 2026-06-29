import { createContext, useContext, useState } from 'react'

const FavouritesContext = createContext()

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([])

  const addFavourite = (game) => {
    setFavourites((prev) => {
      if (prev.find((g) => g.id === game.id)) return prev
      return [...prev, game]
    })
  }

  const removeFavourite = (gameId) => {
    setFavourites((prev) => prev.filter((g) => g.id !== gameId))
  }

  const isFavourite = (gameId) => {
    return favourites.some((g) => g.id === gameId)
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