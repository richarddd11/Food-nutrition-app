import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const ProtectedRoute = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        })

        return () => unsubscribe();
    }, [])

    if (loading) return <p>Načítavam...</p>

    if (!currentUser || !currentUser.emailVerified) {
        return <Navigate to='/login' />
    }

    
  return children;
}

export default ProtectedRoute