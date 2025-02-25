import React, { useState } from 'react'

const AddFoodForm = ({ selectedDate, onAddFood }) => {
    const [foodName, setFoodName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!foodName || !selectedDate) return;

        const newEvent = {
            title: foodName,
            start: selectedDate,
            extendedProps: {
                kcal: 0,
                protein: 0,
                fat: 0,
                carbs: 0,
                fiber: 0,
                fluid: 0,
                burned: 0,
            }
        }

        onAddFood(newEvent);
        setFoodName('');
    }
  return (
    <form onSubmit={handleSubmit} className='p-4 bg-white rounded-lg shadow mb-4'>
        <h3 className="text-lg font-bold text-green-700 mb-2">Pridať jedlo</h3>
        <div className='mb-2'>
            <label className='block text-gray-700'>Názov jedla:</label>
            <input 
               type="text"
               value={foodName}
               onChange={(e) => setFoodName(e.target.value)}
               className="w-full border border-gray-300 rounded-lg px-4 py-2"
               placeholder="Zadaj názov jedla"
            />
        </div>

        <button type='submit' className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Pridať</button>
    </form>
  )
}

export default AddFoodForm