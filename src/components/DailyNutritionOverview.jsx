import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const doughnutOptions = {
  responzive: true,
  maintainAspectRatio: false,
  plugins: {
      legend: { display: false },
  },
}

// Pomocná funkcia pre malý doughnut graf (nutričné hodnoty)
const getMacroData = (current, goal, color) => ({
    datasets: [
      {
        data: [current, Math.max(goal - current, 0)],
        backgroundColor: [color, '#E5E5E5'],
        borderWidth: 0,
        cutout: '80%',
      },
    ],
  });

const DailyNutritionOverview = ({ data }) => {
    // Očakávaný tvar data:
  // {
  //   currentKcal: number,
  //   goalKcal: number,
  //   protein: { current: number, goal: number },
  //   carbs: { current: number, goal: number },
  //   fat: { current: number, goal: number },
  //   fiber: { current: number, goal: number },
  //   fluid: { current: number, goal: number },
  //   burned: number
  // }

  const { currentKcal, goalKcal, protein, carbs, fat, fiber, fluid, burned } = data;

  const calcPct = (current, goal) => 
    goal > 0 ? Math.min(((current / goal) * 100).toFixed(0), 100) : 0;
    const proteinPct = calcPct(protein.current, protein.goal);
    const carbsPct = calcPct(carbs.current, carbs.goal);
    const fatPct = calcPct(fat.current, fat.goal);
    const fiberPct = calcPct(fiber.current, fiber.goal);
  

  //Priprava dat pre velky doughnut graf s kaloriami
  const totalData = {
    datasets: [
        {
            data: [currentKcal, Math.max(goalKcal - currentKcal, 0)],
            backgroundColor: ['#F7941D', '#E5E5E5'],
            borderWidth: 0,
            cutout: '80%',
        },
    ],
  };


  return (
    <div className="p-4">
    {/* Veľký graf pre kalórie */}
    <div className="relative w-40 h-40 mx-auto">
      <Doughnut data={totalData} options={doughnutOptions} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-semibold text-gray-800">
          {currentKcal} kcal
        </div>
        <div className="text-sm text-gray-500">z {goalKcal} kcal</div>
      </div>
    </div>

    {/* Menšie grafy pre jednotlivé nutričné hodnoty */}
    <div className="flex justify-around mt-6">
      {/* Bielkoviny */}
      <div className="flex flex-col items-center">
        <div className="relative w-12 h-12">
          <Doughnut
            data={getMacroData(protein.current, protein.goal, '#69C267')}
            options={doughnutOptions}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-800">
              {proteinPct}%
            </span>
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-500">Bielkoviny</div>
        <div className="text-xs text-gray-700">
          {protein.current} g z {protein.goal} g
        </div>
      </div>
      {/* Sacharidy */}
      <div className="flex flex-col items-center">
        <div className="relative w-12 h-12">
          <Doughnut
            data={getMacroData(carbs.current, carbs.goal, '#F7941D')}
            options={doughnutOptions}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-800">
              {carbsPct}%
            </span>
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-500">Sacharidy</div>
        <div className="text-xs text-gray-700">
          {carbs.current} g z {carbs.goal} g
        </div>
      </div>
      {/* Tuky */}
      <div className="flex flex-col items-center">
        <div className="relative w-12 h-12">
          <Doughnut
            data={getMacroData(fat.current, fat.goal, '#F16664')}
            options={doughnutOptions}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-800">
              {fatPct}%
            </span>
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-500">Tuky</div>
        <div className="text-xs text-gray-700">
          {fat.current} g z {fat.goal} g
        </div>
      </div>
      {/* Vláknina */}
      <div className="flex flex-col items-center">
        <div className="relative w-12 h-12">
          <Doughnut
            data={getMacroData(fiber.current, fiber.goal, '#8E8E93')}
            options={doughnutOptions}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-800">
              {fiberPct}%
            </span>
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-500">Vláknina</div>
        <div className="text-xs text-gray-700">
          {fiber.current} g z {fiber.goal} g
        </div>
      </div>
    </div>

    {/* Textové zobrazenie ďalších hodnôt */}
    <div className="mt-4 text-center text-sm text-gray-700">
      <p>Tekutiny: {fluid.current} l z {fluid.goal} l</p>
      <p>Spálené: {burned} kcal</p>
    </div>
  </div>
  )
}

export default DailyNutritionOverview