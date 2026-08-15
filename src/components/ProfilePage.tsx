import React, { useState } from 'react';
import { 
  UserProfile, 
  PageType 
} from '../types';
import { 
  User, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Sparkles, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  Check, 
  X,
  Headphones,
  MessageSquare,
  Building2
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onLogout: () => void;
  setCurrentPage: (page: PageType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  setUser,
  onLogout,
  setCurrentPage,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'help' | null>(null);

  /* Personal Info Form */
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editAddress, setEditAddress] = useState(user.address);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /* Security toggles */
  const [biometrics, setBiometrics] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15 mins');

  /* Help Assistant chat mock */
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: 'Hello Sofia! Welcome to Well Fergo Online Support. How may I assist you with your accounts today?' }
  ]);
  const [userMsg, setUserMsg] = useState('');

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      phone: editPhone,
      address: editAddress,
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const newMsgs = [
      ...chatMessages,
      { sender: 'user', text: userMsg }
    ];
    setChatMessages(newMsgs);
    const textLower = userMsg.toLowerCase();
    setUserMsg('');

    setTimeout(() => {
      let reply = "I can assist with transfers, branch verification inquiries, and account services.";
      if (textLower.includes('transfer')) {
        reply = "To start a wire or interbank transfer, click 'Transfer & Pay' from the navigation bar.";
      } else if (textLower.includes('balance')) {
        reply = `Your total available balance is $${user.balance.toLocaleString()} USD.`;
      } else if (textLower.includes('verification') || textLower.includes('branch')) {
        reply = "In-person branch verification is an FDIC and security compliance measure for your account protection.";
      }
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16 animate-fadeIn">
      
      {/* User Overview Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-[#D71E28] shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#D71E28] text-[#FFCD00] border-2 border-white shadow-xs">
              <Sparkles className="h-3 w-3" />
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {user.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-0.5 text-xs font-bold text-[#D71E28] border border-red-200">
                {user.accountType}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Member since {user.memberSince} • Account: <span className="font-mono font-bold text-[#D71E28]">{user.accountNumber}</span>
            </p>

            <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#D71E28]" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#D71E28]" />
                <span>{user.address}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ACCOUNT MENU OPTIONS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-[#D71E28] uppercase tracking-wider mb-2">
          Account & Security Settings
        </h3>

        {/* 1. Personal Information */}
        <button
          onClick={() => setActiveTab(activeTab === 'personal' ? null : 'personal')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === 'personal' ? 'border-[#D71E28] bg-red-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-[#D71E28] border border-red-200">
              <User className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-900">Personal Information</h4>
              <p className="text-xs text-slate-500">Manage phone number and physical mailing address</p>
            </div>
          </div>
          <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${activeTab === 'personal' ? 'rotate-90 text-[#D71E28]' : ''}`} />
        </button>

        {activeTab === 'personal' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-red-200 space-y-4 animate-fadeIn">
            <form onSubmit={handleSavePersonalInfo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-300 py-2.5 px-3 text-xs text-slate-900 font-medium focus:border-[#D71E28] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mailing Address</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-300 py-2.5 px-3 text-xs text-slate-900 font-medium focus:border-[#D71E28] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="rounded-xl bg-[#D71E28] hover:bg-[#b8141d] px-4 py-2 text-xs font-bold text-white transition shadow-sm cursor-pointer"
                >
                  Save Profile Changes
                </button>
                {saveSuccess && <span className="text-xs text-emerald-600 font-bold">✓ Details updated!</span>}
              </div>
            </form>
          </div>
        )}

        {/* 2. Security */}
        <button
          onClick={() => setActiveTab(activeTab === 'security' ? null : 'security')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === 'security' ? 'border-[#D71E28] bg-red-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-[#D71E28] border border-red-200">
              <Shield className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-900">Security</h4>
              <p className="text-xs text-slate-500">Biometric login, 2FA authentication, and PIN protection</p>
            </div>
          </div>
          <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${activeTab === 'security' ? 'rotate-90 text-[#D71E28]' : ''}`} />
        </button>

        {activeTab === 'security' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-red-200 space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <div>
                <p className="font-bold text-slate-900">Biometric Authentication</p>
                <p className="text-slate-500 text-[11px]">FaceID / TouchID enabled for quick sign in</p>
              </div>
              <input
                type="checkbox"
                checked={biometrics}
                onChange={(e) => setBiometrics(e.target.checked)}
                className="h-4 w-4 rounded bg-white border-slate-300 text-[#D71E28] focus:ring-[#D71E28]"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <div>
                <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                <p className="text-slate-500 text-[11px]">Require SMS/Authenticator code on new devices</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="h-4 w-4 rounded bg-white border-slate-300 text-[#D71E28] focus:ring-[#D71E28]"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-bold text-slate-900">Auto Session Lock</p>
                <p className="text-slate-500 text-[11px]">Automatically lock screen after inactivity</p>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="rounded-lg bg-white border border-slate-300 py-1 px-2 text-xs text-slate-900 font-medium focus:border-[#D71E28]"
              >
                <option value="5 mins">5 mins</option>
                <option value="15 mins">15 mins</option>
                <option value="30 mins">30 mins</option>
              </select>
            </div>
          </div>
        )}

        {/* 3. Help & Support */}
        <button
          onClick={() => setActiveTab(activeTab === 'help' ? null : 'help')}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === 'help' ? 'border-[#D71E28] bg-red-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-[#D71E28] border border-red-200">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-900">Help & Support</h4>
              <p className="text-xs text-slate-500">Customer representative assistance & official FAQs</p>
            </div>
          </div>
          <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${activeTab === 'help' ? 'rotate-90 text-[#D71E28]' : ''}`} />
        </button>

        {activeTab === 'help' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-red-200 space-y-3 animate-fadeIn text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-red-800 font-bold pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-[#D71E28]" />
                <span>Well Fergo Concierge Support</span>
              </div>
              <div className="text-[11px] text-slate-500 font-normal">
                Direct Line: <span className="text-[#D71E28] font-mono font-bold">1-800-869-3557</span>
              </div>
            </div>

            <div className="h-40 overflow-y-auto space-y-2 p-3 bg-white rounded-xl border border-slate-200">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl max-w-[85%] text-xs ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-[#D71E28] text-white font-medium'
                      : 'mr-auto bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                placeholder="Ask about transfers, accounts, branch verification..."
                className="flex-1 rounded-xl bg-white border border-slate-300 py-2 px-3 text-xs text-slate-900 font-medium focus:border-[#D71E28] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#D71E28] hover:bg-[#b8141d] px-3 py-2 text-xs font-bold text-white shadow-sm cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        )}

      </div>

      {/* REQUIRED LOG OUT BUTTON */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-red-50 py-3.5 px-4 text-sm font-bold text-[#D71E28] border border-red-200 shadow-sm transition active:scale-[0.99] cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-[#D71E28]" />
          <span>Log Out of Well Fergo</span>
        </button>
      </div>

    </div>
  );
};
