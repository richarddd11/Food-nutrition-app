import React, { useState, useRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';

const AddFoodForm = ({ selectedDate, onAddFood }) => {
    const [activeTab, setActiveTab] = useState('custom');
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
          },
        }

        onAddFood(newEvent);
        setFoodName('');
        setSuggestions([]);
    }

    //API
    const [apiQuery, setApiQuery] = useState('')
    const [apiResults, setApiResults] = useState([])
    const [apiError, setApiError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleApiInputChange = (e) => {
        const value = e.target.value
        setApiQuery(value)

        if (!value.trim()) {
          setApiResults([])
          setApiError(null)
        }
      }

    const handleApiSearch = async () => {
        if(!apiQuery.trim()) return
        setIsLoading(true)
        setApiError(null)

        try {
            //endpoint na vyhladanie surovin
            const searchURL = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(
                apiQuery
              )}&number=10&apiKey=${import.meta.env.VITE_API_KEY}`
              const searchResp = await fetch(searchURL);
              if(!searchResp.ok) {
                throw new Error(`Chyba pri volaní spoonacular: ${searchResp.status}`)
              }

              const searchData = await searchResp.json();
              const results = searchData.results || [];

              const detailedResults = await Promise.all(
                results.map(async (item) => {
                    const detailURL = `https://api.spoonacular.com/food/ingredients/${item.id}/information?amount=100&unit=grams&apiKey=${import.meta.env.VITE_API_KEY}`;
                    try {
                        const detailResp = await fetch(detailURL);
                        if(!detailResp.ok) {
                            return { ...item, nutrition: null }
                        }

                        const detailData = await detailResp.json();
                        const nutrients = detailData.nutrition?.nutrients || []

                        const getNutrientValue = (nutrientName) => {
                            const found = nutrients.find(
                                (n) => n.name.toLowerCase() === nutrientName.toLowerCase()
                            )
                            return found ? found.amount : 0
                        }

                        const enrichedNutrition = {
                            kcal: getNutrientValue('Calories'),
                            protein: getNutrientValue('Protein'),
                            fat: getNutrientValue('Fat'),
                            carbs: getNutrientValue('Carbohydrates'),
                            fiber: getNutrientValue('Fiber'),
                            image: detailData.image,
                        }

                        return {
                            id: item.id,
                            name: item.name,
                            nutrition: enrichedNutrition,
                        }
                    } catch (err) {
                        console.error('Detail fetch error', err)
                        return { ...item, nutrition: null }
                    }
                })
              )

              setApiResults(detailedResults)
        } catch (error) {
            setApiError(error.message)
            setApiResults([])
        } finally {
            setIsLoading(false);
        }
    }

    const handleApiFood = (spoonItem) => {
        const { name, nutrition } = spoonItem
        const { kcal, protein, fat, carbs, fiber } = nutrition || {}

        const newEvent = {
            title: name,
            start: selectedDate,
            extendedProps: {
            kcal: kcal || 0,
            protein: protein || 0,
            fat: fat || 0,
            carbs: carbs || 0,
            fiber: fiber || 0,
        },
      }
      onAddFood(newEvent)
      setApiQuery('')
      setApiResults([])
    }
  return (
    <div className="p-4 bg-white rounded-lg shadow mb-4">
      <h3 className="text-lg font-bold text-green-700 mb-4">Pridať jedlo</h3>

      {/* Záložky (Moje jedlá / API) */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'custom' ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('custom')}
        >
          Moje jedlá
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'api' ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('api')}
        >
          API
        </button>
      </div>

      {/* Sekcia: Moje jedlá */}
      {activeTab === 'custom' && (
        <form onSubmit={handleSubmit} ref={containerRef}>
          <label className="block text-gray-700">Názov jedla:</label>
          <div className="relative">
            <input
              type="text"
              value={foodName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
              placeholder="Zadaj názov jedla"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                {suggestions.map((food) => (
                  <li
                    key={food.id}
                    onClick={() => handleSuggestionClick(food)}
                    className="px-4 py-2 border-b border-gray-200 last:border-0 hover:bg-green-200 hover:text-green-900 transition-colors duration-200 cursor-pointer"
                  >
                    {food.foodName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Pridať
          </button>
        </form>
      )}

      {/* Sekcia: API vyhľadávanie (Spoonacular) */}
      {activeTab === 'api' && (
        <div>
          <label className="block text-gray-700 mb-1">Vyhľadaj v Spoonacular:</label>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={apiQuery}
              onChange={handleApiInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Napíš názov (napr. 'apple', 'chicken'...)"
            />
            <button
              onClick={handleApiSearch}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Hľadať
            </button>
          </div>
          {isLoading && <p>Načítavam...</p>}
          {apiError && <p className="text-red-500">Chyba: {apiError}</p>}

          {/* Výpis výsledkov z API */}
          {apiResults.map((item) => {
            const { id, name, nutrition } = item
            const cal = nutrition?.kcal || 0
            return (
              <div
                key={id}
                className="flex justify-between items-center p-2 bg-gray-100 rounded my-2"
              >
                <div>
                  <strong>{name}</strong> | {Math.round(cal)} kcal / 100g
                </div>
                <button
                  onClick={() => handleApiFood(item)}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Pridať
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AddFoodForm