import React, { useState } from 'react'

const CustomFoodForm = ({ onAddCustomFood }) => {
  const [foodName, setFoodName] = useState('');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fiber, setFiber] = useState('');
  const [fluid, setFluid] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!foodName.trim()) return;

    const newFood = {
        foodName,
        kcal: Number(kcal),
        protein: Number(protein),
        fat: Number(fat),
        carbs: Number(carbs),
        fiber: Number(fiber),
        fluid: Number(fluid),
    };

    onAddCustomFood(newFood);
    
    // Reset formuláru
    setFoodName('');
    setKcal('');
    setProtein('');
    setFat('');
    setCarbs('');
    setFiber('');
    setFluid('');
  }
  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold text-green-700 mb-4">Pridať vlastné jedlo</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Názov jedla:</label>
        <input 
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Názov jedla"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Kalórie:</label>
          <input
            type="number"
            value={kcal}
            onChange={(e) => setKcal(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="kcal"
          />
        </div>
        <div>
          <label className="block text-gray-700">Bielkoviny (g):</label>
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="bielkoviny"
          />
        </div>
        <div>
          <label className="block text-gray-700">Tuky (g):</label>
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="tuky"
          />
        </div>
        <div>
          <label className="block text-gray-700">Sacharidy (g):</label>
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="sacharidy"
          />
        </div>
        <div>
          <label className="block text-gray-700">Vláknina (g):</label>
          <input
            type="number"
            value={fiber}
            onChange={(e) => setFiber(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="vláknina"
          />
        </div>
        <div>
          <label className="block text-gray-700">Tekutiny (l):</label>
          <input
            type="number"
            value={fluid}
            onChange={(e) => setFluid(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="tekutiny"
          />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
        Pridať jedlo
      </button>
    </form>
  )
}

export default CustomFoodForm