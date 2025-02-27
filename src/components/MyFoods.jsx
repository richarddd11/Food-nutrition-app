import React, { useState } from 'react'
import CustomFoodForm from './CustomFoodForm'
import { useOutletContext } from 'react-router-dom'

const MyFoods = () => {
    const { savedFoods, handleAddCustomFood, handleDeleteFood, handleEditFood } = useOutletContext()

    //Stav pre sledovanie, ktoré jedlo je v režime úpravy
    const [editingFoodId, setEditingFoodId] = useState(null);
    const [editFoodData, setEditFoodData] = useState({
      foodName: '',
      kcal: '',
      protein: '',
      fat: '',
      carbs: '',
      fiber: '',
    });

    const startEditing = (food) => {
      setEditingFoodId(food.id);
      setEditFoodData({
        foodName: food.foodName,
        kcal: food.kcal,
        protein: food.protein,
        fat: food.fat,
        carbs: food.carbs,
        fiber: food.fiber,
      })
    }

    const cancelEditing = () => {
      setEditingFoodId(null);
      setEditFoodData({
        foodName: '',
        kcal: '',
        protein: '',
        fat: '',
        carbs: '',
        fiber: '',
      })
    }

    const submitEdit = () => {
      handleEditFood(editingFoodId, {
        foodName: editFoodData.foodName,
        kcal: Number(editFoodData.kcal),
        protein: Number(editFoodData.protein),
        fat: Number(editFoodData.fat),
        carbs: Number(editFoodData.carbs),
        fiber: Number(editFoodData.fiber),
      });
      cancelEditing();
    }
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
              <li
                key={index}
                className="p-4 bg-white rounded-lg shadow border-l-4 border-green-500 flex justify-between items-center"
              >
                {editingFoodId === food.id ? (
                  <div className="flex-1">
                    {/* Edit formulár pre dané jedlo */}
                    <input
                      type="text"
                      value={editFoodData.foodName}
                      onChange={(e) => setEditFoodData({ ...editFoodData, foodName: e.target.value })}
                      className="border border-gray-300 rounded px-3 py-2 w-full mb-2"
                      placeholder="Názov jedla"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        value={editFoodData.kcal}
                        onChange={(e) => setEditFoodData({ ...editFoodData, kcal: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                        placeholder="Kalórie"
                      />
                      <input
                        type="number"
                        value={editFoodData.protein}
                        onChange={(e) => setEditFoodData({ ...editFoodData, protein: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                        placeholder="Bielkoviny"
                      />
                      <input
                        type="number"
                        value={editFoodData.fat}
                        onChange={(e) => setEditFoodData({ ...editFoodData, fat: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                        placeholder="Tuky"
                      />
                      <input
                        type="number"
                        value={editFoodData.carbs}
                        onChange={(e) => setEditFoodData({ ...editFoodData, carbs: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                        placeholder="Sacharidy"
                      />
                      <input
                        type="number"
                        value={editFoodData.fiber}
                        onChange={(e) => setEditFoodData({ ...editFoodData, fiber: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                        placeholder="Vláknina"
                      />
                      <input
                        type="number"
                        value={editFoodData.fluid}
                        onChange={(e) => setEditFoodData({ ...editFoodData, fluid: e.target.value })}
                        className="border border-gray-300 rounded px-3 py-2"
                        placeholder="Tekutiny"
                      />
                    </div>
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
                      <h3 className="text-lg font-bold text-gray-800">{food.foodName}</h3>
                      <p className="text-sm text-gray-700">Kalórie: {food.kcal} kcal</p>
                      <p className="text-sm text-gray-700">Bielkoviny: {food.protein} g</p>
                      <p className="text-sm text-gray-700">Tuky: {food.fat} g</p>
                      <p className="text-sm text-gray-700">Sacharidy: {food.carbs} g</p>
                      <p className="text-sm text-gray-700">Vláknina: {food.fiber} g</p>
                      <p className="text-sm text-gray-700">Tekutiny: {food.fluid} l</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleDeleteFood(food.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Zmazať
                      </button>
                      <button
                        onClick={() => startEditing(food)}
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
            Zatiaľ ste nepridali žiadne jedlá.
          </p>
        )}
      </div>
    </div>
  
  )
}

export default MyFoods