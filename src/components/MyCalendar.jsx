// MyCalendar.jsx
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import DailyNutritionOverview from './DailyNutritionOverview';

// Ukážkové udalosti. Každá môže mať svoje makrá, vlákninu, tekutiny, spálené kalórie, atď.
// Alebo si to rozdelíte na viac udalostí a pri kliknutí na deň ich agregujete.
const events = [
  {
    title: 'Raňajky: Ovsená kaša',
    start: '2025-09-01',
    extendedProps: {
      kcal: 350,
      protein: 10,
      fat: 5,
      carbs: 60,
      fiber: 5,
      fluid: 0.2,   // 0.2 litra
      burned: 0,
    },
  },
  {
    title: 'Obed: Grilované kuracie prsia',
    start: '2025-09-01',
    extendedProps: {
      kcal: 500,
      protein: 30,
      fat: 15,
      carbs: 40,
      fiber: 2,
      fluid: 0.3,
      burned: 0,
    },
  },
  {
    title: 'Večera: Zeleninový šalát',
    start: '2025-09-01',
    extendedProps: {
      kcal: 400,
      protein: 15,
      fat: 10,
      carbs: 50,
      fiber: 4,
      fluid: 0.2,
      burned: 0,
    },
  },
  {
    title: 'Beh 30 minút',
    start: '2025-09-01',
    extendedProps: {
      kcal: -100, // spálené kalórie
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      fluid: 0,
      burned: 100,
    },
  },
  // Ďalšie dni...
  {
    title: 'Raňajky: Jogurt s ovocím',
    start: '2025-09-02',
    extendedProps: {
      kcal: 300,
      protein: 12,
      fat: 8,
      carbs: 45,
      fiber: 3,
      fluid: 0.2,
      burned: 0,
    },
  },
];

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [overviewData, setOverviewData] = useState(null);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);

    // Vyfiltrujeme udalosti pre vybraný deň
    const dayEvents = events.filter((e) => e.start === info.dateStr);

    // Agregujeme makrá, kalórie a tekutiny
    let sumKcal = 0;
    let sumProtein = 0;
    let sumFat = 0;
    let sumCarbs = 0;
    let sumFiber = 0;
    let sumFluid = 0;
    let sumBurned = 0;

    dayEvents.forEach((ev) => {
      const { kcal, protein, fat, carbs, fiber, fluid, burned } = ev.extendedProps;
      sumKcal += kcal;       // ak je záporné, ide o spálené kalórie
      sumProtein += protein;
      sumFat += fat;
      sumCarbs += carbs;
      sumFiber += fiber;
      sumFluid += fluid;
      sumBurned += burned;
    });

    // Vytvoríme objekt, ktorý odovzdáme do DailyNutritionOverview
    // Môžete si cieľové hodnoty (goalKcal, atď.) uložiť napr. v state alebo v user profile
    const dataForOverview = {
      currentKcal: Math.max(sumKcal, 0), // ak vyjde záporné, zobrazíme 0
      goalKcal: 1500, // predvolený cieľ
      protein: { current: sumProtein, goal: 79 },
      carbs: { current: sumCarbs, goal: 192 },
      fat: { current: sumFat, goal: 43 },
      fiber: { current: sumFiber, goal: 28 },
      fluid: { current: sumFluid.toFixed(1), goal: 1.2 }, // 1.2 l ako príklad
      burned: sumBurned,
    };

    setOverviewData(dataForOverview);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Ľavý panel: Kalendár */}
      <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek',
          }}
          events={events}
          dateClick={handleDateClick}
          height="auto"
        />
      </div>

      {/* Pravý panel: Detail dňa – zobrazíme DailyNutritionOverview */}
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-4">
        {selectedDate && overviewData ? (
          <div>
            <h2 className="text-xl font-bold text-green-700 mb-3">
              {selectedDate}
            </h2>
            <DailyNutritionOverview data={overviewData} />
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            Kliknite na deň v kalendári pre zobrazenie detailov.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
