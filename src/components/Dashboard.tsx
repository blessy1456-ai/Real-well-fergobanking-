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
  ShoppingBag, 
  ChevronRight,
  ShieldAlert,
  Building2,
  FileText,
  Smartphone,
  ExternalLink,
  Info,
  Clock,
  Award
} from 'lucide-react';
import { 
  ReceivedModal, 
  AddCardModal, 
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
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedRouting, setCopiedRouting] = useState(false);
  const [selectedTxFilter, setSelectedTxFilter] = useState<'all' | 'income' | 'debit'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /* Modal state */
  const [activeModal, setActiveModal] = useState<
    'received' | 'addCard' | 'electricity' | 'referral' | 'insurance' | 'loan' | 'more' | null
  >(null);

  /* Selected transaction detail modal */
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

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
    addNotification('Notice', 'Kindly go to bank for deposit processing.', 'info');
  };

  const handleAddCard = (newCard: CreditCardItem) => {
    setCreditCards((prev) => [newCard, ...prev]);
    addNotification('Credit Card Issued', `New ${newCard.cardName} issued with $${newCard.limit.toLocaleString()} USD limit.`, 'service');
  };

  const handlePayElectrici = (amount: number) => {
    setUser((prev) => ({ ...prev, balance: Math.max(0, prev.balance - amount) }));
    const newTx: Transaction = {
      id: `wf-tx-${Date.now()}`,
      title: 'Electricity & Utility Bill',
      subtitle: 'Pacific Power & Light Co. • AutoPay',
      amount: amount,
      type: 'debit',
      category: 'utility',
      date: 'Just now',
      status: 'Completed',
      iconName: 'Zap',
    };
    setTransactions((prev) => [newTx, ...prev]);
    addNotification('Bill Payment Paid', `Paid $${amount} USD for Electricity Bill.`, 'service');
  };

  const handleApproveLoan = (amount: number) => {
    const newTx: Transaction = {
      id: `wf-tx-${Date.now()}`,
      title: 'Personal Loan Application',
      subtitle: 'Well Fergo Credit Facility',
      amount: amount,
      type: 'credit',
      category: 'income',
      date: 'Just now',
      status: 'Loan in processing',
      iconName: 'Coins',
    };
    setTransactions((prev) => [newTx, ...prev]);
    addNotification('Loan Status', 'Loan in processing.', 'info');
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
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* 1. Wells Fargo Official Welcome Strip */}
      <div className="bg-white rounded-xl border border-slate-300 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#D71E28] uppercase tracking-wider">
              Well Fergo Online®
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Last sign-on: Today at 08:14 AM PT
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Good afternoon, {user.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
            <span>Primary Account: <strong className="font-mono text-slate-900">{user.accountNumber}</strong></span>
            <span className="text-slate-300">|</span>
            <span>Routing: <strong className="font-mono text-slate-900">121000248</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> 2FA Verified
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveModal('received')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 transition shadow-xs"
          >
            <Building2 className="h-4 w-4 text-[#D71E28]" />
            <span>Wire / Routing Info</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('transfer')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D71E28] hover:bg-[#b8141d] text-xs font-bold text-white shadow-sm transition"
          >
            <Send className="h-4 w-4" />
            <span>Transfer Funds</span>
          </button>
        </div>
      </div>

      {/* 2. Main Account Overview & Quick Action Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Classic Wells Fargo Accounts Summary Table */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Balance Banner Box */}
          <div className="bg-gradient-to-r from-[#D71E28] via-[#b8141d] to-[#990f17] rounded-xl p-6 text-white shadow-md border-b-4 border-[#FFCD00] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-100">
                  Total Available Deposits
                </span>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                    {showBalance ? `$${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••••••'}
                  </span>
                  <span className="bg-[#FFCD00] text-black font-bold text-xs px-2 py-0.5 rounded">
                    USD
                  </span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-red-200 hover:text-white transition p-1"
                    title="Toggle balance visibility"
                  >
                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-red-100 mt-1">
                  Includes Everyday Checking and Way2Save® Savings balances
                </p>
              </div>

              <div className="bg-black/25 rounded-lg p-3 border border-white/10 text-xs space-y-1">
                <div className="flex justify-between gap-4 text-red-100">
                  <span>Routing Number:</span>
                  <button onClick={handleCopyRouting} className="font-mono font-bold text-[#FFCD00] hover:underline flex items-center gap-1">
                    121000248 {copiedRouting ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="flex justify-between gap-4 text-red-100">
                  <span>Account Number:</span>
                  <button onClick={handleCopyAcc} className="font-mono font-bold text-[#FFCD00] hover:underline flex items-center gap-1">
                    ...3382 {copiedAcc ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* FOUR PRIMARY ACTION BUTTONS (As required) */}
            <div className="mt-6 pt-4 border-t border-red-500/50 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* 1. Transfer */}
              <button
                onClick={() => setCurrentPage('transfer')}
                className="flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-slate-100 py-2.5 px-3 text-xs font-bold text-[#D71E28] shadow-sm transition active:scale-98 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Transfer</span>
              </button>

              {/* 2. Received */}
              <button
                onClick={() => setActiveModal('received')}
                className="flex items-center justify-center gap-2 rounded-lg bg-black/30 hover:bg-black/45 py-2.5 px-3 text-xs font-bold text-white border border-white/20 transition active:scale-98 cursor-pointer"
              >
                <ArrowDownLeft className="h-4 w-4 text-[#FFCD00]" />
                <span>Received</span>
              </button>

              {/* 3. Add Credit Card */}
              <button
                onClick={() => setActiveModal('addCard')}
                className="flex items-center justify-center gap-2 rounded-lg bg-black/30 hover:bg-black/45 py-2.5 px-3 text-xs font-bold text-white border border-white/20 transition active:scale-98 cursor-pointer"
              >
                <CreditCard className="h-4 w-4 text-[#FFCD00]" />
                <span>Add Card</span>
              </button>

              {/* 4. More Services */}
              <button
                onClick={() => setActiveModal('more')}
                className="flex items-center justify-center gap-2 rounded-lg bg-black/30 hover:bg-black/45 py-2.5 px-3 text-xs font-bold text-white border border-white/20 transition active:scale-98 cursor-pointer"
              >
                <Building2 className="h-4 w-4 text-[#FFCD00]" />
                <span>More Services</span>
              </button>

            </div>
          </div>

          {/* Authentic Wells Fargo Account Ledger Cards */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Checking & Savings Accounts
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                2 Accounts Active
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              
              {/* Account 1: Everyday Checking */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#D71E28] hover:underline cursor-pointer">
                      Everyday Checking
                    </span>
                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      ...3382
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Primary Account • Direct Deposit Active • Overdraft Protection
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-500">Available balance</div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Present balance: ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Account 2: Way2Save Savings */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#D71E28] hover:underline cursor-pointer">
                      Way2Save® Savings
                    </span>
                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      ...8812
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    High Yield Savings • 2.40% Annual Percentage Yield (APY)
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-500">Available balance</div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    $24,500.00
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex sm:justify-end items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +$48.20 Interest this month
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Credit Cards Section */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Credit Cards & Lines of Credit
              </h2>
              <button
                onClick={() => setActiveModal('addCard')}
                className="text-xs font-bold text-[#D71E28] hover:underline flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Apply for New Card
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {creditCards.map((card) => (
                <div key={card.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                  <div className="flex items-center gap-3.5">
                    <div className={`h-12 w-18 rounded-lg bg-gradient-to-r ${card.gradient} p-2 text-white shadow-xs flex flex-col justify-between shrink-0 border border-black/10`}>
                      <span className="text-[8px] font-bold uppercase tracking-wider">{card.cardType}</span>
                      <span className="text-[9px] font-mono tracking-wider">{card.cardNumber.slice(-4)}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {card.cardName}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Card No: <span className="font-mono">{card.cardNumber}</span> • Exp: {card.expiry}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs text-slate-500">Current balance</div>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Available credit: ${(card.limit - card.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: FICO Score, Quick Services, Offers */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* FICO® Score 9 Card */}
          <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#D71E28]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Credit Close-Up®
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Experian
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  784
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-0.5">
                  Excellent Credit Rating
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  FICO® Score 9 as of Aug 2026
                </p>
              </div>

              <div className="h-16 w-16 rounded-full border-4 border-emerald-500 border-t-emerald-600 flex items-center justify-center text-emerald-700 font-bold text-xs bg-emerald-50">
                Top 8%
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              Your credit health is in the top tier. You qualify for prime lending rates and preferred card limits.
            </p>
          </div>

          {/* Bank Official Services Widget (Utility hub) */}
          <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#D71E28]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Bank Official Services
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#D71E28] uppercase">
                Well Fergo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Electricity Bill */}
              <button
                onClick={() => setActiveModal('electricity')}
                className="p-3 rounded-lg bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 text-left transition group cursor-pointer"
              >
                <div className="h-8 w-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Electricity Bill</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Pay Utility</div>
              </button>

              {/* Personal Loan */}
              <button
                onClick={() => setActiveModal('loan')}
                className="p-3 rounded-lg bg-slate-50 hover:bg-red-50/70 border border-slate-200 hover:border-red-300 text-left transition group cursor-pointer"
              >
                <div className="h-8 w-8 rounded-md bg-red-100 text-[#D71E28] flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Coins className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Instant Loan</div>
                <div className="text-[10px] text-[#D71E28] font-semibold mt-0.5">$25k Pre-approved</div>
              </button>

              {/* Insurance */}
              <button
                onClick={() => setActiveModal('insurance')}
                className="p-3 rounded-lg bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-left transition group cursor-pointer"
              >
                <div className="h-8 w-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Insurance</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Global Shield</div>
              </button>

              {/* Refer & Earn */}
              <button
                onClick={() => setActiveModal('referral')}
                className="p-3 rounded-lg bg-slate-50 hover:bg-red-50/70 border border-slate-200 hover:border-red-300 text-left transition group cursor-pointer"
              >
                <div className="h-8 w-8 rounded-md bg-red-100 text-[#D71E28] flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Gift className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Refer & Earn</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">$50 Bonus</div>
              </button>

            </div>

            <button
              onClick={() => setActiveModal('more')}
              className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <span>Explore All Bank Features</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Zero Liability Security Banner */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-2 border-l-4 border-[#D71E28]">
            <div className="flex items-center gap-2 text-[#FFCD00] text-xs font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>Well Fergo Security Guarantee</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              24/7 proactive transaction monitoring with zero liability for unauthorized activity.
            </p>
          </div>

        </div>

      </div>

      {/* 3. RECENT ACTIVITY & LEDGER SECTION */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        
        {/* Header & Filter Controls */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Account Activity & Statements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recent posted and pending transactions for Sofia Lincoin
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 rounded-lg bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 border border-slate-300 focus:border-[#D71E28] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setSelectedTxFilter('all')}
                className={`px-3 py-1.5 rounded font-bold transition ${
                  selectedTxFilter === 'all'
                    ? 'bg-[#D71E28] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedTxFilter('income')}
                className={`px-3 py-1.5 rounded font-bold transition ${
                  selectedTxFilter === 'income'
                    ? 'bg-[#D71E28] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => setSelectedTxFilter('debit')}
                className={`px-3 py-1.5 rounded font-bold transition ${
                  selectedTxFilter === 'debit'
                    ? 'bg-[#D71E28] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Payments
              </button>
            </div>
          </div>
        </div>

        {/* Transaction Table / List */}
        <div className="divide-y divide-slate-200">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              No transactions match your search filter.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      tx.type === 'credit'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-[#D71E28] border-red-200'
                    }`}
                  >
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {tx.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{tx.subtitle}</span>
                      <span className="text-slate-300">•</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-sm sm:text-base font-bold font-mono ${
                      tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                      tx.status === 'Loan in processing' || tx.status === 'Verification Required'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info strip */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Showing latest official activity</span>
          <button 
            onClick={() => setActiveModal('more')}
            className="text-[#D71E28] font-bold hover:underline"
          >
            Download PDF Statement
          </button>
        </div>

      </div>

      {/* ALL SERVICE MODALS */}
      <ReceivedModal
        isOpen={activeModal === 'received'}
        onClose={() => setActiveModal(null)}
        user={user}
        onSimulateReceive={handleSimulateReceive}
      />

      <AddCardModal
        isOpen={activeModal === 'addCard'}
        onClose={() => setActiveModal(null)}
        onAddCard={handleAddCard}
      />

      <ElectricityModal
        isOpen={activeModal === 'electricity'}
        onClose={() => setActiveModal(null)}
        onPayBill={handlePayElectrici}
      />

      <ReferralModal
        isOpen={activeModal === 'referral'}
        onClose={() => setActiveModal(null)}
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
      />

      {/* Transaction Detail Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-xl bg-white border border-slate-300 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">Transaction Receipt</h4>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-700 text-lg">
                ✕
              </button>
            </div>

            <div className="text-center py-2">
              <div className="text-2xl font-black text-slate-900 font-mono">
                {selectedTx.type === 'credit' ? '+' : '-'}${selectedTx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-[#D71E28] font-bold mt-1">{selectedTx.title}</p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2.5 text-xs">
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
                <span className="font-bold text-emerald-700">{selectedTx.status}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Reference ID:</span>
                <span className="font-mono text-[#D71E28] font-bold">{selectedTx.id}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full rounded-lg bg-[#D71E28] hover:bg-[#b8141d] py-2.5 text-xs font-bold text-white shadow-sm transition cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
