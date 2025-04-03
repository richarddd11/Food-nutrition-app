import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Sekcia: Brand */}
        <div>
          <h3 className="text-2xl font-bold text-green-400 mb-3">GetFit</h3>
          <p className="text-gray-400">
            Sleduj svoju výživu, hydratuj sa a dosiahni svoje ciele – jednoducho a prehľadne.
          </p>
        </div>

        {/* Sekcia: Navigácia */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Navigácia</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-green-400 transition">Domov</Link></li>
            <li><Link to="/results" className="hover:text-green-400 transition">Vyhľadávanie</Link></li>
            <li className='m-0'><Link to="/dashboard" className="hover:text-green-400 transition">Dashboard</Link></li>
          </ul>
        </div>

        {/* Sekcia: Právne */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Informácie</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/terms" className="hover:text-green-400 transition">Podmienky</Link></li>
            <li><Link to="/privacy" className="hover:text-green-400 transition">Ochrana súkromia</Link></li>
            <li><Link to="/register" className="hover:text-green-400 transition">Registrácia</Link></li>
            <li className='m-0'><Link to="/login" className="hover:text-green-400 transition">Prihlásenie</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        &copy; {currentYear} GetFit. Všetky práva vyhradené.
      </div>
    </footer>
  );
};

export default Footer;
