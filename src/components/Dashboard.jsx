import React, { useEffect, useState } from 'react'
import CalendarPanel from './CalendarPanel';
import DayDetailPanel from './DayDetailPanel';
import AddFoodForm from './AddFoodForm';
import Sidebar from './Sidebar';

const Dashboard = () => {
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

  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState(null);
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      const dayEvents = events.filter((e) => e.start === selectedDate);
      updateOverviewData(dayEvents);
    }
  }, [events, selectedDate]);

  const updateOverviewData = (dayEvents) => {
    let sumKcal = 0, sumProtein = 0, sumFat = 0, sumCarbs = 0, sumFiber = 0, sumFluid = 0, sumBurned = 0;
    dayEvents.forEach((ev) => {
      const { kcal, protein, fat, carbs, fiber, fluid, burned } = ev.extendedProps;
      sumKcal += kcal;
      sumProtein += protein;
      sumFat += fat;
      sumCarbs += carbs;
      sumFiber += fiber;
      sumFluid += fluid;
      sumBurned += burned;
    });

    const aggregatedData = {
      currentKcal: Math.max(sumKcal, 0),
      goalKcal: 1500,
      protein: { current: sumProtein, goal: 79 },
      carbs: { current: sumCarbs, goal: 192 },
      fat: { current: sumFat, goal: 43 },
      fiber: { current: sumFiber, goal: 28 },
      fluid: { current: parseFloat(sumFluid.toFixed(1)), goal: 1.2 },
      burned: sumBurned,
    };
    setOverviewData(aggregatedData);
  }

    const handleDateClick = (info) => {
      setSelectedDate(info.dateStr);
    };


  const handleAddFood = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  }

  const eventsForDay = selectedDate ? events.filter((e) => e.start === selectedDate) : [];


  return (
    <div className='flex flex-col lg:flex-row gap-6 p-4 mt-20'>
      <Sidebar />
      <CalendarPanel events={events} onDateClick={handleDateClick} />
      <div className='w-full lg:w-1/3'>
        {selectedDate && (
          <AddFoodForm selectedDate={selectedDate} onAddFood={handleAddFood} />
        )}
      <DayDetailPanel
        selectedDate={selectedDate}
        overviewData={overviewData}
        eventsForDay={eventsForDay}
        />
        </div>
    </div>
  )
}

export default Dashboard