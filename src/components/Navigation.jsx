import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';


const Navigation = () => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toogleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    })
    return unsubscribe;
  }, [])

  const handleLinkClick = () => {
    setMenuOpen(false);
  }
  

  const renderNavLinks = (onClickHandler) => {
    if (!currentUser) {
      // 1. Pouzivatel neni prihlaseny
      return (
        <>
          <Link to="/" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Domov</Link>
          <Link to="/results" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Vyhľadávanie</Link>
          <Link to="/login" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Prihlásiť sa</Link>
          <Link to="/register" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Registrácia</Link>
        </>
      )
   } else {
    // Pouzivatel je prihlaseny
    // Skontrololujeme ci uz je email overeny
    if (currentUser.emailVerified) {
      // email je overeny
      return (
        <>
          <Link to="/" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Domov</Link>
          <Link to="/results" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Vyhľadávanie</Link>
          <Link to="/dashboard" className='pr-7 text-[#616161] cursor-pointer hover:underline' onClick={onClickHandler}>Dashboard</Link>
          <Link to="/logout" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Odhlásiť sa</Link>
        </>
      );
    } else {
      // email neni overeny
      return (
        <>
          <Link to="/" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Domov</Link>
          <Link to="/results" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Vyhľadávanie</Link>
          <Link to="/verify-email" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Over si email</Link>
          <Link to="/logout" className="pr-7 text-[#616161] hover:underline" onClick={onClickHandler}>Odhlásiť sa</Link>
        </>
      );
    }
   }
  }



  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full py-4 px-10 flex justify-between items-center z-50">
      <span className="text-2xl font-bold text-green-700">GetFit</span>

      <div className="hidden md:flex space-x-6 text-gray-700 font-bold">
      {renderNavLinks()}
      </div>

      <div className="md:hidden">
        <button onClick={toogleMenu}>{menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}</button>
      </div>

      <div
        className={`
          absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 
          md:hidden transition-all duration-300 overflow-hidden
          ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        {renderNavLinks(handleLinkClick)}
      </div>
    </nav>
  );
};

export default Navigation;
