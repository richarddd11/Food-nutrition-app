import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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

      <div className="bg-gray-100 p-4 rounded-md mt-6 text-sm text-gray-700">
          <p className="font-semibold mb-1">Demo účet:</p>
          <p>Email: <span className="text-blue-600">exampleuseruser1@gmail.com</span></p>
          <p>Heslo: <span className="text-blue-600">exampleUser1</span></p>
        </div>

      <form onSubmit={handleLogin} className="mt-4">
        <input value={email}
        onChange={(e) => setEmail(e.target.value)}
         type="email" placeholder="Email" className="border border-gray-300 rounded-lg px-4 py-2 w-full" />

        <input value={password}
        onChange={(e) => setPassword(e.target.value)}
         type="password" placeholder="Heslo" className="border mt-4 border-gray-300 rounded-lg px-4 py-2 w-full" />

        <button 
          type="submit" 
          className="bg-green-600 text-white px-6 py-2 mb-3 mt-4 w-full rounded-lg hover:bg-green-700"
        >
          Prihlásiť sa
        </button>

        <Link to='/register' className="text-blue-600 underline">Nemáš ešte účet ? Vytvor si ho</Link>
      </form>
    </section>
  )
}

export default Login