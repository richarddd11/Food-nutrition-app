import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase' 

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard')
        } catch (err) {
            setError('Chyba pri prihlasovaní: ' + err.message);
        }
    }
  return (
    <section className="max-w-md mx-auto py-10 px-6 mt-30 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-green-700">Prihlásenie</h2>
      {error && <p className="text-red-600 text-center mt-2">{error}</p>}

      <form onSubmit={handleLogin} className="mt-4">
        <label className="block mt-2">Email</label>
        <input value={email}
        onChange={(e) => setEmail(e.target.value)}
         type="email" placeholder="Email" className="border border-gray-300 rounded-lg px-4 py-2 w-full" />

        <label className="block mt-2">Heslo</label>
        <input value={password}
        onChange={(e) => setPassword(e.target.value)}
         type="password" placeholder="Heslo" className="border border-gray-300 rounded-lg px-4 py-2 w-full" />

        <button 
          type="submit" 
          className="bg-green-600 text-white px-6 py-2 mt-4 w-full rounded-lg hover:bg-green-700"
        >
          Prihlásiť sa
        </button>
      </form>
    </section>
  )
}

export default Login