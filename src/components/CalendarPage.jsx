import React, { useEffect, useState } from 'react'
import CalendarPanel from './CalendarPanel';
import DayDetailPanel from './DayDetailPanel';
import AddFoodForm from './AddFoodForm';
import Sidebar from './Sidebar';
import { Outlet, useOutletContext } from 'react-router-dom';
import AddFluidForm from './AddFluidForm';
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import AddActivityToCalendarForm from './AddActivityToCalendarForm';

const CalendarPage = () => {
  const { nutritionGoal } = useOutletContext();
  // Mock udalostí pre testovanie
  const initialEvents = [
    {
      title: 'Raňajky: Ovsená kaša',
      start: '2025-09-01',
      extendedProps: { kcal: 350, protein: 10, fat: 5, carbs: 60, fiber: 5, fluid: 0.2, burned: 0 },
    },
    {
      title: 'Obed: Grilované kuracie prsia',
      start: '2025-09-01',
      extendedProps: { kcal: 500, protein: 30, fat: 15, carbs: 40, fiber: 2, fluid: 0.3, burned: 0 },
    },
    {
      title: 'Večera: Zeleninový šalát',
      start: '2025-09-01',
      extendedProps: { kcal: 400, protein: 15, fat: 10, carbs: 50, fiber: 4, fluid: 0.2, burned: 0 },
    },
    {
      title: 'Beh 30 minút',
      start: '2025-09-01',
      extendedProps: { kcal: -100, protein: 0, fat: 0, carbs: 0, fiber: 0, fluid: 0, burned: 100 },
    },
    {
      title: 'Raňajky: Jogurt s ovocím',
      start: '2025-02-25',
      extendedProps: { kcal: 300, protein: 12, fat: 8, carbs: 45, fiber: 3, fluid: 0.2, burned: 0 },
    },
  ];

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [fluidIntake, setFluidIntake] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      const user = auth.currentUser;
      if(!user) return;

      try {
        const q = query(
          collection(db, 'calendarEvents'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents((prev) => [...prev, ...fetchedEvents]);
      } catch (error) {
        console.error('Chyba pri načítaní udalostí:', error);
      }
    }; 
   fetchEvents() 
  }, [])
  
  useEffect(() => {
    const fetchFluidIntake = async () => {
      const user = auth.currentUser;
      if(!user) return;

      try {
        const q = query(
          collection(db, 'calendarFluids'),
          where('userId', '==', user.uid)
        )

        const querySnapshot = await getDocs(q);
        const fluidsData = {};

        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          const { date, amount } = data;
          fluidsData[date] = (fluidsData[date] || 0) + amount;
        });

        setFluidIntake(fluidsData);
      } catch (error) {
        console.error('Chyba pri načítaní údajov o tekutinách:', error);
      }
    }

    fetchFluidIntake()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      const user = auth.currentUser;
      if(!user) return;

      try {
        const q = query(
          collection(db, 'calendarActivities'),
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents((prev) => [...prev, ...fetchedEvents]);
      } catch (error) {
        console.error('Chyba pri načítaní udalostí:', error);
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const dayEvents = events.filter((e) => e.start === selectedDate);
      updateOverviewData(dayEvents);
    }
  }, [events, selectedDate, fluidIntake]);

  const updateOverviewData = (dayEvents) => {
    let sumKcal = 0, sumProtein = 0, sumFat = 0, sumCarbs = 0, sumFiber = 0, sumBurned = 0;
    dayEvents.forEach((ev) => {
      const { kcal, protein, fat, carbs, fiber, burned } = ev.extendedProps;
      sumKcal += Number(kcal) || 0;
  sumProtein += Number(protein) || 0;
  sumFat += Number(fat) || 0;
  sumCarbs += Number(carbs) || 0;
  sumFiber += Number(fiber) || 0;
  sumBurned += Number(burned) || 0;
    });

    sumKcal = Math.round(sumKcal);
    const currentFluid = fluidIntake[selectedDate] || 0;

    const aggregatedData = {
      currentKcal: Math.max(sumKcal, 0),
      goalKcal: nutritionGoal?.dailyCalories || 1500,  // Použije hodnotu z Firestore, ak existuje
      protein: { current: sumProtein, goal: nutritionGoal?.proteinGrams || 79 },
      carbs: { current: sumCarbs, goal: nutritionGoal?.carbsGrams || 192 },
      fat: { current: sumFat, goal: nutritionGoal?.fatGrams || 43 },
      fiber: { current: sumFiber, goal: nutritionGoal?.fiber || 28 },
      fluid: { current: currentFluid, goal: nutritionGoal?.fluid || 3 },
      burned: sumBurned,
    };
    setOverviewData(aggregatedData);
  }

    const handleDateClick = (info) => {
      setSelectedDate(info.dateStr);
    };


  const handleAddFood = async (newEvent) => {
    const user = auth.currentUser;
    if(!user) {
      console.error('Používateľ nie je prihlásený');
      return;
    }

    const eventToSave = {
      ...newEvent,
      type: 'food',
      userId: user.uid,
      createdAt: new Date(),
      userName: user.displayName,
    };

    try {
      const docRef = await addDoc(collection(db, 'calendarEvents'), eventToSave);
          eventToSave.id = docRef.id;
          setEvents((prev) => [...prev, eventToSave]);
    } catch (error) {
      console.error('Chyba pri pridávaní udalosti:', error);
    }
    
  }

  const handleAddActivity = async (newActivity) => {
    const user = auth.currentUser;
    if(!user) return;

    const activityToSave = {
      ...newActivity,
      type: 'activity',
      userId: user.uid,
      createdAt: new Date(),
      userName: user.displayName,
    };
    
    try {
      const docRef = await addDoc(collection(db, 'calendarActivities'), activityToSave);
          activityToSave.id = docRef.id;
          setEvents((prev) => [...prev, activityToSave]);
    } catch (error) {
      console.error('Chyba pri pridávaní udalosti:', error);
    }

  }

  const handleDeleteFood = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'calendarEvents', eventId));
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Chyba pri mazaní udalosti:', error);
    }
  }

  const handleDeleteActivity = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'calendarActivities', eventId));
      setEvents((prev) => prev.filter((event) => event.id !== eventId))

    } catch (error) {
      console.error('Chyba pri mazaní udalosti:', error);
    }
  }

  const handleDeleteEvent = async (eventId, eventType) => {
    if (eventType === 'activity') {
      await handleDeleteActivity(eventId);
    } else {
      // predpoklad: "food"
      await handleDeleteFood(eventId);
    }
  };

  const handleAddFluid = async (date, amount) => {
    const user = auth.currentUser;
    if(!user) return;

    const fluidData = {
      userId: user.uid,
      userName: user.displayName,
      date,
      amount,
      createdAt: new Date(),
    };

    try {
       const docRef = await addDoc(collection(db, 'calendarFluids'), fluidData)

       fluidData.id = docRef.id;

      setFluidIntake((prev) => ({
        ...prev,
        [date]: (prev[date] || 0) + amount,
      }))
    } catch (error) {
      console.error('Chyba pri pridávaní udalosti:', error);
    }
  }

 

  const eventsForDay = selectedDate ? events.filter((e) => e.start === selectedDate) : [];


  return (
    <div className='flex flex-col lg:flex-row gap-6 p-4'>
      
      
      <CalendarPanel events={events} onDateClick={handleDateClick} />
      <div className='w-full lg:w-1/3'>
        {selectedDate && (
          <AddFoodForm selectedDate={selectedDate} onAddFood={handleAddFood} />
          )}
          {selectedDate && (
            <>
            <AddFluidForm selectedDate={selectedDate} onAddFluid={(amount) => handleAddFluid(selectedDate, amount)} />
            <AddActivityToCalendarForm
              selectedDate={selectedDate}
              onAddActivityEvent={handleAddActivity}
            />
            </>
          )}

          
      <DayDetailPanel
        selectedDate={selectedDate}
        overviewData={overviewData}
        eventsForDay={eventsForDay}
        onDeleteEvent={handleDeleteEvent}
        />
        </div>
    </div>
  )
}

export default CalendarPage;