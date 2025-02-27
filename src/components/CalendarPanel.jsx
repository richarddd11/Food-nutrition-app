import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useStartTyping } from 'react-use';

const CalendarPanel = ({ events, onDateClick }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const headerToolbar = isMobile
  ? {left: 'prev,next', center: 'title', right: ''}
  : {left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek'  }
  return (
    <div className='flex-1 bg-white rounded-lg shadow-lg p-4'>
        <FullCalendar 
           plugins={[dayGridPlugin, interactionPlugin]}
           initialView='dayGridMonth'
           headerToolbar={headerToolbar}
           events={events}
           dateClick={onDateClick}
           height='auto'
        />
    </div>
  )
}

export default CalendarPanel