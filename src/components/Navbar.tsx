import React from 'react';
import { PageType, UserProfile } from '../types';
import { 
  LayoutDashboard, 
  Send, 
  Bell, 
  User, 
  LogOut, 
  MapPin,
  HelpCircle,
  ShieldCheck,
  Search,
  Lock,
  ChevronDown
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  user: UserProfile;
  unreadCount: number;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  user,
  unreadCount,
  onLogout,
}) => {
  return (
    <>
      {/* Top Utility Strip (Desktop) */}
      <div className="hidden md:block bg-[#1a1a1a] text-slate-300 text-xs border-b border-black select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-8">
          <div className="flex items-center gap-5 text-[11px]">
            <span className="text-white font-bold border-b-2 border-[#D71E28] pb-1 cursor-pointer">
              Personal
            </span>
            <span className="text-slate-400 hover:text-white cursor-pointer transition">
              Small Business
            </span>
            <span className="text-slate-400 hover:text-white cursor-pointer transition">
              Commercial
            </span>
            <span className="text-slate-400 hover:text-white cursor-pointer transition">
              Wealth Management
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition">
              <MapPin className="h-3 w-3 text-[#FFCD00]" />
              <span>ATMs/Locations</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition">
              <HelpCircle className="h-3 w-3 text-slate-400" />
              <span>Customer Service</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* Main Red Wells Fargo Header Banner (Desktop & Tablet) */}
      <header className="hidden md:block bg-[#D71E28] border-b-4 border-[#FFCD00] shadow-md sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          
          {/* Left: Brand Logo & Main Banking Tabs */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => setCurrentPage('dashboard')}
              className="cursor-pointer hover:opacity-95 transition"
            >
              <BrandLogo size="md" />
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-3.5 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                  currentPage === 'dashboard'
                    ? 'bg-[#b3141d] text-white shadow-inner border border-red-900/40'
                    : 'text-red-100 hover:bg-[#b8141d] hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Accounts</span>
              </button>

              <button
                onClick={() => setCurrentPage('transfer')}
                className={`px-3.5 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                  currentPage === 'transfer'
                    ? 'bg-[#b3141d] text-white shadow-inner border border-red-900/40'
                    : 'text-red-100 hover:bg-[#b8141d] hover:text-white'
                }`}
              >
                <Send className="h-4 w-4" />
                <span>Transfer & Pay</span>
              </button>

              <button
                onClick={() => setCurrentPage('profile')}
                className={`px-3.5 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                  currentPage === 'profile'
                    ? 'bg-[#b3141d] text-white shadow-inner border border-red-900/40'
                    : 'text-red-100 hover:bg-[#b8141d] hover:text-white'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Security & Profile</span>
              </button>
            </nav>
          </div>

          {/* Right: Notification bell, User info, and Sign Off Button */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell */}
            <button
              onClick={() => setCurrentPage('notifications')}
              className={`relative p-2 rounded-lg transition ${
                currentPage === 'notifications'
                  ? 'bg-[#b3141d] text-white'
                  : 'text-red-100 hover:bg-[#b8141d] hover:text-white'
              }`}
              title="Notifications & Alerts"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FFCD00] text-black font-extrabold text-[9px] px-1 shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Pill */}
            <div 
              onClick={() => setCurrentPage('profile')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#b3141d]/80 hover:bg-[#b3141d] border border-red-900/40 cursor-pointer text-white text-xs transition"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-6 w-6 rounded-full object-cover ring-1 ring-[#FFCD00]"
              />
              <span className="font-bold hidden lg:inline">{user.name}</span>
            </div>

            {/* Official Sign Off Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#D71E28] text-xs font-bold shadow-sm transition border border-red-200 cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5 text-[#D71E28]" />
              <span>Sign Off</span>
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#D71E28] border-b-2 border-[#FFCD00] md:hidden shadow-md">
        <div className="flex items-center justify-between px-3.5 py-2.5">
          <div 
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <BrandLogo size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('notifications')}
              className="relative p-1.5 rounded-md text-white hover:bg-red-800"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FFCD00] text-black text-[8px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentPage('profile')}
              className="p-0.5 rounded-full ring-1 ring-white"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-6 w-6 rounded-full object-cover"
              />
            </button>

            <button
              onClick={onLogout}
              className="px-2.5 py-1 rounded bg-white text-[#D71E28] text-[11px] font-bold"
            >
              Sign Off
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Wells Fargo Mobile App Style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-300 bg-white py-1 px-1 shadow-lg md:hidden">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[10px] transition ${
            currentPage === 'dashboard' ? 'text-[#D71E28] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Accounts</span>
        </button>

        <button
          onClick={() => setCurrentPage('transfer')}
          className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[10px] transition ${
            currentPage === 'transfer' ? 'text-[#D71E28] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="h-5 w-5" />
          <span>Transfer & Pay</span>
        </button>

        <button
          onClick={() => setCurrentPage('notifications')}
          className={`relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[10px] transition ${
            currentPage === 'notifications' ? 'text-[#D71E28] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="h-5 w-5" />
          <span>Alerts</span>
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#D71E28] px-1 text-[8px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentPage('profile')}
          className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-[10px] transition ${
            currentPage === 'profile' ? 'text-[#D71E28] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="h-5 w-5" />
          <span>Security & Menu</span>
        </button>
      </nav>
    </>
  );
};
