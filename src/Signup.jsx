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
            const respone = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age: parseInt(age), password })
            })

            const data = await respone.json()
            if (!respone.ok) {
                setErrors(data.errors ? data.errors[0].msg : (data.message || 'Failed to sign up'))
                return
            }
            alert('Signup successful! You can now log in.')
        } catch (err) {
            console.log(err)
            setErrors('somthing went wrong')
        }
    }

    return (
        <div>
            <h1>Sign Up</h1>
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
                    <label>Age</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
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
                <button type="submit">Sign Up</button>
            </form>
            {errors && <p style={{ color: 'red' }}>{errors}</p>}
        </div>
    )
}
export default Signup