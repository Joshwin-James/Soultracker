import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, BarChart2, Trophy, LogOut, HeartPulse } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, text: 'Dashboard', path: '/app/dashboard' },
    { icon: MessageSquare, text: 'Chat with Soul', path: '/app/chat' },
    { icon: BarChart2, text: 'Progress', path: '/app/progress' },
    { icon: Trophy, text: 'Leaderboard', path: '/app/leaderboard' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col p-4">
      <div className="flex items-center mb-10 p-2">
        <HeartPulse className="h-8 w-8 text-warm-purple-500" />
        <h1 className="text-2xl font-bold ml-2 text-warm-purple-800">SoulTracker</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.text}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 my-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-warm-purple-100 text-warm-purple-700 font-semibold'
                      : 'text-gray-600 hover:bg-calm-blue-100 hover:text-calm-blue-800'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="p-3 mb-4 bg-calm-blue-50 rounded-lg">
            <p className="text-sm text-gray-700 truncate">{user?.email}</p>
            <p className="text-xs text-gray-500">Points: {user?.userPoints}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;