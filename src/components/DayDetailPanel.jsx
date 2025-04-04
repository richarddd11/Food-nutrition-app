import React from 'react'
import DailyNutritionOverview from './DailyNutritionOverview'

const DayDetailPanel = ({ selectedDate, overviewData, eventsForDay, onDeleteEvent }) => {
  return (
    <div className='w-full lg:w-3/3 bg-white rounded-lg shadow p-4'>
        {selectedDate && overviewData ? (
            <div>
                <h2 className='text-xl font-bold text-green-700 mb-3'>{selectedDate}</h2>
                {/*Zobrazenie grafu s nutričnými udajmi */}
                <DailyNutritionOverview data={overviewData} />
                {/*Zoznam jedal daneho dna*/}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-green-600 mb-2">Jedlá a aktivity dňa</h3>
                    <ul className='space-y-2 text-sm'>
                        {eventsForDay.map((event, index) => (
                            <li key={index} className='p-2 bg-green-100 rounded shadow border-l-4 border-green-500'>
                                {event.title}
                                <button
                    onClick={() => onDeleteEvent(event.id, event.type)}
                    className="bg-red-500 text-white px-2 py-1 ml-5 rounded hover:bg-red-600"
                  >
                    Zmazať
                  </button>
                            </li>
                            
                        ))}
                    </ul>
                </div>
            </div>
        ) : (
            <div className='text-gray-500 text-center'>
                Kliknite na deň v kalendári pre zobrazenie detailov.
            </div>
        )}
    </div>
  )
}

export default DayDetailPanel