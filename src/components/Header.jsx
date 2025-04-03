import React from 'react';
import { useNavigate, Link } from 'react-router-dom'


const Header = () => {

  const navigate = useNavigate()

  return (
    <header className="w-full text-center py-20 bg-gradient-to-r from-green-300 to-green-500 text-white">
      <h1 className="text-5xl font-bold">Zdravý život je jednoduchý</h1>
      <p className="text-lg mt-4">Nájdite tie najlepšie jedlá, ktoré zodpovedajú vášmu životnému štýlu</p>
      <button onClick={() => navigate('/register')} className="mt-6 px-6 py-3 bg-white text-green-600 rounded-lg shadow-lg hover:shadow-xl transition">
        Sign Up
      </button>
    </header>
  );
};

export default Header;
