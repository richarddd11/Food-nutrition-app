import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toogleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full py-4 px-10 flex justify-between items-center z-50">
      <span className="text-2xl font-bold text-green-700">GetFit</span>
      <div className="hidden md:flex space-x-6 text-gray-700 font-bold">
      <Link to="/" className='pr-7 text-[#616161] cursor-pointer hover:underline'>Domov</Link>
          <Link to="/results" className='pr-7 text-[#616161] cursor-pointer hover:underline'>Vyhľadavanie</Link>
          <Link to="/dashboard" className='pr-7 text-[#616161] cursor-pointer hover:underline'>Dashboard</Link>
          <Link to="/profile" className='pr-7 text-[#616161] cursor-pointer hover:underline'>Profil</Link>
      </div>

      <div className="md:hidden">
        <button onClick={toogleMenu}>{menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}</button>
      </div>

      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <Link 
          to="/" 
          className='text-[#616161] cursor-pointer hover:underline'
          onClick={() => setMenuOpen(false)}
        >
          Domov
        </Link>
        <Link 
          to="/results" 
          className='text-[#616161] cursor-pointer hover:underline'
          onClick={() => setMenuOpen(false)}
        >
          Vyhľadavanie
        </Link>
        <Link 
          to="/dashboard" 
          className='text-[#616161] cursor-pointer hover:underline'
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </Link>
        <Link 
          to="/profile" 
          className='text-[#616161] cursor-pointer hover:underline'
          onClick={() => setMenuOpen(false)}
        >
          Profil
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
