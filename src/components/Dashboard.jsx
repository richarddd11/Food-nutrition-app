import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import MyActivites from './MyActivites';

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

  const [savedActivities, setSavedActivities] = useState([]);

const handleAddActivity = async (activity) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const activityData = {...activity, userId: user.uid, userName: user.displayName}
    const docRef = await addDoc(collection(db, 'activities'), activityData)

    setSavedActivities((prev) => [
      ...prev,
      { id: docRef.id, ...activity }
    ]);
  } catch (error) {
    console.error("Chyba pri načítaní aktivít:", error);
  }
};

useEffect(() => {
  const fetchActivities = async () => {
    try {
      const user = auth.currentUser;
      if(!user) return;
      const q = query(collection(db, 'activities'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q);
      const activities = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }))
      setSavedActivities(activities)
    } catch (error) {
      console.error('Vyskytla sa chyba');
    }
  }

  fetchActivities()
}, [])

const handleDeleteActivity = async (id) => {
  try {
    const activityDocRef = doc(db, 'activities', id);
    await deleteDoc(activityDocRef);
    setSavedActivities((prev) => prev.filter((act) => act.id !== id));
  } catch (error) {
    console.error('Vyskytla sa chyba');
  }
};

const handleEditActivity = async (id, updatedActivity) => {
  try {
    const updateDocActivity = doc(db, 'activities', id);
    await updateDoc(updateDocActivity, updatedActivity);
    setSavedActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, ...updatedActivity } : act))
    );
  } catch (error) {
    console.error('Vyskytla sa chyba');
  }
};

  return (
    <div className='flex flex-col lg:flex-row gap-6 p-4 mt-20'>
      <Sidebar />
      <div className="flex-1">
        {/* Tu sa vykreslia podstránky z routingu */}
        <Outlet context={{ savedFoods, handleAddCustomFood, handleDeleteFood, handleEditFood, nutritionGoal, handleEditActivity, handleAddActivity, savedActivities, handleDeleteActivity }} />
      </div>
    </div>
  )
}

export default Dashboard