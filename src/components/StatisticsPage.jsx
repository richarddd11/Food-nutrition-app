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
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const StatisticsPage = () => {
    const [stats, setStats] = useState({})
    const [chartDataKcal, setChartDataKcal] = useState({})
    const [chartDataMacros, setChartDataMacros] = useState({})
    const [nutritionGoal, setNutritionGoal] = useState(null)

    useEffect(() => {
        async function loadGoals() {
            const user = auth.currentUser
            if(!user) return

            try {
                const docRef = doc(db, 'users', user.uid)
                const snap = await getDoc(docRef)
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

        async function loadStats() {
            const now = new Date()
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(now.getDate() - 7)
            const aggData = await fetchAggregatedStats(sevenDaysAgo, now)
            setStats(aggData)
        }

        loadGoals()
        loadStats()
    }, [])

      //Vygenerovanie grafov
      useEffect(() => {
        if (!nutritionGoal) return
        if (!stats || Object.keys(stats).length === 0) return

        const dayKeys = Object.keys(stats).sort()

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

          setChartDataMacros(macrosData)
      }, [stats, nutritionGoal])
  return (
    <div className='mt-4'>
        <h2 className="text-xl font-bold mb-4">Štatistiky – Kalórie a Makrá vs. Ciele</h2>

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
    </div>
  )
}

export default StatisticsPage