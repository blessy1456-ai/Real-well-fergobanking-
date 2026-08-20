import React, { useState } from 'react';
import { 
  UserProfile, 
  PageType 
} from '../types';
import { 
  User, 
  ShieldCheck, 
  Smartphone, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Sparkles, 
  ChevronRight, 
  LogOut, 
  Check, 
  Eye, 
  EyeOff, 
  Globe, 
  Copy, 
  Clock, 
  Laptop, 
  Layers, 
  ArrowLeft,
  X,
  Lock
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onLogout: () => void;
  setCurrentPage: (page: PageType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onLogout,
  setCurrentPage,
}) => {
  /* Active Sub-modal / Drawer for specific Wells Fargo setting */
  const [activeSection, setActiveSection] = useState<
    | 'trusted_devices'
    | null
  >(null);

  /* Security Settings */
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [quickViewEnabled, setQuickViewEnabled] = useState(true);
  const [fargoVoiceEnabled, setFargoVoiceEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15 mins');
  const [showSSN, setShowSSN] = useState(false);

  /* Language Selection */
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  /* Copy Feedback */
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 font-sans pb-20 animate-fadeIn">
      
      {/* 1. TOP HEADER & GREETING */}
      <div className="pt-2 pb-1 px-1 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="text-slate-600 hover:text-slate-900 p-1 -ml-1 sm:hidden cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl sm:text-[28px] font-normal text-[#1A1A1A] tracking-tight">
              Profile & Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Wells Fargo verified personal profile & account security
          </p>
        </div>

        <button
          onClick={onLogout}
          className="text-xs sm:text-sm font-semibold text-[#D71E28] hover:text-[#b8141d] bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign off</span>
        </button>
      </div>

      {/* 2. AUTHENTIC USER IDENTITY CARD (Read-Only Bank Verified Profile) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 relative overflow-hidden">
        {/* Subtle geometric watermark facet accents */}
        <div className="absolute -top-6 -right-6 w-36 h-36 opacity-20 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full text-stone-400 fill-current">
            <polygon points="50,0 100,0 100,60" fill="#ded7cd" />
            <polygon points="60,0 100,60 80,100" fill="#ebe4dc" />
            <polygon points="30,0 60,0 80,100 20,40" fill="#f4ede5" />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Identity Shield Icon */}
          <div className="relative shrink-0">
            <div className="h-16 w-16 rounded-2xl bg-[#D71E28] text-white flex items-center justify-center shadow-md">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#1F2E64] text-white flex items-center justify-center border-2 border-white shadow-xs" title="Bank Verified Profile">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FFCD00]" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 self-center sm:self-auto rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-[#D71E28] border border-red-200">
                {user.accountType.toUpperCase()}
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1">
              <span>Customer ID: <strong className="text-slate-800 font-mono">WF-8924025</strong></span>
              <span>•</span>
              <span>Member since {user.memberSince}</span>
            </div>

            {/* Quick Profile Summary Pills */}
            <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2 text-xs">
              <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl text-slate-700">
                <Phone className="h-3 w-3 text-[#D71E28]" />
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl text-slate-700">
                <Building2 className="h-3 w-3 text-[#1F2E64]" />
                <span className="font-medium font-mono">Acct ...{user.accountNumber.slice(-4)}</span>
              </div>
            </div>
          </div>

          {/* Verified Profile Status Badge */}
          <div className="sm:self-start inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>Verified Profile</span>
          </div>
        </div>
      </div>

      {/* 3. GROUP 1: PROFILE & PERSONAL DETAILS (Read-Only Bank Verified Information) */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
          Profile & Personal Details
        </h3>

        {/* Contact Details List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-0.5">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span>Full Legal Name</span>
            </div>
            <p className="text-xs font-bold text-slate-900">{user.name}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-0.5">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-500" />
              <span>Registered Mobile Phone</span>
            </div>
            <p className="text-xs font-bold text-slate-900">{user.phone}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-0.5">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-500" />
              <span>Primary Email</span>
            </div>
            <p className="text-xs font-bold text-slate-900">{user.email || 'sofia.martinez@business.com'}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-0.5">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>Mailing / Residential Address</span>
            </div>
            <p className="text-xs font-bold text-slate-900">{user.address}</p>
          </div>
        </div>

        {/* Account & Routing Numbers */}
        <div className="p-3.5 rounded-2xl bg-[#F8F8F9] border border-slate-200/70 space-y-2 mt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Account Number (Business Checking):</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-slate-900">{user.accountNumber}</span>
              <button
                onClick={() => handleCopy(user.accountNumber, 'account')}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title="Copy Account Number"
              >
                {copiedField === 'account' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Routing Number (Direct Deposit / ACH):</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-[#D71E28]">121000248</span>
              <button
                onClick={() => handleCopy('121000248', 'routing')}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title="Copy Routing Number"
              >
                {copiedField === 'routing' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Social Security / Tax ID (SSN):</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-slate-800">
                {showSSN ? '***-**-6819' : '•••-••-6819'}
              </span>
              <button
                onClick={() => setShowSSN(!showSSN)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title="Toggle SSN display"
              >
                {showSSN ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. GROUP 2: SIGN ON & SECURITY CENTER */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 space-y-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
          Sign On & Security Center
        </h3>

        {/* Biometric Sign On */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-[#1F2E64] flex items-center justify-center shrink-0">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Face ID® / Touch ID® Biometrics</h4>
              <p className="text-xs text-slate-500">Sign on seamlessly using device biometric scan</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={biometricsEnabled}
              onChange={(e) => setBiometricsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D71E28]"></div>
          </label>
        </div>

        {/* 2-Step Verification */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">2-Step Verification (2FA)</h4>
              <p className="text-xs text-slate-500">Receive authorization code via SMS or push alert</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Trusted Devices */}
        <button
          onClick={() => setActiveSection('trusted_devices')}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 group-hover:bg-blue-100 text-blue-700 flex items-center justify-center transition shrink-0">
              <Laptop className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-900">Manage Trusted Devices</h4>
              <p className="text-xs text-slate-500">2 registered mobile devices & workstations</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition" />
        </button>

        {/* Auto Session Inactivity Lock */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Automatic Inactivity Timeout</h4>
              <p className="text-xs text-slate-500">Auto-lock session for banking security</p>
            </div>
          </div>
          <select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            className="rounded-xl bg-slate-100 border border-slate-200 py-1.5 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D71E28] cursor-pointer"
          >
            <option value="5 mins">5 mins</option>
            <option value="10 mins">10 mins</option>
            <option value="15 mins">15 mins (Standard)</option>
            <option value="30 mins">30 mins</option>
          </select>
        </div>
      </div>

      {/* 5. GROUP 3: FARGO® & APP PREFERENCES */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 space-y-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
          Preferences & Experience
        </h3>

        {/* Language Selection */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Language Preference</h4>
              <p className="text-xs text-slate-500">Wells Fargo Online® & Mobile language</p>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                language === 'es' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Español
            </button>
          </div>
        </div>

        {/* Fargo AI Assistant Suggestions */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-red-50 text-[#D71E28] flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Fargo® Virtual Assistant</h4>
              <p className="text-xs text-slate-500">Provide smart spending insights & fast banking voice search</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={fargoVoiceEnabled}
              onChange={(e) => setFargoVoiceEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D71E28]"></div>
          </label>
        </div>

        {/* Quick View */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-[#1F2E64] flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Quick View</h4>
              <p className="text-xs text-slate-500">View balances on sign on screen without entering password</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={quickViewEnabled}
              onChange={(e) => setQuickViewEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1F2E64]"></div>
          </label>
        </div>
      </div>

      {/* 6. PROMINENT SIGN OFF BUTTON */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-red-50 py-4 px-4 text-sm font-bold text-[#D71E28] border border-red-200 shadow-sm transition active:scale-[0.99] cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-[#D71E28]" />
          <span>Sign off of Wells Fargo</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: TRUSTED DEVICES & SESSIONS */}
      {/* ========================================================================= */}
      {activeSection === 'trusted_devices' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Laptop className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-[#1A1A1A]">Trusted Devices & Sessions</h3>
              </div>
              <button 
                onClick={() => setActiveSection(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              These registered devices can sign on to Wells Fargo Online® without secondary SMS challenge prompts.
            </p>

            <div className="space-y-3">
              {/* Device 1 (Current) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900">Apple iPhone 15 Pro Max</h4>
                      <span className="text-[9px] font-extrabold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded">THIS DEVICE</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Wells Fargo Mobile • Active now</p>
                  </div>
                </div>
              </div>

              {/* Device 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">MacBook Pro 16" (Safari / macOS)</h4>
                    <p className="text-[11px] text-slate-500">Last sign in: Yesterday at 4:18 PM • San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveSection(null)}
                className="w-full rounded-xl bg-[#D71E28] hover:bg-[#b8141d] py-3 text-xs font-bold text-white shadow-sm transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
