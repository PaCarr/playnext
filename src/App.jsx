import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SearchPage from './pages/SearchPage'
import RecommendationsPage from './pages/RecommendationsPage'
import GameDetailPage from './pages/GameDetailPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/game/:id" element={<GameDetailPage />} />
      </Routes>
    </div>
  )
}

export default App