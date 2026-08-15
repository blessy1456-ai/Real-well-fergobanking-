import React, { useState } from 'react';
import { NotificationItem, PageType } from '../types';
import { 
  Bell, 
  ShieldAlert, 
  Info, 
  Sparkles, 
  Check, 
  Trash2, 
  ArrowLeft,
  CheckCheck
} from 'lucide-react';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  setCurrentPage: (page: PageType) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  setNotifications,
  setCurrentPage,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'security'>('all');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'security') return n.type === 'security';
    return true;
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200 hover:border-red-600 hover:text-red-700 transition shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs text-red-700 font-bold hover:text-red-800 transition"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </button>
          <span className="text-slate-300">•</span>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 text-xs text-slate-500 font-medium hover:text-red-600 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-red-700 text-white shadow-md shadow-red-900/20 shrink-0">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Notifications
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Official alerts, account updates, and security reminders
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex w-full sm:w-auto rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs justify-between sm:justify-start">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold transition min-h-[36px] ${
                filter === 'all' ? 'bg-red-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold transition min-h-[36px] ${
                filter === 'unread' ? 'bg-red-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('security')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold transition min-h-[36px] ${
                filter === 'security' ? 'bg-red-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* REQUIRED CARDS LISTING */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium">
              No notifications found in this view.
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleToggleRead(n.id)}
                className={`group relative rounded-2xl p-4 transition cursor-pointer border ${
                  !n.read
                    ? 'bg-red-50/40 border-red-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-75 hover:opacity-100'
                }`}
              >
                {!n.read && (
                  <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                )}

                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      n.type === 'security'
                        ? 'bg-rose-100 text-rose-700 border-rose-200'
                        : n.type === 'service'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {n.type === 'security' ? (
                      <ShieldAlert className="h-5 w-5" />
                    ) : n.type === 'service' ? (
                      <Sparkles className="h-5 w-5" />
                    ) : (
                      <Info className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between pr-4">
                      <h3 className={`text-sm font-bold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
