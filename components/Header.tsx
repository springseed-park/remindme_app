import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { BellIcon } from './icons/BellIcon';

interface HeaderProps {
    onToggleNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleNotifications }) => {
  const { unreadCount } = useNotification();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-20 shadow-sm flex items-center justify-center h-14">
        <h1 className="text-xl font-bold text-gray-800">
          RemindMe
        </h1>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button
                onClick={onToggleNotifications}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="알림"
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white ring-1 ring-red-500/50"></span>
                )}
            </button>
        </div>
    </header>
  );
};

export default Header;