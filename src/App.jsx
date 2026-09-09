import { useState } from 'react'
import UsersList from './UsersList'
import Signup from './Signup'

function App() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [showSignup, setShowSignup] = useState(false)

  const handleLogout = async () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password })
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.errors ? data.errors[0].msg : data.message)
        return
      }
      setToken(data.token)
      localStorage.setItem('token', data.token)
    } catch (error) {
      console.log(error)
      setError('Something went wrong')
    }
  }

  if (token) {
    return <UsersList token={token} onLogout={handleLogout} />
  }

  if (showSignup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <Signup />
          <button
            onClick={() => setShowSignup(false)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          onClick={() => setShowSignup(true)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Need an account? Sign up
        </button>
      </div>
    </div>
  )
}

export default App