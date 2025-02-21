import React from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

const Logout = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/')
        } catch (error) {
            console.error("Chyba pri odhlasovaní:", error);
        }
    }
  return (
    <section className="max-w-md mx-auto py-10 px-6 mt-30 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-3xl font-semibold text-green-700">Odhlásenie</h2>
      <p className="mt-4 text-gray-600">Si si istý, že sa chceš odhlásiť?</p>
      
      <button 
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-2 mt-6 w-full rounded-lg hover:bg-red-700 transition"
      >
        Odhlásiť sa
      </button>
    </section>
  )
}

export default Logout