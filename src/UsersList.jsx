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
                const response = await fetch('http://localhost:3000/users', {
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
            const response = await fetch(`http://localhost:3000/users/${id}`, {
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
            const response = await fetch(`http://localhost:3000/users/${id}`, {
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

    if (error) return <p style={{ color: 'red' }}>{error}</p>

    return (
        <div>
            <h2>Users</h2>
            <button onClick={onLogout}>Log Out</button>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {editingId === user.id ? (
                            <>
                                <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                                <input type="number" value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                                <button onClick={() => handleUpdate(user.id)}>Save</button>
                                <button onClick={cancelEditing}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {user.name} — age {user.age}
                                <button onClick={() => startEditing(user)}>Edit</button>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UsersList