import React from 'react'
import CustomFoodForm from './CustomFoodForm'
import { useOutletContext } from 'react-router-dom'

const MyFoods = () => {
    const { savedFoods, handleAddCustomFood } = useOutletContext()
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Moje jedlá</h2>
      
      {/* Formulár pre pridanie vlastného jedla */}
      <CustomFoodForm onAddCustomFood={handleAddCustomFood} />
      
      {/* Zoznam uložených jedál */}
      <div className="mt-6">
        {savedFoods.length > 0 ? (
          <ul className="space-y-4">
            {savedFoods.map((food, index) => (
              <li key={index} className="p-2 bg-white rounded-lg shadow border-l-4 border-green-500">
                <h3 className="text-lg font-bold text-gray-800">{food.foodName}</h3>
                <p className="text-sm text-gray-700">Kalórie: {food.kcal} kcal</p>
                <p className="text-sm text-gray-700">Bielkoviny: {food.protein} g</p>
                <p className="text-sm text-gray-700">Tuky: {food.fat} g</p>
                <p className="text-sm text-gray-700">Sacharidy: {food.carbs} g</p>
                <p className="text-sm text-gray-700">Vláknina: {food.fiber} g</p>
                <p className="text-sm text-gray-700">Tekutiny: {food.fluid} l</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            Zatiaľ ste nepridali žiadne jedlá.
          </p>
        )}
      </div>
    </div>
  )
}

export default MyFoods