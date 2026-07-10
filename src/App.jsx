import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import SearchPage from './pages/SearchPage'
import RecommendationsPage from './pages/RecommendationsPage'
import GameDetailPage from './pages/GameDetailPage'
import FavouritesPage from './pages/FavouritesPage'
import LoginPage from './pages/LoginPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return children
}

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-900">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/favourites" element={<ProtectedRoute><FavouritesPage /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
        <Route path="/game/:id" element={<ProtectedRoute><GameDetailPage /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App