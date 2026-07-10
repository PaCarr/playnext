import { describe, it, expect } from 'vitest'

// This is the scoring function extracted from RecommendationsPage
function getMatchCount(game, topGenreIds) {
  if (!game.genres) return 0
  return game.genres.filter((genre) => topGenreIds.includes(String(genre.id))).length
}

describe('Recommendation scoring', () => {
  it('returns 0 when game has no genres', () => {
    const game = { name: 'Test Game', genres: [] }
    const topGenreIds = ['4', '51']
    expect(getMatchCount(game, topGenreIds)).toBe(0)
  })

  it('returns 0 when no genres match', () => {
    const game = { name: 'Test Game', genres: [{ id: 99, name: 'Sports' }] }
    const topGenreIds = ['4', '51']
    expect(getMatchCount(game, topGenreIds)).toBe(0)
  })

  it('returns correct count when some genres match', () => {
    const game = {
      name: 'Test Game',
      genres: [{ id: 4, name: 'Action' }, { id: 99, name: 'Sports' }]
    }
    const topGenreIds = ['4', '51']
    expect(getMatchCount(game, topGenreIds)).toBe(1)
  })

  it('returns correct count when all genres match', () => {
    const game = {
      name: 'Test Game',
      genres: [{ id: 4, name: 'Action' }, { id: 51, name: 'Indie' }]
    }
    const topGenreIds = ['4', '51']
    expect(getMatchCount(game, topGenreIds)).toBe(2)
  })

  it('returns 0 when genres is undefined', () => {
    const game = { name: 'Test Game' }
    const topGenreIds = ['4', '51']
    expect(getMatchCount(game, topGenreIds)).toBe(0)
  })
})