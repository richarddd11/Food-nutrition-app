import React from 'react';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full py-4 px-10 flex justify-between items-center z-50">
      <span className="text-2xl font-bold text-green-700">GetFit</span>
      <div className="flex space-x-6 text-gray-700">
        <a href="/" className="hover:text-green-500 transition">Domov</a>
        <a href="/search" className="hover:text-green-500 transition">Vyhľadávanie</a>
        <a href="/dashboard" className="hover:text-green-500 transition">Dashboard</a>
        <a href="/profile" className="hover:text-green-500 transition">Profil</a>
      </div>
    </nav>
  );
};

export default Navigation;
