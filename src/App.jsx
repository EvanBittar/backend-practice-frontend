import { useState } from 'react'
import UsersList from './UsersList'
import Signup from './Signup'

function App() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setError] = useState('')
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
    } catch (err) {
      console.log(err)
      setError('Something went wrong')
    }
  }
  if (token) {
    return <UsersList token={token} onLogout={handleLogout} />
  }
  if (showSignup) {
    return (
      <div>
        <Signup />
        <button onClick={() => setShowSignup(false)}>Back to Login</button>
      </div>
    )
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      {errors && <p style={{ color: 'red' }}>{errors}</p>}
      <button onClick={() => setShowSignup(true)}>Need an account? Sign up</button>
    </div>
  )
}

export default App