import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../config/firebase'


/**
 * Pomocná funkcia na vygenerovanie reťazca YYYY-MM-DD z Date objektu.
 */
function formatDate(dateObj) {
    return dateObj.toISOString().split('T')[0] // '2025-03-16' napr.
}

/**
 * Vráti objekt statsByDay, kde pre každý deň v rozsahu [startDate; endDate]
 * spočítame:
 *   - kcal, protein, fat, carbs, fiber, fluid, burned
 * 
 * @param {Date} startDate - Počiatočný dátum, inclusive
 * @param {Date} endDate   - Koncový dátum, inclusive
 */

export async function fetchAggregatedStats(startDate, endDate) {
    const user = auth.currentUser
    if (!user) return {}

    const startDateStr = formatDate(startDate)
    const endDateStr = formatDate(endDate)

    const eventsQuery = query(
        collection(db, 'calendarEvents'),
        where('userId', '==', user.uid)
    )
    const eventsSnapshot = await getDocs(eventsQuery)

    const activitiesQuery = query(
        collection(db, 'calendarActivities'),
        where('userId', '==', user.uid)
    )
    const activitiesSnapshot = await getDocs(activitiesQuery)

    const fluidsQuery = query(
        collection(db, 'calendarFluids'),
        where('userId', '==', user.uid)
    )
    const fluidsSnapshot = await getDocs(fluidsQuery)

    const statsByDay = {}

    const cursorDate = new Date(startDate)
    while (cursorDate <= endDate) {
        const dayStr = formatDate(cursorDate)
        statsByDay[dayStr] = {
            kcal: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            fiber: 0,
            fluid: 0,
            burned: 0,      
        }
        cursorDate.setDate(cursorDate.getDate() + 1)
    }

    eventsSnapshot.forEach(docSnap => {
        const data = docSnap.data()
        const dayStr = data.start
        if (dayStr >= startDateStr && dayStr <= endDateStr) {
            const { kcal = 0, protein = 0, fat = 0, carbs = 0, fiber = 0, burned = 0 } =
            data.extendedProps || {}

            if(statsByDay[dayStr]) {
                statsByDay[dayStr].kcal   += Number(kcal)
                statsByDay[dayStr].protein += Number(protein)
                statsByDay[dayStr].fat    += Number(fat)
                statsByDay[dayStr].carbs  += Number(carbs)
                statsByDay[dayStr].fiber  += Number(fiber)
                statsByDay[dayStr].burned += Number(burned)
            }
        }
    })

    activitiesSnapshot.forEach(docSnap => {
        const data = docSnap.data()
        const dayStr = data.start
        if(dayStr >= startDateStr && dayStr <= endDateStr) {
            const { burned = 0 } = data.extendedProps || {}
            if(statsByDay[dayStr]) {
                statsByDay[dayStr].burned += Number(burned)
            }
        }
    })

    fluidsSnapshot.forEach(docSnap => {
        const data = docSnap.data()
        const dayStr = data.start
        if(dayStr >= startDateStr && dayStr <= endDateStr) {
            if(statsByDay[dayStr]) {
                statsByDay[dayStr].fluid += Number(data.amount || 0)
            }
        }
    })

    return statsByDay
}
