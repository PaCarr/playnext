import { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Branding */}
        <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>PlayNext</h1>
          <p className="text-gray-500 text-sm">Discover your next favourite game</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-1">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {isSignUp ? 'Sign up to save games and get recommendations' : 'Sign in to your PlayNext account'}
          </p>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm border border-gray-700 focus:outline-none focus:border-gray-500 placeholder-gray-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm border border-gray-700 focus:outline-none focus:border-gray-500 placeholder-gray-600"
            />
          </div>

          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full mt-5 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isSignUp ? 'Sign up' : 'Sign in'}
          </button>

          <p className="text-gray-500 text-sm mt-4 text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}

export default LoginPage