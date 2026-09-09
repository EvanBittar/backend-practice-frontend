import { useState } from 'react'

function Signup() {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [age, setAge] = useState('')
    const [errors, setErrors] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors('')

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age: parseInt(age), password })
            })

            const data = await response.json()
            if (!response.ok) {
                setErrors(data.errors ? data.errors[0].msg : (data.message || 'Failed to sign up'))
                return
            }
            alert('Signup successful! You can now log in.')
        } catch (err) {
            console.log(err)
            setErrors('Something went wrong')
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h1>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
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
                    Sign Up
                </button>
            </form>
            {errors && <p className="mt-3 text-sm text-red-600">{errors}</p>}
        </div>
    )
}

export default Signup