import { useState, useEffect } from 'react'

function UsersList({ token , onLogout}) {
    const [users, setUsers] = useState([])
    const [error, setError] = useState('')

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

    if (error) return <p style={{ color: 'red' }}>{error}</p>

    return (
        <div>
            <h2>Users</h2>
            <button onClick={onLogout}>Log Out</button>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} — age {user.age}</li>
                ))}
            </ul>
        </div>
    )
}

export default UsersList