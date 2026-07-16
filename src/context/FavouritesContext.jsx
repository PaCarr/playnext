import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FavouritesContext = createContext()

const API_URL = 'https://playnext-production-2b7c.up.railway.app/api'

export function FavouritesProvider({ children }) {
  const [saved, setSaved] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    fetch(`${API_URL}/favourites?userId=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        setSaved(data.filter((g) => g.listType === 'saved' || !g.listType))
        setWatchlist(data.filter((g) => g.listType === 'watchlist'))
      })
      .catch((err) => console.log('Error loading favourites:', err))
  }, [user])

  const addGame = async (game, listType) => {
    const detailsResponse = await fetch(
      `https://api.rawg.io/api/games/${game.id}?key=${import.meta.env.VITE_RAWG_API_KEY}`
    )
    const fullGame = await detailsResponse.json()

    // If marking as played, store in our own games collection
    if (listType === 'saved') {
      fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: fullGame.id,
          name: fullGame.name,
          background_image: fullGame.background_image,
          rating: fullGame.rating,
          metacritic: fullGame.metacritic,
          released: fullGame.released,
          playtime: fullGame.playtime,
          description_raw: fullGame.description_raw,
          genres: fullGame.genres,
          tags: fullGame.tags,
          developers: fullGame.developers,
          platforms: fullGame.platforms,
        })
      }).catch(() => {})
    }

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
        developers: fullGame.developers || [],
        listType,
      }),
    })
    const savedGame = await response.json()

    if (listType === 'saved') {
      setSaved((prev) => {
        if (prev.find((g) => g.gameId === savedGame.gameId)) return prev
        return [...prev, savedGame]
      })
    } else {
      setWatchlist((prev) => {
        if (prev.find((g) => g.gameId === savedGame.gameId)) return prev
        return [...prev, savedGame]
      })
    }
  }

  const addToSaved = async (game) => {
    await addGame(game, 'saved')
  }

  const addToWatchlist = async (game) => {
    await addGame(game, 'watchlist')
  }

  const removeGame = async (gameId) => {
    await fetch(`${API_URL}/favourites/${gameId}?userId=${user.uid}`, { method: 'DELETE' })
    setSaved((prev) => prev.filter((g) => g.gameId !== gameId))
    setWatchlist((prev) => prev.filter((g) => g.gameId !== gameId))
  }

  const isSaved = (gameId) => saved.some((g) => g.gameId === gameId)
  const isWatchlisted = (gameId) => watchlist.some((g) => g.gameId === gameId)

  const favourites = saved

  return (
    <FavouritesContext.Provider value={{ favourites, saved, watchlist, addToSaved, addToWatchlist, removeGame, isSaved, isWatchlisted }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  return useContext(FavouritesContext)
}