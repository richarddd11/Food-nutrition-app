import React from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase';

const VerifyEmail = () => {
    const navigate = useNavigate()

    const handleCheckVerification = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload()

            if (auth.currentUser.emailVerified) {
                navigate('/dashboard');
            } else {
                alert('Email ešte nie je overený. Skontroluj schránku a skús znovu.');
            }
        }
    }
  return (
    <section className="pt-20 mt-30 max-w-md mx-auto py-10 px-6 bg-white shadow-lg rounded-lg">
    <h2 className="text-3xl font-semibold text-center text-green-700">Overenie emailu</h2>
    <p className="mt-4 text-center">
      Na tvoj email bol odoslaný overovací odkaz. Prosím otvor si email, klikni na overovací link a potom sa vráť sem.
    </p>
    <button
      onClick={handleCheckVerification}
      className="bg-green-600 text-white px-6 py-2 mt-6 w-full rounded-lg hover:bg-green-700"
    >
      Skontrolovať, či som email potvrdil
    </button>
  </section>
  )
}

export default VerifyEmail