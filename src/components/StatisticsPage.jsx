import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'


import { fetchAggregatedStats } from '../services/statsService'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const StatisticsPage = () => {
    const [stats, setStats] = useState({})
    const [chartDataKcal, setChartDataKcal] = useState({})
    const [chartDataMacros, setChartDataMacros] = useState({})
    const [nutritionGoal, setNutritionGoal] = useState(null)
    const [dateRange, setDateRange] = useState('7days')
    const [chartDataBalance, setChartDataBalance] = useState({})

    function getStartDateForRange(range) {
        const now = new Date()
        const start = new Date(now)
        if(range === '7days') {
            start.setDate(start.getDate() - 6)
        } else if (range === '30days') {
            start.setDate(start.getDate() - 29)
        } else if (range === '90days') {
            start.setDate(start.getDate() - 89)
        }
        return start
    } 

    useEffect(() => {
        async function loadGoals() {
            const user = auth.currentUser
            if(!user) return

            try {
                const docRef = doc(db, 'users', user.uid)
                const snap = await getDoc(docRef)
                const data = snap.data()
                if(snap.exists()) {
                    setNutritionGoal({
                        dailyCalories: data.dailyCalories || 2000,
                        proteinGrams: data.proteinGrams || 100,
                        carbsGrams: data.carbsGrams || 200,
                        fatGrams: data.fatGrams || 50
                    })
                } else {
                    console.warn('Dokument s cieľmi neexistuje, použijem default hodnoty.')
                    setNutritionGoal({
                        dailyCalories: 2000,
                        proteinGrams: 100,
                        carbsGrams: 200,
                        fatGrams: 50
                    })
                }
            } catch (error) {
                console.error('Chyba pri načítaní goal z Firestore:', error)
                
                setNutritionGoal({
                  dailyCalories: 2000,
                  proteinGrams: 100,
                  carbsGrams: 200,
                  fatGrams: 50
                })        
            }
        }

        loadGoals()
    }, [])

    useEffect(() => {
        async function loadStats() {
            const now = new Date()
            const startDate = getStartDateForRange(dateRange)
            const aggData = await fetchAggregatedStats(startDate, now)
            setStats(aggData)
        }
        loadStats()
    }, [dateRange])

    const dayKeys = Object.keys(stats).sort()

      //Vygenerovanie grafov
      useEffect(() => {
        if (!nutritionGoal) return
        if (!stats || Object.keys(stats).length === 0) return

        

        const dailyKcal = dayKeys.map(day => stats[day].kcal)
        const dailyGoalKcal = dayKeys.map(() => nutritionGoal.dailyCalories)

        const kcalData = {
            labels: dayKeys,
            datasets: [
              {
                label: 'Daily Kcal',
                data: dailyKcal,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.2,
              },
              {
                label: 'Goal Kcal',
                data: dailyGoalKcal,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderDash: [5, 5],
                tension: 0.2,
              }
            ]
          }

          setChartDataKcal(kcalData)

          const dailyProtein = dayKeys.map(day => stats[day].protein)
          const dailyCarbs = dayKeys.map(day => stats[day].carbs)
          const dailyFat = dayKeys.map(day => stats[day].fat)

          const dailyProteinGoal = dayKeys.map(() => nutritionGoal.proteinGrams)
          const dailyCarbsGoal   = dayKeys.map(() => nutritionGoal.carbsGrams)
          const dailyFatGoal     = dayKeys.map(() => nutritionGoal.fatGrams)
          
          const macrosData = {
            labels: dayKeys,
            datasets: [
              {
                label: 'Protein (g)',
                data: dailyProtein,
                borderColor: 'rgba(54, 162, 235, 1)',   // modrá
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.2,
              },
              {
                label: 'Protein Goal (g)',
                data: dailyProteinGoal,
                borderColor: 'rgba(54, 162, 235, 0.7)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderDash: [5, 5],
                tension: 0.2,
              },
              {
                label: 'Carbs (g)',
                data: dailyCarbs,
                borderColor: 'rgba(255, 206, 86, 1)',   // žltá
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.2,
              },
              {
                label: 'Carbs Goal (g)',
                data: dailyCarbsGoal,
                borderColor: 'rgba(255, 206, 86, 0.7)',
                backgroundColor: 'rgba(255, 206, 86, 0.1)',
                borderDash: [5, 5],
                tension: 0.2,
              },
              {
                label: 'Fat (g)',
                data: dailyFat,
                borderColor: 'rgba(153, 102, 255, 1)',  // fialová
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0.2,
              },
              {
                label: 'Fat Goal (g)',
                data: dailyFatGoal,
                borderColor: 'rgba(153, 102, 255, 0.7)',
                backgroundColor: 'rgba(153, 102, 255, 0.1)',
                borderDash: [5, 5],
                tension: 0.2,
              },
            ]
          }

          const dailyBurned = dayKeys.map(day => stats[day].burned || 0)

          const balanceData = {
            labels: dayKeys, // X-os: reťazce typu "2025-03-10"
            datasets: [
              {
                label: 'Prijaté kalórie',
                data: dailyKcal,
                backgroundColor: 'rgba(75,192,192,0.5)',
              },
              {
                label: 'Spálené kalórie',
                data: dailyBurned,
                backgroundColor: 'rgba(255,99,132,0.5)',
              },
            ],
          };

          setChartDataMacros(macrosData)
          setChartDataBalance(balanceData)
      }, [stats, nutritionGoal])

      const totalDays = dayKeys.length

      let successCalCount = 0;
      let successProteinCount = 0;
      let successCarbsCount = 0;
      let successFatCount = 0;
      
      dayKeys.forEach(day => {
        const { kcal = 0, protein = 0, carbs = 0, fat = 0 } = stats[day];

        if (kcal <= nutritionGoal.dailyCalories) {
            successCalCount++;
          }
          
          // BIELKOVINY: Príjem >= proteinGrams => splnené
          if (protein >= nutritionGoal.proteinGrams) {
            successProteinCount++;
          }
        
          // SACHARIDY: Príjem <= carbsGrams => splnené
          if (carbs <= nutritionGoal.carbsGrams) {
            successCarbsCount++;
          }
        
          // TUKY: Príjem <= fatGrams => splnené
          if (fat <= nutritionGoal.fatGrams) {
            successFatCount++;
          }
      })

      const calPercent = Math.round((successCalCount / totalDays) * 100);
      const proteinPercent = Math.round((successProteinCount / totalDays) * 100);
      const carbsPercent = Math.round((successCarbsCount / totalDays) * 100);
      const fatPercent = Math.round((successFatCount / totalDays) * 100);

  return (
    <div className='mt-4'>
        <h2 className="text-xl font-bold mb-4">Štatistiky – Kalórie a Makrá vs. Ciele</h2>

        <div className='mb-4'>
            <label className="font-semibold mr-2">Zobraziť za:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border rounded px-2 py-1"
            >
            <option value="7days">Posledných 7 dní</option>
            <option value="30days">Posledných 30 dní</option>
            <option value="90days">Posledné 3 mesiace</option>
        </select>    
        </div>

        <div className='mb-8 bg-white rounded-lg shadow p-4'>
        <h3 className="text-lg font-semibold mb-2">
          Denný príjem kalórií (posledných 7 dní)
        </h3>
        {chartDataKcal?.labels?.length > 0 ? (
            <Line data={chartDataKcal} />
        ) : (
            <p>Načítavam graf kalórií...</p>
        )}
        </div>

        <div className="mb-8 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">
          Denný príjem bielkovín, sacharidov, tukov (posledných 7 dní)
        </h3>
        {chartDataMacros?.labels?.length > 0 ? (
          <Line data={chartDataMacros} />
        ) : (
          <p>Načítavam graf makier...</p>
        )}
      </div>

      <div className="mb-8 bg-white rounded-lg shadow p-4">
         <h3 className="text-lg font-semibold mb-2">Bilancia príjem vs. výdaj</h3>
         {chartDataBalance?.labels?.length > 0 ? (
           <Bar data={chartDataBalance} />
         ) : (
           <p>Načítavam graf bilancie...</p>
         )}
       </div> 

       <div className="bg-white rounded-lg shadow p-4 mt-4">
  <h3 className="text-lg font-semibold mb-4">Pokrok voči denným cieľom</h3>
  
  {/* Kalórie */}
  <div className="mb-3">
    <div className="flex items-center justify-between mb-1">
      <span className="font-medium text-gray-700">Kalórie</span>
      <span className="text-sm text-gray-600">
        {successCalCount} / {totalDays} dní ({calPercent}%)
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
      <div
        className="bg-green-500 h-3 transition-all duration-300"
        style={{ width: `${calPercent}%` }}
      />
    </div>
  </div>

  {/* Bielkoviny */}
  <div className="mb-3">
    <div className="flex items-center justify-between mb-1">
      <span className="font-medium text-gray-700">Bielkoviny</span>
      <span className="text-sm text-gray-600">
        {successProteinCount} / {totalDays} dní ({proteinPercent}%)
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
      <div
        className="bg-blue-500 h-3 transition-all duration-300"
        style={{ width: `${proteinPercent}%` }}
      />
    </div>
  </div>

  {/* Sacharidy */}
  <div className="mb-3">
    <div className="flex items-center justify-between mb-1">
      <span className="font-medium text-gray-700">Sacharidy</span>
      <span className="text-sm text-gray-600">
        {successCarbsCount} / {totalDays} dní ({carbsPercent}%)
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
      <div
        className="bg-yellow-400 h-3 transition-all duration-300"
        style={{ width: `${carbsPercent}%` }}
      />
    </div>
  </div>

  {/* Tuky */}
  <div className="mb-1">
    <div className="flex items-center justify-between mb-1">
      <span className="font-medium text-gray-700">Tuky</span>
      <span className="text-sm text-gray-600">
        {successFatCount} / {totalDays} dní ({fatPercent}%)
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
      <div
        className="bg-purple-500 h-3 transition-all duration-300"
        style={{ width: `${fatPercent}%` }}
      />
    </div>
    </div>
</div>
</div>
  )
}

export default StatisticsPage