import { useState, useEffect } from 'react'

function UsersList({ token, onLogout }) {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [editingId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAge, setEditAge] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Failed to load users')
          return
        }

        setUsers(data)
      } catch (err) {
        console.error(err)
        setError('Something went wrong')
      }
    }

    fetchUsers()
  }, [token])

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Failed to delete user')
        return
      }
      setUsers(users.filter(user => user.id !== id))
    } catch (err) {
      console.log(err)
      setError('Something went wrong')
    }
  }

  const startEditing = (user) => {
    setEditId(user.id)
    setEditName(user.name)
    setEditAge(user.age)
  }

  const cancelEditing = () => {
    setEditId(null)
  }

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName, age: parseInt(editAge) })
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.errors ? data.errors[0].msg : data.message)
        return
      }
      setUsers(users.map(user =>
        user.id === id ? { ...user, name: editName, age: parseInt(editAge) } : user
      ))
      setEditId(null)
    } catch (err) {
      console.log(err)
      setError('Something went wrong')
    }
  }

  if (error) return <p className='text-red-600 p-4'>{error}</p>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Users</h2>
          <button
            onClick={onLogout}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Log Out
          </button>
        </div>
        <ul className="space-y-3">
          {users.map(user => (
            <li key={user.id} className="flex items-center justify-between border border-gray-200 rounded-md p-3">
              {editingId === user.id ? (
                <div className="flex flex-1 gap-2 items-center">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 flex-1"
                  />
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 w-20"
                  />
                  <button
                    onClick={() => handleUpdate(user.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-800">{user.name} — age {user.age}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(user)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UsersList