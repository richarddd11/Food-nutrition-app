import React, { useState } from 'react';

const NutritionCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState(1.2);
  const [goal, setGoal] = useState('maintain');
  const [calories, setCalories] = useState(null);

  const calculateCalories = (e) => {
    e.preventDefault();

    if (!weight || !height || !age) {
      alert("Prosím, vyplň všetky polia.");
      return;
    }

    let BMR;
    if (gender === 'male') {
      BMR = 88.36 + (13.4 * parseFloat(weight)) + (4.8 * parseFloat(height)) - (5.7 * parseFloat(age));
    } else {
      BMR = 447.6 + (9.2 * parseFloat(weight)) + (3.1 * parseFloat(height)) - (4.3 * parseFloat(age));
    }

    let dailyCalories = BMR * parseFloat(activityLevel);

    if (goal === 'lose') {
      dailyCalories -= 500;
    } else if (goal === 'gain') {
      dailyCalories += 500;
    }

    setCalories(Math.round(dailyCalories));
  };

  return (
    <section className="max-w-4xl mx-auto py-16 px-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-4xl font-semibold text-green-700 text-center mb-6">BMR kalkulačka</h2>

      <form 
        onSubmit={calculateCalories} 
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-md"
      >
        {/* Váha */}
        <div>
          <label className="block text-gray-700 font-semibold">Váha (kg)</label>
          <input 
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="focus:outline-none border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-green-500 transition"
            placeholder="Zadajte váhu"
          />
        </div>

        {/* Výška */}
        <div>
          <label className="block text-gray-700 font-semibold">Výška (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="focus:outline-none border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-green-500 transition"
            placeholder="Zadajte výšku"
          />
        </div>

        {/* Vek */}
        <div>
          <label className="block text-gray-700 font-semibold">Vek</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="focus:outline-none border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-green-500 transition"
            placeholder="Zadajte vek"
          />
        </div>

        {/* Pohlavie */}
        <div>
          <label className="block text-gray-700 font-semibold">Pohlavie</label>
          <select 
            value={gender} 
            onChange={(e) => setGender(e.target.value)}
            className=" focus:outline-none border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-green-500 transition"
          >
            <option value="male">Muž</option>
            <option value="female">Žena</option>
          </select>
        </div>

        {/* Úroveň aktivity */}
        <div>
          <label className="block text-gray-700 font-semibold">Úroveň aktivity</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="focus:outline-none border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-green-500 transition"
          >
            <option value="1.2">Sedavý životný štýl</option>
            <option value="1.375">Ľahká aktivita (1-3x týždenne cvičenie)</option>
            <option value="1.55">Stredná aktivita (3-5x týždenne cvičenie)</option>
            <option value="1.725">Vysoká aktivita (6-7x týždenne cvičenie)</option>
            <option value="1.9">Extrémna aktivita (ťažká fyzická práca + tréning)</option>
          </select>
        </div>

        {/* Cieľ */}
        <div>
          <label className="block text-gray-700 font-semibold">Cieľ</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="focus:outline-none border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-green-500 transition"
          >
            <option value="lose">Schudnúť</option>
            <option value="maintain">Udržať váhu</option>
            <option value="gain">Nabrať svaly</option>
          </select>
        </div>

        {/* Tlačidlo centrované */}
        <div className="col-span-1 sm:col-span-2 flex justify-center">
          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-lg font-semibold shadow-md w-full sm:w-1/2">
            Vypočítať kalórie
          </button>
        </div>
      </form>

      {calories !== null && (
        <div className="mt-8 p-6 bg-green-100 text-center rounded-lg shadow-md">
          <p className="text-xl font-semibold text-gray-700">
            Odporúčaný denný kalorický príjem:
          </p>
          <p className="text-4xl font-bold text-green-700 mt-2">
            {calories} kcal
          </p>
        </div>
      )}
    </section>
  );
};

export default NutritionCalculator;
