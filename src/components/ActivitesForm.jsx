import React, { useState } from 'react'

const ActivitesForm = ({ onAddActivity }) => {
    const [activityName, setActivityName] = useState('');
    const [duration, setDuration] = useState('');
    const [burnedCalories, setBurnedCalories] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!activityName.trim()) return;

        const newActivity = {
            activityName,
            duration: Number(duration),
            burnedCalories: Number(burnedCalories),
            description,
            createdAt: new Date(),
        }

        if (onAddActivity) {
            onAddActivity(newActivity);
          }

        setActivityName('')
        setDuration('')
        setBurnedCalories('')
        setDescription('')
    }
  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md mb-4">
    <h2 className="text-xl font-bold text-green-700 mb-4">Pridať novú aktivitu</h2>

    <div className="mb-4">
      <label className="block text-gray-700">Názov aktivity:</label>
      <input
        type="text"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        required
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholder="Zadaj názov aktivity (napr. beh, plávanie)"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700">Dĺžka (min):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="napr. 30"
        />
      </div>
      <div>
        <label className="block text-gray-700">Spálené kalórie:</label>
        <input
          type="number"
          value={burnedCalories}
          onChange={(e) => setBurnedCalories(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="napr. 200"
        />
      </div>
    </div>

    {/* Môžeš pridať napr. ešte aj poznámku/opis aktivity */}
    <div className="mt-4">
      <label className="block text-gray-700">Popis (nepovinné):</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholder="Krátky opis, napr. intenzita behu, miesto atď."
      />
    </div>

    <button
      type="submit"
      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    >
      Pridať aktivitu
    </button>
  </form>
  )
}

export default ActivitesForm