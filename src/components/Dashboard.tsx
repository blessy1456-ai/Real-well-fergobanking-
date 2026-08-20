import React, { useState } from 'react';
import { 
  UserProfile, 
  Transaction, 
  CreditCardItem, 
  PageType 
} from '../types';
import { 
  Send, 
  ArrowDownLeft, 
  CreditCard, 
  Zap, 
  Gift, 
  ShieldCheck, 
  Coins, 
  Plus, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Copy, 
  Check, 
  Search, 
  ArrowUpRight, 
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  Building2,
  FileText,
  Smartphone,
  ExternalLink,
  Info,
  Clock,
  Award,
  Bell,
  X,
  Gauge,
  Camera,
  PieChart,
  MapPin,
  Sparkles,
  Lock,
  Wallet,
  MessageSquare,
  ArrowLeftRight
} from 'lucide-react';
import { 
  ReceivedModal, 
  CardHubModal,
  StatementsModal,
  DirectDepositModal,
  CreditCloseUpModal,
  SpendingReportModal,
  AtmLocatorModal,
  FargoAssistantModal,
  ElectricityModal, 
  ReferralModal, 
  InsuranceModal, 
  LoanModal, 
  MoreServicesModal 
} from './Modals';

interface DashboardProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  creditCards: CreditCardItem[];
  setCreditCards: React.Dispatch<React.SetStateAction<CreditCardItem[]>>;
  setCurrentPage: (page: PageType) => void;
  addNotification: (title: string, message: string, type?: 'info' | 'security' | 'service' | 'alert') => void;
  setActiveReceipt?: (receipt: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  setUser,
  transactions,
  setTransactions,
  creditCards,
  setCreditCards,
  setCurrentPage,
  addNotification,
  setActiveReceipt,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [showPromoCard, setShowPromoCard] = useState(true);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedRouting, setCopiedRouting] = useState(false);
  const [selectedTxFilter, setSelectedTxFilter] = useState<'all' | 'income' | 'debit'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /* Modal state for all authentic Wells Fargo tools */
  const [activeModal, setActiveModal] = useState<
    | 'received' 
    | 'cardHub'
    | 'statements'
    | 'directDeposit'
    | 'creditCloseUp'
    | 'spendingReport'
    | 'atmLocator'
    | 'fargo'
    | 'electricity' 
    | 'referral' 
    | 'insurance' 
    | 'loan' 
    | 'more' 
    | null
  >(null);

  /* Selected transaction detail modal */
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleCopyAcc = () => {
    navigator.clipboard.writeText(user.accountNumber);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleCopyRouting = () => {
    navigator.clipboard.writeText('121000248');
    setCopiedRouting(true);
    setTimeout(() => setCopiedRouting(false), 2000);
  };

  /* Modal Handlers */
  const handleSimulateReceive = (amount: number) => {
    addNotification('Notice', 'Kindly visit bank counter for large cash/certified deposit processing.', 'info');
  };

  const handleDepositCheck = (amount: number, account: string) => {
    setUser((prev) => ({ ...prev, balance: prev.balance + amount }));
    const newTx: Transaction = {
      id: `wf-tx-${Date.now()}`,
      title: 'Mobile Check Deposit',
      subtitle: `${account} • Mobile Deposit`,
      amount: amount,
      type: 'credit',
      category: 'deposit',
      date: 'Just now',
      status: 'Completed',
      iconName: 'Camera',
    };
    setTransactions((prev) => [newTx, ...prev]);
    addNotification('Deposit Credited', `Mobile check deposit of $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD posted successfully.`, 'service');
  };

  const handlePayElectrici = (amount: number) => {
    const newTx: Transaction = {
      id: `wf-tx-${Date.now()}`,
      title: 'Electricity & Utility Bill',
      subtitle: 'Pacific Power & Light Co. • AutoPay',
      amount: amount,
      type: 'debit',
      category: 'utility',
      date: 'Just now',
      status: 'Refund',
      iconName: 'Zap',
    };
    setTransactions((prev) => [newTx, ...prev]);
    addNotification('Payment Processing Failed - Refunded', `Payment of $${amount.toFixed(2)} USD for Electricity Bill could not be processed. Full refund issued to your account.`, 'alert');
  };

  const handleApproveLoan = (amount: number) => {
    const newTx: Transaction = {
      id: `wf-tx-${Date.now()}`,
      title: 'Personal Loan Application',
      subtitle: 'Wells Fargo Credit Facility',
      amount: amount,
      type: 'credit',
      category: 'income',
      date: 'Just now',
      status: 'Loan in processing',
      iconName: 'Coins',
    };
    setTransactions((prev) => [newTx, ...prev]);
    addNotification('Loan Status', 'Loan application in processing by credit underwriters.', 'info');
  };

  /* Filtered transactions */
  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      selectedTxFilter === 'all'
        ? true
        : selectedTxFilter === 'income'
        ? tx.type === 'credit'
        : tx.type === 'debit';
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-4 font-sans pb-16 relative">
      
      {/* 1. TOP HEADER WITH FACETED WARM GEOMETRIC BACKGROUND & GREETING */}
      <div className="relative pt-2 pb-1 px-1">
        {/* Subtle geometric watermark facet accents in background */}
        <div className="absolute top-0 right-0 w-64 h-28 opacity-25 pointer-events-none overflow-hidden -z-10">
          <svg viewBox="0 0 200 100" className="w-full h-full text-stone-400 fill-current">
            <polygon points="120,0 200,0 200,80" fill="#ded7cd" />
            <polygon points="140,0 200,80 170,100" fill="#ebe4dc" />
            <polygon points="100,0 140,0 170,100 80,40" fill="#f4ede5" />
          </svg>
        </div>

        {/* Top Right Actions (Fargo Assistant, Bell, Sign Off) */}
        <div className="flex items-center justify-end gap-3.5 mb-2">
          {/* Fargo AI Assistant quick trigger */}
          <button
            onClick={() => setActiveModal('fargo')}
            className="flex items-center gap-1 text-xs font-bold text-[#D71E28] bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-full transition cursor-pointer shadow-2xs"
            title="Ask Fargo® AI Assistant"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fargo®</span>
          </button>

          <button
            onClick={() => setCurrentPage('notifications')}
            className="text-slate-700 hover:text-black transition p-1 relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-[#D71E28] rounded-full ring-2 ring-white"></span>
          </button>

          <button
            onClick={() => setCurrentPage('login')}
            className="text-[15px] font-medium text-slate-800 hover:text-black transition cursor-pointer"
          >
            Sign off
          </button>
        </div>

        {/* Greeting Headline */}
        <h1 className="text-2xl sm:text-[32px] font-normal text-[#1A1A1A] tracking-tight leading-snug">
          {getGreeting()}, {user.name}
        </h1>
      </div>

      {/* 2A. PRIMARY ACCOUNT CARD (BUSINESS / EVERYDAY CHECKING) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 transition">
        
        {/* Account Title and Last 4 */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-extrabold uppercase tracking-wide text-[#1A1A1A]">
            BUSINESS CHECKING ...{user.accountNumber.slice(-4) || '3382'}
          </span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-slate-400 hover:text-slate-700 transition p-1 cursor-pointer"
            title="Toggle balance visibility"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Large Balance Display */}
        <div className="mt-2 text-3xl sm:text-[42px] font-light text-[#1A1A1A] tracking-tight">
          {showBalance ? `$${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••••••'}
        </div>

        {/* Subtitle */}
        <div className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Available balance
        </div>

        {/* Signify Business Cash Card Promo Banner */}
        {showPromoCard && (
          <div className="mt-4 bg-[#F8F8F9] rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between gap-3 relative">
            <div className="flex items-center gap-3.5">
              
              {/* Realistic Wells Fargo Signify Credit Card Graphic */}
              <div className="w-24 h-15 rounded-md bg-gradient-to-br from-[#1C1C1E] via-[#2A2A2E] to-[#121214] border border-black/30 p-1.5 flex flex-col justify-between shadow-xs shrink-0 text-white relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[5.5px] font-black uppercase tracking-wider text-slate-200">WELLS FARGO</span>
                  <div className="h-2 w-3 bg-[#FFCD00]/70 rounded-xs border border-amber-300/40"></div>
                </div>

                <div className="text-[7.5px] font-bold tracking-wider text-slate-100 flex flex-col">
                  <span>SIGNIFY</span>
                  <span className="text-[4.5px] text-slate-400 font-medium -mt-0.5">Business Cash</span>
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-[4.5px] text-slate-400 font-mono">...3382</span>
                  <div className="flex -space-x-1">
                    <div className="h-2 w-2 rounded-full bg-red-500/80"></div>
                    <div className="h-2 w-2 rounded-full bg-amber-400/80"></div>
                  </div>
                </div>
              </div>

              {/* Promo Text & Learn More Link */}
              <div className="pr-4">
                <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-snug">
                  Signify Business Cash Card: $500 cash rewards bonus
                </p>
                <button
                  onClick={() => setActiveModal('more')}
                  className="text-xs font-bold text-[#1F2E64] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer"
                >
                  <span>Explore Features</span>
                  <ChevronRight className="h-3 w-3 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Dismiss X button */}
            <button
              onClick={() => setShowPromoCard(false)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              title="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* 2B. WAY2SAVE® SAVINGS ACCOUNT CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 transition">
        {/* Account Title and Last 4 */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-extrabold uppercase tracking-wide text-[#1A1A1A]">
            WAY2SAVE® SAVINGS ...9476
          </span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-slate-400 hover:text-slate-700 transition p-1 cursor-pointer"
            title="Toggle balance visibility"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Large Balance Display */}
        <div className="mt-2 text-3xl sm:text-[42px] font-light text-[#1A1A1A] tracking-tight">
          {showBalance ? '$5,000.00' : '••••••••••••'}
        </div>

        {/* Subtitle */}
        <div className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Available balance
        </div>
      </div>

      {/* 2C. AUTHENTIC WELLS FARGO QUICK SERVICES BAR */}
      <div className="bg-white rounded-3xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90">
        <div className="grid grid-cols-4 gap-2 text-center">
          
          {/* Transfer & Pay */}
          <button
            onClick={() => setCurrentPage('transfer')}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer group"
          >
            <div className="h-11 w-11 rounded-2xl bg-red-50 group-hover:bg-red-100 text-[#D71E28] flex items-center justify-center transition shadow-2xs">
              <Send className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">Transfer & Pay</span>
          </button>

          {/* Zelle® */}
          <button
            onClick={() => setCurrentPage('zelle')}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-purple-50 transition cursor-pointer group"
          >
            <div className="h-11 w-11 rounded-2xl bg-purple-50 group-hover:bg-purple-100 text-[#7414CA] flex items-center justify-center transition shadow-2xs border border-purple-100">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold text-purple-900 mt-1.5 leading-tight">Zelle®</span>
          </button>

          {/* Statements */}
          <button
            onClick={() => setActiveModal('statements')}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer group"
          >
            <div className="h-11 w-11 rounded-2xl bg-amber-50 group-hover:bg-amber-100 text-amber-700 flex items-center justify-center transition shadow-2xs">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">Statements</span>
          </button>

          {/* Wire & Routing Details */}
          <button
            onClick={() => setActiveModal('received')}
            className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition cursor-pointer group"
          >
            <div className="h-11 w-11 rounded-2xl bg-blue-50 group-hover:bg-blue-100 text-blue-700 flex items-center justify-center transition shadow-2xs">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">Routing Info</span>
          </button>

        </div>
      </div>

      {/* 3. "OPEN AN ACCOUNT" SECTION WITH AUTHENTIC 3D ICONS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
            Open an account
          </h2>
          <button
            onClick={() => setActiveModal('more')}
            className="text-xs sm:text-sm font-bold text-[#1F2E64] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore all</span>
            <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* 4 Column Category Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          
          {/* Checking */}
          <div 
            onClick={() => setCurrentPage('transfer')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-b from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
              <div className="relative">
                <div className="h-7 w-4.5 bg-[#4F46E5] rounded-sm shadow-xs border border-indigo-700 flex flex-col justify-between p-0.5">
                  <div className="h-0.5 w-1.5 bg-indigo-300 rounded-full mx-auto"></div>
                  <div className="h-2 w-3 bg-[#FFCD00] rounded-xs shadow-xs mx-auto"></div>
                  <div className="h-0.5 w-0.5 bg-white rounded-full mx-auto"></div>
                </div>
              </div>
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-slate-800 mt-2">
              Checking
            </span>
          </div>

          {/* Savings & CDs */}
          <div 
            onClick={() => setActiveModal('more')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
              <div className="relative">
                <div className="h-5 w-7 bg-gradient-to-r from-orange-400 to-rose-400 rounded-md shadow-xs border border-orange-500 relative flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-[#FFCD00] border border-amber-500 absolute -top-1 right-1 shadow-xs"></div>
                  <div className="h-1.5 w-2 bg-amber-100 rounded-xs"></div>
                </div>
              </div>
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-slate-800 mt-2 leading-tight">
              Savings<br className="sm:hidden" /> & CDs
            </span>
          </div>

          {/* Investing & Wealth */}
          <div 
            onClick={() => setActiveModal('more')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-slate-800 mt-2 leading-tight text-center">
              Investing<br className="sm:hidden" /> & Wealth
            </span>
          </div>

          {/* Mortgages & Loans */}
          <div 
            onClick={() => setActiveModal('loan')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-b from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
              <div className="relative flex items-end">
                <div className="h-5 w-5 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-xs shadow-xs relative">
                  <div className="h-2 w-3 bg-amber-200/90 mx-auto mt-1 rounded-xs"></div>
                </div>
                <div className="h-3 w-4 bg-rose-500 rounded-xs -ml-1 shadow-xs border border-rose-600"></div>
              </div>
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-slate-800 mt-2 leading-tight">
              Mortgages<br className="sm:hidden" /> & Loans
            </span>
          </div>

        </div>
      </div>

      {/* 4. REAL WELLS FARGO LIFESTYLE & PLANNING CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* LifeSync® Vacation Goal */}
        <div 
          onClick={() => setActiveModal('spendingReport')}
          className="bg-white rounded-3xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 flex items-center gap-3.5 hover:shadow-md transition cursor-pointer"
        >
          <div className="w-20 h-16 rounded-2xl overflow-hidden shrink-0 shadow-2xs">
            <img 
              src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80" 
              alt="Santorini Vacation"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
              Ready for a vacation?
            </h3>
            <p className="text-[11px] text-slate-600 font-normal mt-0.5">
              Set a goal with LifeSync®
            </p>
          </div>
        </div>

        {/* Credit Close-Up® with FICO Score */}
        <div 
          onClick={() => setActiveModal('creditCloseUp')}
          className="bg-white rounded-3xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 flex items-center gap-3.5 hover:shadow-md transition cursor-pointer"
        >
          <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-2xs text-[#1F2E64]">
            <Gauge className="h-6 w-6 stroke-[1.8]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
              Credit Close-Up® (784 FICO)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              View score factors & simulator
            </p>
          </div>
        </div>

      </div>

      {/* 5. STATEMENTS & ATM LOCATOR SHORTCUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* e-Statements & Tax Forms */}
        <div
          onClick={() => setActiveModal('statements')}
          className="bg-white rounded-3xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 flex items-center justify-between hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Statements & Tax Docs</h4>
              <p className="text-[11px] text-slate-500">Download monthly PDF statements</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>

        {/* ATM & Branch Finder */}
        <div
          onClick={() => setActiveModal('atmLocator')}
          className="bg-white rounded-3xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 flex items-center justify-between hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-red-50 text-[#D71E28] flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">ATMs & Locations</h4>
              <p className="text-[11px] text-slate-500">Find nearest fee-free ATM</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>

      </div>

      {/* 6. ACCOUNT ACTIVITY & TRANSACTION LEDGER */}
      <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/90 overflow-hidden">
        
        {/* Activity Header & Filter */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1A1A1A]">
              Account Activity
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recent posted and pending transactions
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto">
            <button
              onClick={() => setSelectedTxFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                selectedTxFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedTxFilter('income')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                selectedTxFilter === 'income'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setSelectedTxFilter('debit')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                selectedTxFilter === 'debit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Transfers
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-slate-100">
          {filteredTransactions.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 font-medium">
              No transactions found.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="p-4 sm:px-5 flex items-center justify-between hover:bg-slate-50/80 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.status === 'Refund'
                        ? 'bg-blue-50 text-blue-700'
                        : tx.type === 'credit'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-[#D71E28]'
                    }`}
                  >
                    {tx.status === 'Refund' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : tx.type === 'credit' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {tx.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span>{tx.date}</span>
                      <span className="text-slate-300">•</span>
                      <span>{tx.subtitle}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs sm:text-sm font-bold font-mono ${
                      tx.status === 'Refund'
                        ? 'text-blue-700'
                        : tx.type === 'credit'
                        ? 'text-emerald-700'
                        : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] mt-0.5">
                    <span
                      className={`font-semibold px-1.5 py-0.5 rounded ${
                        tx.status === 'Refund' || tx.status?.includes('Refund')
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : tx.status === 'Pending' || tx.status?.includes('Pending')
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'text-emerald-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* FLOATING FARGO® VIRTUAL ASSISTANT LAUNCHER */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setActiveModal('fargo')}
          className="flex items-center gap-2 bg-[#D71E28] hover:bg-[#b8141d] text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition transform hover:scale-105 cursor-pointer border-2 border-white/40"
        >
          <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          <span className="text-xs font-bold tracking-wide">Ask Fargo®</span>
        </button>
      </div>

      {/* ALL AUTHENTIC WELLS FARGO MODALS */}
      <ReceivedModal
        isOpen={activeModal === 'received'}
        onClose={() => setActiveModal(null)}
        user={user}
        onSimulateReceive={handleSimulateReceive}
      />

      <CardHubModal
        isOpen={activeModal === 'cardHub'}
        onClose={() => setActiveModal(null)}
        creditCards={creditCards}
        user={user}
      />

      <StatementsModal
        isOpen={activeModal === 'statements'}
        onClose={() => setActiveModal(null)}
        user={user}
        transactions={transactions}
      />

      <DirectDepositModal
        isOpen={activeModal === 'directDeposit'}
        onClose={() => setActiveModal(null)}
        user={user}
      />

      <CreditCloseUpModal
        isOpen={activeModal === 'creditCloseUp'}
        onClose={() => setActiveModal(null)}
      />

      <SpendingReportModal
        isOpen={activeModal === 'spendingReport'}
        onClose={() => setActiveModal(null)}
        transactions={transactions}
      />

      <AtmLocatorModal
        isOpen={activeModal === 'atmLocator'}
        onClose={() => setActiveModal(null)}
      />

      <FargoAssistantModal
        isOpen={activeModal === 'fargo'}
        onClose={() => setActiveModal(null)}
        user={user}
        creditCards={creditCards}
        onOpenCardHub={() => setActiveModal('cardHub')}
        onOpenStatements={() => setActiveModal('statements')}
        onOpenAtm={() => setActiveModal('atmLocator')}
        onOpenZelle={() => setCurrentPage('zelle')}
      />

      <ElectricityModal
        isOpen={activeModal === 'electricity'}
        onClose={() => setActiveModal(null)}
        onPayBill={handlePayElectrici}
      />

      <ReferralModal
        isOpen={activeModal === 'referral'}
        onClose={() => setActiveModal(null)}
        user={user}
      />

      <InsuranceModal
        isOpen={activeModal === 'insurance'}
        onClose={() => setActiveModal(null)}
      />

      <LoanModal
        isOpen={activeModal === 'loan'}
        onClose={() => setActiveModal(null)}
        onApproveLoan={handleApproveLoan}
      />

      <MoreServicesModal
        isOpen={activeModal === 'more'}
        onClose={() => setActiveModal(null)}
        onOpenStatements={() => setActiveModal('statements')}
        onOpenCreditCloseUp={() => setActiveModal('creditCloseUp')}
        onOpenSpendingReport={() => setActiveModal('spendingReport')}
        onOpenAtmLocator={() => setActiveModal('atmLocator')}
        onOpenFargo={() => setActiveModal('fargo')}
        onOpenElectricity={() => setActiveModal('electricity')}
        onOpenLoan={() => setActiveModal('loan')}
        onOpenWireInfo={() => setActiveModal('received')}
      />

      {/* Transaction Detail Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Transaction Details</h4>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer">
                ✕
              </button>
            </div>

            <div className="text-center py-2">
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {selectedTx.type === 'credit' ? '+' : '-'}${selectedTx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-[#D71E28] font-bold mt-1">{selectedTx.title}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Description:</span>
                <span className="text-slate-900 font-bold">{selectedTx.subtitle}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Date & Time:</span>
                <span className="text-slate-900 font-medium">{selectedTx.date}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Status:</span>
                <span className={`font-bold ${
                  selectedTx.status === 'Refund' || selectedTx.status?.includes('Refund')
                    ? 'text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200'
                    : selectedTx.status === 'Pending' || selectedTx.status?.includes('Pending')
                    ? 'text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200'
                    : 'text-emerald-700'
                }`}>
                  {selectedTx.status}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Reference ID:</span>
                <span className="font-mono text-[#D71E28] font-bold">{selectedTx.id}</span>
              </div>
            </div>

            {/* Processing Payment Notice if Pending Wire (not refunded) */}
            {selectedTx.status === 'Pending' && (selectedTx.title.includes('Wire') || selectedTx.title.includes('Transfer')) && (
              <div className="rounded-2xl bg-amber-50 p-3.5 border-2 border-amber-400 text-xs text-amber-950 space-y-1.5 shadow-xs">
                <div className="font-black text-amber-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                  <span>Processing Payment</span>
                </div>
                <p className="text-[11px] font-bold leading-snug text-amber-950">
                  SIR/MA, KINDLY PROCEED TO OUR NEAREST BANK BRANCH TO COMPLETE THE PAYMENT OF THE $700 ACCOUNT OPENING FEE. THIS PAYMENT IS REQUIRED TO FINALIZE THE ACCOUNT OPENING PROCESS AND ENABLE THE ACCOUNT TO BE FULLY ACTIVATED.
                </p>
              </div>
            )}

            {/* Refunded Notice if Refunded */}
            {(selectedTx.status === 'Refund' || selectedTx.status?.includes('Refund')) && (
              <div className="rounded-2xl bg-blue-50 p-3.5 border border-blue-300 text-xs text-blue-950 space-y-1.5 shadow-xs">
                <div className="font-black text-blue-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Check className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                  <span>Transfer Refunded</span>
                </div>
                <p className="text-[11px] font-medium leading-snug text-blue-950">
                  This transfer has expired and has been fully refunded back to your main checking account.
                </p>
              </div>
            )}

            <div className="space-y-2 pt-1">
              {(selectedTx.category === 'transfer' || selectedTx.title.includes('Wire') || selectedTx.title.includes('Transfer')) && (
                <button
                  onClick={() => {
                    if (selectedTx.receiptData && setActiveReceipt) {
                      setActiveReceipt(selectedTx.receiptData);
                    }
                    setSelectedTx(null);
                    setCurrentPage('receipt');
                  }}
                  className="w-full rounded-xl bg-[#D71E28] hover:bg-[#b8141d] py-2.5 text-xs font-bold text-white shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Wire Money - Details</span>
                </button>
              )}

              <button
                onClick={() => setSelectedTx(null)}
                className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 py-2 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
