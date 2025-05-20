import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../config/firebase';


const Header = () => {
  const navigate = useNavigate()
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user && user.emailVerified);
    })

    return () => unsubscribe();
  })

  return (
    <header className="w-full text-center py-20 bg-gradient-to-r from-green-300 to-green-500 text-white pt-30">
      <h1 className="text-5xl font-bold">Zdravý život je jednoduchý</h1>
      <p className="text-lg mt-4">Nájdite tie najlepšie jedlá, ktoré zodpovedajú vášmu životnému štýlu</p>

      {!userLoggedIn && (
      <button onClick={() => navigate('/register')} className="mt-6 px-6 py-3 bg-white text-green-600 rounded-lg shadow-lg hover:shadow-xl transition">
        Zaregistrovať sa
      </button>
      )}
    </header>
  );
};

export default Header;
