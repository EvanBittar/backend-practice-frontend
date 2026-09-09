import { useState } from 'react'
import UsersList from './UsersList'
import Signup from './Signup'
import Login from './Login'
import { Route, Routes, Navigate } from 'react-router-dom'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  const handleLogout =  () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <Routes>
      <Route path='/login' element={<Login setToken={setToken} />} />
      <Route path='/signup' element={<Signup  />} />
      <Route
      path='/users'
      element={token ? <UsersList token={token} onLogout={handleLogout} /> :  <Navigate to="/login" />}
      />
      <Route path='*' element={<Navigate to={token ? "/users" : "/login"} />} />
    </Routes>
  )
}

export default App