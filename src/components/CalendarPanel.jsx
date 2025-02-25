import React from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarPanel = ({ events, onDateClick }) => {
  return (
    <div className='flex-1 bg-white rounded-lg shadow-lg p-4'>
        <FullCalendar 
           plugins={[dayGridPlugin, interactionPlugin]}
           initialView='dayGridMonth'
           headerToolbar= {{
            left: 'prev, next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
           }}
           events={events}
           dateClick={onDateClick}
           height='auto'
        />
    </div>
  )
}

export default CalendarPanel