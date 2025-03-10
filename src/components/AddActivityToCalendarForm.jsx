import React, { useState } from 'react'
import {useOutletContext} from 'react-router-dom';

const AddActivityToCalendarForm = ({ selectedDate, onAddActivityEvent }) => {
    const { savedActivities } = useOutletContext()

    const [activityId, setActivityId] = useState('');
    const [chosenDate, setChosenDate] = useState(selectedDate || '');

    const handleSubmit = (e) => {
        e.preventDefault()

        const chosenActivity = savedActivities.find(act => act.id === activityId);
        if(!chosenActivity) return;

        const newEvent = {
            title: chosenActivity.activityName,
            start: chosenDate,
            type: 'activity',
            extendedProps: {
                burned: chosenActivity.burnedCalories,
            }
        }

        onAddActivityEvent(newEvent);
        setActivityId('')
    }
  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow mb-4">
      <h3 className="text-lg font-bold text-green-700 mb-2">Pridať aktivitu do kalendára</h3>
      
      <div className="mb-2">
        <label className="block text-gray-700">Vyber aktivitu:</label>
        <select
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        >
          <option value="">--Vybrať--</option>
          {savedActivities.map(activity => (
            <option key={activity.id} value={activity.id}>
              {activity.activityName} (spálené {activity.burnedCalories} kcal)
            </option>
          ))}
        </select>
      </div>

      {/* Môžeš doplniť input na dátum, ak to potrebuješ. 
          Ak používaš selectedDate z kalendára, a nepotrebuješ meniť dátum,
          môžeš tento input vynechať. */}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Pridať
      </button>
    </form>
  )
}

export default AddActivityToCalendarForm