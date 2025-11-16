
import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import type { Notification } from '../types';

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const formattedDate = new Date(notification.date).toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="w-full text-left p-4 hover:bg-gray-50 focus:outline-none"
            >
                <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                       <span className={`block w-2 h-2 rounded-full ${notification.isRead ? 'bg-gray-300' : 'bg-indigo-500'}`}></span>
                    </div>
                    <div className="flex-grow">
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </button>
            {isExpanded && (
                <div className="bg-indigo-50 p-4">
                    <h4 className="font-semibold text-indigo-800 mb-2">{notification.suggestionTitle}</h4>
                    <p className="text-sm text-indigo-700 whitespace-pre-wrap leading-relaxed">{notification.suggestionContent}</p>
                </div>
            )}
        </div>
    );
};

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ isOpen, onClose }) => {
  const { notifications, markAllAsRead } = useNotification();
  
  useEffect(() => {
    if (isOpen) {
      // Mark as read after a short delay to allow the user to see the "unread" dot
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, markAllAsRead]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/10 z-30 animate-fadeIn" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div 
        className="absolute top-16 right-4 w-[350px] max-w-[90vw] bg-white rounded-2xl shadow-xl z-40 overflow-hidden border border-gray-200/50 animate-fadeInUp"
        style={{ animationDuration: '0.3s' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-popup-title"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 id="notification-popup-title" className="font-bold text-lg text-gray-800">알림</h3>
            <button 
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="알림 닫기"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length > 0 ? (
                notifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))
            ) : (
                <div className="p-8 text-center">
                    <p className="text-gray-500">새로운 알림이 없어요.</p>
                </div>
            )}
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;