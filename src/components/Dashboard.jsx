import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const Dashboard = () => {
  const [savedFoods, setSavedFoods] = useState([]);
  const [nutritionGoal, setNutritiongoal] = useState(null);

  useEffect(() => {
    const fetchNutritionGoal = async () => {
      const user = auth.currentUser;
      if(!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
          setNutritiongoal(docSnap.data());
        }
      } catch (error) {
        console.error("Chyba pri načítaní nutričných údajov:", error);
      }
    }
    fetchNutritionGoal();
  }, [])

  const handleDeleteFood = async (id) => {
    try {
      // Získame referenciu na dokument, ktorý chceme odstrániť
      const foodDocRef = doc(db, 'foods', id);
       // Odstránime dokument z Firestore
      await deleteDoc(foodDocRef);
      // Aktualizujeme lokálny stav - vyfiltrujeme jedlo, ktoré bolo zmazané
      setSavedFoods((prev) => prev.filter((food) => food.id !== id));
    } catch (error) {
      console.error("Chyba pri mazaní jedla z Firestore:", error);
    }
  }

  const handleEditFood = async (id, updatedFood) => {
    try {
      // Získame referenciu na dokument v kolekcii "foods"
      const foodDocRef = doc(db, 'foods', id);
      // Aktualizujeme dokument vo Firestore s novými hodnotami
      await updateDoc(foodDocRef, updatedFood);
      setSavedFoods((prev) => 
         prev.map((food) =>
            food.id === id ? { ...food, ...updatedFood } : food
          )
      )
    } catch (error) {
      console.error("Chyba pri úprave jedla vo Firestore:", error);
    }
  }

  const handleAddCustomFood = async (food) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('Používateľ nie je prihlásený');
        return;
      }

      // Pridanie do objektu aj ID používateľa a čas vytvorenia
      const foodData = { ...food, userId: user.uid, userName: user.displayName, createdAt: new Date() }

      // Uložíme jedlo do kolekcie "foods"
      const docRef = await addDoc(collection(db, "foods"), foodData);
      console.log("Jedlo pridané s ID:", docRef.id);

      setSavedFoods((prev) => [...prev, { id: docRef.id, ...foodData }])
    } catch (error) {
      console.error("Chyba pri pridávaní jedla:", error);
    }
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const user = auth.currentUser;
        if(!user) return;
        const q = query(collection(db, 'foods'), where('userId', '==', user.uid))
        const querySnapshot = await getDocs(q);
        const foods = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }));
        setSavedFoods(foods);
      } catch (error) {
        console.error("Chyba pri načítaní jedál:", error);
      }
    }

    fetchFoods();
  }, []);
  return (
    <div className='flex flex-col lg:flex-row gap-6 p-4 mt-20'>
      <Sidebar />
      <div className="flex-1">
        {/* Tu sa vykreslia podstránky z routingu */}
        <Outlet context={{ savedFoods, handleAddCustomFood, handleDeleteFood, handleEditFood, nutritionGoal }} />
      </div>
    </div>
  )
}

export default Dashboard