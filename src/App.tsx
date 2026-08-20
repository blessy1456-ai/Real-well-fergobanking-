import React, { useState, useEffect, useRef } from 'react';
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
import { ZellePage } from './components/ZellePage';
import { ReceiptPage } from './components/ReceiptPage';
import { ProfilePage } from './components/ProfilePage';
import { NotificationsPage } from './components/NotificationsPage';
import { X, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  
  // Persistent state initialized from localStorage
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('wf_user_storage');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user state from localStorage', e);
    }
    return INITIAL_USER;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('wf_transactions_storage');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load transactions from localStorage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [creditCards, setCreditCards] = useState<CreditCardItem[]>(() => {
    try {
      const saved = localStorage.getItem('wf_credit_cards_storage');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load credit cards from localStorage', e);
    }
    return INITIAL_CREDIT_CARDS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('wf_notifications_storage');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load notifications from localStorage', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeReceipt, setActiveReceipt] = useState<WireReceipt | null>(() => {
    try {
      const saved = localStorage.getItem('wf_active_receipt_storage');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load active receipt from localStorage', e);
    }
    return null;
  });

  /* Toast Notification Banner */
  const [toast, setToast] = useState<{ title: string; message: string; type?: string } | null>(null);

  // Set of refunded transaction IDs to prevent double refund
  const refundedIdsRef = useRef<Set<string>>(new Set());

  // Populate refunded IDs from current/loaded transactions
  useEffect(() => {
    transactions.forEach((tx) => {
      if (tx.status === 'Refund' || tx.status?.includes('Refund')) {
        refundedIdsRef.current.add(tx.id);
      }
    });
  }, []);

  // Save changes to localStorage permanently
  useEffect(() => {
    try {
      localStorage.setItem('wf_transactions_storage', JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('wf_user_storage', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('wf_notifications_storage', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('wf_credit_cards_storage', JSON.stringify(creditCards));
    } catch (e) {
      console.error(e);
    }
  }, [creditCards]);

  useEffect(() => {
    try {
      if (activeReceipt) {
        localStorage.setItem('wf_active_receipt_storage', JSON.stringify(activeReceipt));
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeReceipt]);

  // 3-Minute Auto-Refund Timer Check for Pending Wire Transfers
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = Date.now();
      const THREE_MINUTES_MS = 3 * 60 * 1000; // 180,000 ms

      setTransactions((prevTransactions) => {
        let hasChanges = false;
        let totalRefundAmount = 0;
        const newlyRefundedTxs: { title: string; amount: number; id: string }[] = [];

        const updated = prevTransactions.map((tx) => {
          // Check if this transaction is a pending wire/transfer and eligible for refund after 3 minutes
          if (
            tx.status === 'Pending' &&
            tx.createdAt &&
            !refundedIdsRef.current.has(tx.id) &&
            now - tx.createdAt >= THREE_MINUTES_MS
          ) {
            hasChanges = true;
            refundedIdsRef.current.add(tx.id);
            totalRefundAmount += tx.amount;
            newlyRefundedTxs.push({ title: tx.title, amount: tx.amount, id: tx.id });

            const updatedReceipt = tx.receiptData
              ? { ...tx.receiptData, status: 'Refund' as const }
              : undefined;

            return {
              ...tx,
              status: 'Refund',
              receiptData: updatedReceipt,
            };
          }
          return tx;
        });

        if (hasChanges) {
          // 1. Credit the money back to the user's main account
          setUser((prevUser) => ({
            ...prevUser,
            balance: prevUser.balance + totalRefundAmount,
          }));

          // 2. Add an explicit Refund credit entry in history
          newlyRefundedTxs.forEach((rtx) => {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Notification
            addNotification(
              'Transfer Refunded to Account',
              `Transfer of $${rtx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD could not be completed and has been fully refunded to your Business Checking account.`,
              'service'
            );
          });

          // Update activeReceipt if currently open receipt matches
          if (activeReceipt && newlyRefundedTxs.some((rtx) => rtx.id === activeReceipt.id)) {
            setActiveReceipt((prevRec) => prevRec ? { ...prevRec, status: 'Refund' as any } : null);
          }

          return updated;
        }

        return prevTransactions;
      });
    }, 2000); // Check every 2 seconds

    return () => clearInterval(checkInterval);
  }, [activeReceipt]);

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

              {currentPage === 'zelle' && (
                <ZellePage
                  user={user}
                  setUser={setUser}
                  setCurrentPage={setCurrentPage}
                  setTransactions={setTransactions}
                  addNotification={addNotification}
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
