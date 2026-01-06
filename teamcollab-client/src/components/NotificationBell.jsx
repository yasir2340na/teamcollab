import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  BellIcon, 
  CheckIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import api from '../services/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <div
            className="absolute right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-white/50">
                  <BellIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                      !notif.read ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{notif.title}</p>
                        <p className="text-white/70 text-xs mt-1">{notif.message}</p>
                        <p className="text-white/40 text-xs mt-2">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif._id)}
                          className="text-green-400 hover:text-green-300 ml-2"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
