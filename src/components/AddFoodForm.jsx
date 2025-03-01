import React, { useState, useRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';

const AddFoodForm = ({ selectedDate, onAddFood }) => {
    const [foodName, setFoodName] = useState('');
    const { savedFoods } = useOutletContext();
    const [suggestions, setSuggestions] = useState([]);
    
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(containerRef.current && !containerRef.current.contains(event.target)) {
                setSuggestions([])
            }
        }

        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [])

    const handleInputChange = (e) => {
        const value = e.target.value;
        setFoodName(value);
        if(value.trim().length > 0) {
            const filteredFoods = savedFoods.filter(food => 
                   food.foodName.toLowerCase().includes(value.toLowerCase())
                );
                setSuggestions(filteredFoods)
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (food) => {
        const newEvent = {
            title: food.foodName,
            start: selectedDate,
            extendedProps: {
                kcal: food.kcal,
                protein: food.protein,
                fat: food.fat,
                carbs: food.carbs,
                fiber: food.fiber,
            }
        }
        onAddFood(newEvent);
        setFoodName('');
        setSuggestions([]);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!foodName || !selectedDate) return;

        const selectedFood = savedFoods.find(food => food.foodName.toLowerCase() === foodName.toLowerCase());

        const newEvent = selectedFood
        ? {
            title: selectedFood.foodName,
          start: selectedDate,
          extendedProps: {
            kcal: selectedFood.kcal,
            protein: selectedFood.protein,
            fat: selectedFood.fat,
            carbs: selectedFood.carbs,
            fiber: selectedFood.fiber,
            fluid: selectedFood.fluid,
            burned: 0,
          },
        }
      : {
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
          },
        }

        onAddFood(newEvent);
        setFoodName('');
        setSuggestions([]);
    }
  return (
    <form onSubmit={handleSubmit} className='p-4 bg-white rounded-lg shadow mb-4'>
        <h3 className="text-lg font-bold text-green-700 mb-2">Pridať jedlo</h3>
        <div className='mb-2 relative' ref={containerRef}>
            <label className='block text-gray-700'>Názov jedla:</label>
            <div className="relative">
                    <input 
                        type="text"
                        value={foodName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        placeholder="Zadaj názov jedla"
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                            {suggestions.map((food) => (
                                <li 
                                    key={food.id}
                                    onClick={() => handleSuggestionClick(food)}
                                    className="px-4 py-2 border-b border-gray-200 last:border-0 rounded hover:bg-green-200 hover:text-green-900 transition-colors duration-200 cursor-pointer"
                                >
                                    {food.foodName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
        </div>

        <button type='submit' className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Pridať</button>
    </form>
  )
}

export default AddFoodForm