
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-full lg:w-1/5 bg-gray-100 p-4 rounded-lg shadow-md">
      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard/calendar" className="text-green-700 font-bold hover:underline">
          Kalendár
        </Link>
        <Link to="/dashboard/my-foods" className="text-green-700 font-bold hover:underline">
          Moje jedlá
        </Link>
        <Link to="/dashboard/statistics" className="text-green-700 font-bold hover:underline">
          Štatistiky
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
