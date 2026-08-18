import React, { useState } from 'react';
import { 
  PageType, 
  UserProfile, 
  Transaction, 
  CreditCardItem, 
  NotificationItem,
  WireReceipt
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CREDIT_CARDS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { TransferPage } from './components/TransferPage';
import { ReceiptPage } from './components/ReceiptPage';
import { ProfilePage } from './components/ProfilePage';
import { NotificationsPage } from './components/NotificationsPage';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [creditCards, setCreditCards] = useState<CreditCardItem[]>(INITIAL_CREDIT_CARDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeReceipt, setActiveReceipt] = useState<WireReceipt | null>(null);

  /* Toast Notification Banner */
  const [toast, setToast] = useState<{ title: string; message: string; type?: string } | null>(null);

  const addNotification = (
    title: string, 
    message: string, 
    type: 'info' | 'security' | 'service' | 'alert' = 'info'
  ) => {
    const newNotif: NotificationItem = {
      id: `wf-notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen w-full bg-[#f4f5f8] text-slate-800 font-sans selection:bg-[#D71E28] selection:text-white flex flex-col antialiased">
      
      {/* Floating Toast Notice */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm rounded-xl bg-white border-l-4 border-[#D71E28] border-y border-r border-slate-300 p-4 shadow-xl animate-fadeIn flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-[#D71E28] flex items-center gap-1.5">
              {toast.type === 'alert' ? <ShieldAlert className="h-4 w-4 text-[#D71E28]" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              <span>{toast.title}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-snug">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)} 
            className="text-slate-400 hover:text-slate-700 p-0.5"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main App Content Routing */}
      {currentPage === 'login' ? (
        <main className="flex-1">
          <LoginPage onLoginSuccess={() => setCurrentPage('dashboard')} />
        </main>
      ) : (
        <div className="flex-1 flex flex-col w-full min-h-screen bg-[#f4f5f8]">
          
          {/* Top Desktop Navigation & Mobile Header */}
          <Navbar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            user={user}
            unreadCount={unreadCount}
            onLogout={handleLogout}
          />

          {/* Main Page Content Workspace */}
          <div className="flex-1 flex flex-col overflow-y-auto min-w-0 pb-20 md:pb-0">
            
            {/* Page Container */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {currentPage === 'dashboard' && (
                <Dashboard
                  user={user}
                  setUser={setUser}
                  transactions={transactions}
                  setTransactions={setTransactions}
                  creditCards={creditCards}
                  setCreditCards={setCreditCards}
                  setCurrentPage={setCurrentPage}
                  addNotification={addNotification}
                  setActiveReceipt={setActiveReceipt}
                />
              )}

              {currentPage === 'transfer' && (
                <TransferPage
                  user={user}
                  setUser={setUser}
                  setCurrentPage={setCurrentPage}
                  setTransactions={setTransactions}
                  addNotification={addNotification}
                  setActiveReceipt={setActiveReceipt}
                />
              )}

              {currentPage === 'receipt' && (
                <ReceiptPage
                  receipt={activeReceipt}
                  user={user}
                  setCurrentPage={setCurrentPage}
                />
              )}

              {currentPage === 'profile' && (
                <ProfilePage
                  user={user}
                  setUser={setUser}
                  onLogout={handleLogout}
                  setCurrentPage={setCurrentPage}
                />
              )}

              {currentPage === 'notifications' && (
                <NotificationsPage
                  notifications={notifications}
                  setNotifications={setNotifications}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </main>

            {/* Official Banking Footer */}
            <footer className="border-t border-slate-300 bg-white py-6 text-xs text-slate-500 mt-auto hidden md:block">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 font-medium text-[11px] pb-3 border-b border-slate-200">
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    <span className="hover:underline cursor-pointer">Privacy & Security</span>
                    <span className="hover:underline cursor-pointer">Terms of Use</span>
                    <span className="hover:underline cursor-pointer">Security Guarantee</span>
                    <span className="hover:underline cursor-pointer">Online Banking Agreement</span>
                  </div>
                  <span>Equal Housing Lender • Member FDIC</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
                  <p>© 2026 Well Fergo Bank, N.A. All rights reserved. 256-Bit SSL Encrypted Banking Portal.</p>
                  <p>Deposit products offered by Well Fergo Bank, N.A. Member FDIC.</p>
                </div>
              </div>
            </footer>

          </div>
        </div>
      )}

    </div>
  );
}
