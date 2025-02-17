import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full py-4 px-10 flex justify-between items-center z-50">
      <span className="text-2xl font-bold text-green-700">GetFit</span>
      <div className="flex space-x-6 text-gray-700">
      <Link to="/" className='pr-7 text-[#616161] cursor-pointer hover:underline'>Domov</Link>
          <Link to="/results" className='pr-7 text-[#616161] cursor-pointer hover:underline'>Vyhľadavanie</Link>
          {/* Ak budeš mať ďalšie stránky, pridaj aj Link pre Dashboard a Profil */}
          <Link to="/dashboard" className='pr-7 text-[#616161] cursor-pointer hover:underline'>Dashboard</Link>
          <Link to="/profile" className='pr-7 text-[#616161] cursor-pointer hover:underline'>Profil</Link>
      </div>
    </nav>
  );
};

export default Navigation;
