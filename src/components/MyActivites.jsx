import React, { act, useState } from 'react'
import ActivitesForm from './ActivitesForm';
import { useOutletContext } from 'react-router-dom';

const MyActivites = () => {
    const { handleEditActivity, handleAddActivity, savedActivities, handleDeleteActivity } = useOutletContext()
    
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        activityName: '',
        duration: '',
        burnedCalories: '',
        description: '',
    });

    const startEditing = (activity) => {
        setEditingId(activity.id);
        setEditData({
            activityName: activity.activityName,
            duration: activity.duration,
            burnedCalories: activity.burnedCalories,
            description: activity.description || '',
        })
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditData({
            activityName: '',
            duration: '',
            burnedCalories: '',
            description: '',
        })
    }

    const submitEdit = () => {
        if(!editingId) return;
        const updateActivity = {
            ...editData,
            duration: Number(editData.duration),
            burnedCalories: Number(editData.burnedCalories),
        };
        handleEditActivity(editingId, updateActivity);
        cancelEditing();
    }
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Moje aktivity</h2>

      {/* Formulár pre pridanie novej aktivity */}
      <ActivitesForm onAddActivity={handleAddActivity} />

      {/* Zoznam uložených aktivít */}
      <div className="mt-6">
        {savedActivities && savedActivities.length > 0 ? (
          <ul className="space-y-4">
            {savedActivities.map((activity) => (
              <li
                key={activity.id}
                className="p-4 bg-white rounded-lg shadow border-l-4 border-green-500 flex justify-between items-start"
              >
                {editingId === activity.id ? (
                  <div className="flex-1">
                    {/* Editačný formulár pre aktivitu */}
                    <input
                      type="text"
                      value={editData.activityName}
                      onChange={(e) => setEditData({ ...editData, activityName: e.target.value })}
                      className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
                      placeholder="Názov aktivity"
                    />
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <input
                        type="number"
                        value={editData.duration}
                        onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                        placeholder="Dĺžka (min)"
                      />
                      <input
                        type="number"
                        value={editData.burnedCalories}
                        onChange={(e) => setEditData({ ...editData, burnedCalories: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                        placeholder="Spálené kalórie"
                      />
                    </div>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                      placeholder="Popis"
                    />
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={submitEdit}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Uložiť
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Zrušiť
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {activity.activityName}
                      </h3>
                      <p className="text-sm text-gray-700">Dĺžka: {activity.duration} min</p>
                      <p className="text-sm text-gray-700">
                        Spálené kalórie: {activity.burnedCalories} kcal
                      </p>
                      {activity.description && (
                        <p className="text-sm text-gray-700">Popis: {activity.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Zmazať
                      </button>
                      <button
                        onClick={() => startEditing(activity)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Upraviť
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            Zatiaľ ste nepridali žiadne aktivity.
          </p>
        )}
      </div>
    </div>
  )
}

export default MyActivites