import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  CreditCard, 
  Zap, 
  Gift, 
  ShieldCheck, 
  Coins, 
  Sparkles,
  Smartphone,
  Droplets,
  DollarSign,
  FileText,
  Building2,
  ArrowRight,
  Info,
  AlertCircle,
  Clock,
  Camera,
  Upload,
  Lock,
  Unlock,
  Download,
  Printer,
  PieChart,
  BarChart3,
  MapPin,
  Send,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  RefreshCw,
  Sliders,
  Globe,
  Calendar,
  ChevronRight,
  Eye,
  EyeOff,
  Navigation,
  Phone,
  Search,
  SlidersHorizontal,
  Wallet
} from 'lucide-react';
import { UserProfile, CreditCardItem, Transaction } from '../types';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const ModalBase: React.FC<ModalBaseProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  icon, 
  children,
  maxWidth = 'max-w-lg'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className={`relative w-full ${maxWidth} rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 border border-red-200 text-[#D71E28]">
              {icon}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">{title}</h3>
              <p className="text-[10px] text-[#D71E28] font-bold uppercase tracking-wider">Wells Fargo Online®</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">{children}</div>

      </div>
    </div>
  );
};

/* 1. RECEIVED / WIRE ROUTING MODAL */
export const ReceivedModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSimulateReceive: (amount: number) => void;
}> = ({ isOpen, onClose, user, onSimulateReceive }) => {
  const [copied, setCopied] = useState(false);
  const [depositAmount, setDepositAmount] = useState('500');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = () => {
    const val = parseFloat(depositAmount) || 500;
    onSimulateReceive(val);
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Wire & Routing Information" icon={<Building2 className="h-5 w-5" />}>
      <div className="space-y-4">
        
        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-5 border border-slate-200">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=wellsfargo:account:${user.accountNumber}`} 
              alt="Account QR Code"
              className="h-28 w-28 object-contain"
            />
          </div>
          <p className="mt-2.5 text-xs text-slate-500 font-medium">Scan to send funds directly to this account</p>
        </div>

        {/* Account Details */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Bank Name</span>
            <span className="font-bold text-slate-900">Wells Fargo Bank, N.A.</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Account Name</span>
            <span className="font-bold text-slate-900">{user.name}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#D71E28]">{user.accountNumber}</span>
              <button 
                onClick={() => copyToClipboard(user.accountNumber)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Routing (ABA / Direct Deposit)</span>
            <span className="font-mono font-bold text-slate-900">121000248</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Domestic Wire Routing</span>
            <span className="font-mono font-bold text-slate-900">121000248</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">International SWIFT / BIC</span>
            <span className="font-mono font-bold text-slate-900">WFGBUS6S</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Bank Address</span>
            <span className="text-slate-700 text-right">420 Montgomery St, San Francisco, CA 94104</span>
          </div>
        </div>

        {/* Bank Deposit Notice */}
        <div className="rounded-2xl bg-amber-50 p-4 border border-amber-300 space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Branch Counter Notice</span>
          </div>
          <p className="text-amber-800 text-xs leading-relaxed">
            To deposit large cash amounts or complete certified checks into your account, visit any Wells Fargo branch teller.
          </p>
          <div className="flex gap-2 pt-1">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">$</span>
              <input 
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-xl py-1.5 pl-7 pr-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#D71E28]"
                placeholder="500"
              />
            </div>
            <button
              onClick={handleDeposit}
              className="rounded-xl bg-[#D71E28] hover:bg-[#b8141d] px-4 py-1.5 text-xs font-bold text-white transition shadow-xs cursor-pointer"
            >
              Deposit Funds
            </button>
          </div>
        </div>

      </div>
    </ModalBase>
  );
};

/* 2. MOBILE CHECK DEPOSIT MODAL */
export const CheckDepositModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onDepositCheck: (amount: number, account: string) => void;
}> = ({ isOpen, onClose, user, onDepositCheck }) => {
  const [step, setStep] = useState<'details' | 'capturingFront' | 'capturingBack' | 'review' | 'success'>('details');
  const [amount, setAmount] = useState('1250.00');
  const [selectedAccount, setSelectedAccount] = useState<'checking' | 'savings'>('checking');
  const [frontCaptured, setFrontCaptured] = useState(false);
  const [backCaptured, setBackCaptured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCaptureFront = () => {
    setFrontCaptured(true);
    setStep('capturingBack');
  };

  const handleCaptureBack = () => {
    setBackCaptured(true);
    setStep('review');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const val = parseFloat(amount) || 1250;
      onDepositCheck(val, selectedAccount === 'checking' ? 'Business Checking' : 'Way2Save Savings');
      setIsSubmitting(false);
      setStep('success');
    }, 1500);
  };

  const handleReset = () => {
    setStep('details');
    setFrontCaptured(false);
    setBackCaptured(false);
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={handleReset} title="Mobile Check Deposit" icon={<Camera className="h-5 w-5" />}>
      <div className="space-y-4">
        {step === 'details' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deposit To Account</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value as any)}
                  className="w-full rounded-xl bg-white border border-slate-300 py-2 px-3 text-xs text-slate-900 font-bold focus:border-[#D71E28] focus:outline-none"
                >
                  <option value="checking">Business Checking ...4025 (${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})</option>
                  <option value="savings">Way2Save® Savings ...9476 ($5,000.00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Check Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl bg-white border border-slate-300 py-2 pl-7 pr-3 text-xs text-slate-900 font-bold focus:border-[#D71E28] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Endorsement Guidelines */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-3.5 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-amber-700" />
                <span>Check Endorsement Requirement</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Sign your name on the back of the check and write: <br />
                <strong className="text-amber-950 font-mono">"For Mobile Deposit Only at Wells Fargo"</strong>
              </p>
            </div>

            <button
              onClick={() => setStep('capturingFront')}
              className="w-full py-3 rounded-xl bg-[#D71E28] hover:bg-[#b8141d] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="h-4 w-4" />
              <span>Take Check Photos</span>
            </button>
          </div>
        )}

        {step === 'capturingFront' && (
          <div className="space-y-4 text-center">
            <div className="border-2 border-dashed border-[#D71E28] rounded-2xl p-6 bg-slate-900 text-white space-y-3 relative overflow-hidden">
              <div className="absolute inset-x-4 inset-y-4 border border-white/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between text-[10px] text-white/70">
                  <span>TOP LEFT</span>
                  <span>CHECK FRONT</span>
                </div>
                <div className="text-[10px] text-amber-300 font-mono">ALIGN ALL 4 CORNERS OF CHECK</div>
                <div className="flex justify-between text-[10px] text-white/70 font-mono">
                  <span>⑆ 121000248 ⑆</span>
                  <span>$ {amount}</span>
                </div>
              </div>
              <div className="py-8">
                <Camera className="h-10 w-10 text-white/80 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-white mt-2">Front of Check</p>
                <p className="text-[11px] text-slate-300">Position against a dark background with good lighting</p>
              </div>
            </div>

            <button
              onClick={handleCaptureFront}
              className="w-full py-3 rounded-xl bg-[#D71E28] hover:bg-[#b8141d] text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Camera className="h-4 w-4" />
              <span>Capture Front Photo</span>
            </button>
          </div>
        )}

        {step === 'capturingBack' && (
          <div className="space-y-4 text-center">
            <div className="border-2 border-dashed border-[#D71E28] rounded-2xl p-6 bg-slate-900 text-white space-y-3 relative overflow-hidden">
              <div className="absolute inset-x-4 inset-y-4 border border-white/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between text-[10px] text-white/70">
                  <span>CHECK BACK</span>
                  <span>ENDORSEMENT AREA</span>
                </div>
                <div className="border-t border-dashed border-white/40 pt-1 text-[10px] text-amber-300">
                  ✓ SIGNATURE & "FOR MOBILE DEPOSIT AT WELLS FARGO"
                </div>
                <div className="text-[10px] text-slate-400 font-mono">DO NOT WRITE BELOW THIS LINE</div>
              </div>
              <div className="py-8">
                <Camera className="h-10 w-10 text-white/80 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-white mt-2">Back of Check</p>
                <p className="text-[11px] text-slate-300">Ensure your signature & Wells Fargo endorsement are visible</p>
              </div>
            </div>

            <button
              onClick={handleCaptureBack}
              className="w-full py-3 rounded-xl bg-[#D71E28] hover:bg-[#b8141d] text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Camera className="h-4 w-4" />
              <span>Capture Back Photo</span>
            </button>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-100 rounded-xl p-2 border border-slate-200 text-center">
                <div className="h-16 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 text-xs font-bold border border-slate-300">
                  Front Attached ✓
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-1 block">Check Front</span>
              </div>
              <div className="bg-slate-100 rounded-xl p-2 border border-slate-200 text-center">
                <div className="h-16 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 text-xs font-bold border border-slate-300">
                  Back Attached ✓
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-1 block">Endorsement ✓</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Deposit Amount:</span>
                <span className="font-bold text-slate-900 font-mono">${parseFloat(amount || '0').toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">To Account:</span>
                <span className="font-bold text-slate-900">{selectedAccount === 'checking' ? 'Business Checking ...4025' : 'Way2Save Savings ...9476'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Availability:</span>
                <span className="font-bold text-emerald-700">Immediate Funds ($500) • Balance Next Business Day</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#D71E28] hover:bg-[#b8141d] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              <span>{isSubmitting ? 'Submitting Deposit...' : 'Confirm Deposit'}</span>
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="py-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Check Deposit Submitted!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your deposit of <strong className="text-slate-900 font-mono">${parseFloat(amount).toFixed(2)} USD</strong> has been received and credited to your account balance.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-left text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Confirmation #:</span>
                <span className="font-mono text-slate-900 font-bold">WFC-{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Status:</span>
                <span className="text-emerald-700 font-bold">Approved & Posted</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl bg-[#D71E28] text-white text-xs font-bold hover:bg-[#b8141d] transition cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </ModalBase>
  );
};

/* 3. CARD HUB & MANAGEMENT MODAL */
export const CardHubModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  creditCards: CreditCardItem[];
  user: UserProfile;
}> = ({ isOpen, onClose, creditCards, user }) => {
  const [lockedCards, setLockedCards] = useState<Record<string, boolean>>({});
  const [revealedCVV, setRevealedCVV] = useState<Record<string, boolean>>({});
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [dailyAtmLimit, setDailyAtmLimit] = useState(1000);
  const [dailyPosLimit, setDailyPosLimit] = useState(5000);
  const [travelNotice, setTravelNotice] = useState(false);

  const toggleLock = (cardId: string) => {
    setLockedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const toggleReveal = (cardId: string) => {
    setRevealedCVV((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const currentCard = creditCards[activeCardIndex] || creditCards[0];

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Card Hub & Controls" icon={<CreditCard className="h-5 w-5" />} maxWidth="max-w-xl">
      <div className="space-y-4">
        
        {/* Card Switcher Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {creditCards.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setActiveCardIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeCardIndex === idx
                  ? 'bg-[#D71E28] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.cardName} ({c.cardNumber.slice(-4)})
            </button>
          ))}
        </div>

        {/* Realistic Card Visual */}
        {currentCard && (
          <div className="relative">
            <div className={`w-full rounded-2xl bg-gradient-to-tr ${currentCard.gradient} p-5 text-white shadow-lg border border-black/20 space-y-4`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-200">WELLS FARGO</span>
                  <p className="text-xs font-bold text-amber-200 mt-0.5">{currentCard.cardName}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {lockedCards[currentCard.id] && (
                    <span className="flex items-center gap-1 text-[10px] bg-red-900/80 border border-red-400 text-red-100 font-bold px-2 py-0.5 rounded-full">
                      <Lock className="h-3 w-3" /> LOCKED
                    </span>
                  )}
                  <div className="h-5 w-8 bg-[#FFCD00]/80 rounded-xs border border-amber-300/40"></div>
                </div>
              </div>

              <div className="font-mono text-lg sm:text-xl tracking-widest text-slate-100 py-1">
                {currentCard.cardNumber}
              </div>

              <div className="flex justify-between items-end text-xs">
                <div>
                  <p className="text-[9px] text-slate-300">CARDHOLDER</p>
                  <p className="font-bold tracking-wide uppercase">{user.name}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-300">EXPIRES</p>
                  <p className="font-mono font-bold">{currentCard.expiry}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-300">CVV / CVC</p>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold">
                      {revealedCVV[currentCard.id] ? currentCard.cvv : '•••'}
                    </span>
                    <button 
                      onClick={() => toggleReveal(currentCard.id)}
                      className="text-slate-300 hover:text-white cursor-pointer"
                    >
                      {revealedCVV[currentCard.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card Management Action Strip */}
        {currentCard && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            
            {/* Lock / Unlock Toggle */}
            <button
              onClick={() => toggleLock(currentCard.id)}
              className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                lockedCards[currentCard.id]
                  ? 'bg-red-50 border-red-300 text-[#D71E28]'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              {lockedCards[currentCard.id] ? <Lock className="h-5 w-5 text-[#D71E28]" /> : <Unlock className="h-5 w-5 text-emerald-600" />}
              <span className="font-bold text-[11px]">{lockedCards[currentCard.id] ? 'Unlock Card' : 'Lock Card'}</span>
            </button>

            {/* Add to Apple Wallet */}
            <button 
              onClick={() => alert('Card added to Apple Wallet / Google Wallet successfully.')}
              className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <Wallet className="h-5 w-5 text-[#1F2E64]" />
              <span className="font-bold text-[11px]">Digital Wallet</span>
            </button>

            {/* Travel Notice */}
            <button 
              onClick={() => setTravelNotice(!travelNotice)}
              className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                travelNotice ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Globe className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-[11px]">{travelNotice ? 'Travel Active' : 'Travel Notice'}</span>
            </button>

            {/* Replace Card */}
            <button 
              onClick={() => alert('Replacement card request received. A new card will arrive via USPS Priority Mail in 2-3 business days.')}
              className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <RefreshCw className="h-5 w-5 text-amber-600" />
              <span className="font-bold text-[11px]">Replace Card</span>
            </button>
          </div>
        )}

        {/* Daily Spending & ATM Limits */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Daily Card Limits</h4>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600">Daily ATM Withdrawal Limit</span>
              <span className="font-bold text-slate-900 font-mono">${dailyAtmLimit.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              value={dailyAtmLimit}
              onChange={(e) => setDailyAtmLimit(parseInt(e.target.value))}
              className="w-full accent-[#D71E28]"
            />
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600">Daily POS Purchase Limit</span>
              <span className="font-bold text-slate-900 font-mono">${dailyPosLimit.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={dailyPosLimit}
              onChange={(e) => setDailyPosLimit(parseInt(e.target.value))}
              className="w-full accent-[#D71E28]"
            />
          </div>
        </div>

      </div>
    </ModalBase>
  );
};

/* 4. OFFICIAL STATEMENTS & TAX DOCS MODAL */
export const StatementsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  transactions: Transaction[];
}> = ({ isOpen, onClose, user, transactions }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Jul 2026');
  const [viewMode, setViewMode] = useState<'statements' | 'tax'>('statements');

  const statements = [
    { period: 'Jul 2026', date: 'Jul 31, 2026', size: '1.2 MB', pages: 3 },
    { period: 'Jun 2026', date: 'Jun 30, 2026', size: '1.4 MB', pages: 4 },
    { period: 'May 2026', date: 'May 31, 2026', size: '1.1 MB', pages: 3 },
    { period: 'Apr 2026', date: 'Apr 30, 2026', size: '980 KB', pages: 2 },
  ];

  const taxDocs = [
    { form: 'Form 1099-INT', year: '2025 Tax Year', desc: 'Interest Income Statement', size: '420 KB' },
    { form: 'Year-End Summary', year: '2025 Tax Year', desc: 'Annual Financial Portfolio Review', size: '890 KB' },
  ];

  const handleDownload = (docName: string) => {
    alert(`Downloading official PDF: ${docName}... Document saved to your downloads.`);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Statements & Tax Documents" icon={<FileText className="h-5 w-5" />} maxWidth="max-w-xl">
      <div className="space-y-4">
        
        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setViewMode('statements')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              viewMode === 'statements' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly e-Statements
          </button>
          <button
            onClick={() => setViewMode('tax')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              viewMode === 'tax' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tax Forms & 1099
          </button>
        </div>

        {viewMode === 'statements' ? (
          <div className="space-y-2.5">
            {statements.map((stmt) => (
              <div key={stmt.period} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-red-100 text-[#D71E28] flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Wells Fargo Business Checking Statement</h5>
                    <p className="text-[11px] text-slate-500">Period ending: {stmt.date} • {stmt.pages} pages ({stmt.size})</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(`Wells_Fargo_Statement_${stmt.period.replace(' ', '_')}.pdf`)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#D71E28] hover:border-red-300 transition cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {taxDocs.map((tax) => (
              <div key={tax.form} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{tax.form} - {tax.year}</h5>
                    <p className="text-[11px] text-slate-500">{tax.desc} ({tax.size})</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(`${tax.form.replace(' ', '_')}_${tax.year}.pdf`)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition cursor-pointer"
                  title="Download Tax Form"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </ModalBase>
  );
};

/* 5. DIRECT DEPOSIT & VOIDED CHECK MODAL */
export const DirectDepositModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}> = ({ isOpen, onClose, user }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Direct Deposit & Voided Check" icon={<FileText className="h-5 w-5" />} maxWidth="max-w-xl">
      <div className="space-y-4">
        
        {/* Realistic Voided Check Graphic */}
        <div className="rounded-2xl bg-gradient-to-b from-[#EBF5FB] to-[#D4E6F1] border-2 border-slate-300 p-4 sm:p-5 text-slate-800 shadow-sm relative overflow-hidden font-sans">
          
          {/* Big VOID Watermark Stamp */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <span className="text-7xl sm:text-8xl font-black text-slate-900 -rotate-15 tracking-widest">
              VOID
            </span>
          </div>

          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase">{user.name}</p>
              <p className="text-[10px] text-slate-600">1042 Market Street, Suite 400</p>
              <p className="text-[10px] text-slate-600">San Francisco, CA 94103</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700">1024</span>
              <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="my-3 flex items-center justify-between border-b border-slate-400 pb-1">
            <span className="text-[10px] font-bold text-slate-600">PAY TO THE ORDER OF:</span>
            <span className="text-xs font-bold font-mono">VOID - DIRECT DEPOSIT ONLY</span>
            <span className="text-xs font-mono font-bold">$ ••••••••••</span>
          </div>

          <div className="flex justify-between items-end pt-1">
            <div>
              <p className="text-[10px] font-bold text-[#D71E28]">WELLS FARGO BANK, N.A.</p>
              <p className="text-[9px] text-slate-500">420 Montgomery St, San Francisco, CA</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-500 italic">Sofia Lincoin (Authorized)</p>
            </div>
          </div>

          {/* MICR Encoding Line */}
          <div className="mt-4 pt-2 border-t border-slate-400/80 font-mono text-xs sm:text-sm tracking-wider text-slate-900 font-bold flex justify-between">
            <span>⑆ 121000248 ⑆</span>
            <span>{user.accountNumber} ⑈</span>
            <span>1024</span>
          </div>
        </div>

        {/* Pre-filled Direct Deposit Information Form */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wide">Direct Deposit Information</h4>
          <div className="flex justify-between">
            <span className="text-slate-500">Bank Name:</span>
            <span className="font-bold text-slate-900">Wells Fargo Bank, N.A.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Routing Number (ABA):</span>
            <span className="font-mono font-bold text-[#D71E28]">121000248</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Account Number:</span>
            <span className="font-mono font-bold text-[#D71E28]">{user.accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Account Type:</span>
            <span className="font-bold text-slate-900">Business Checking / Checking</span>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="w-full py-3 rounded-xl bg-[#D71E28] hover:bg-[#b8141d] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Download Voided Check PDF</span>
        </button>

      </div>
    </ModalBase>
  );
};

/* 6. CREDIT CLOSE-UP & FICO SCORE 9 MODAL */
export const CreditCloseUpModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Credit Close-Up® & FICO® Score" icon={<TrendingUp className="h-5 w-5 text-emerald-600" />} maxWidth="max-w-xl">
      <div className="space-y-4">
        
        {/* Score Header */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 p-5 rounded-2xl border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Experian FICO® Score 9</span>
            <div className="text-4xl font-extrabold text-slate-900 mt-1">784</div>
            <div className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Exceptional Credit Rating
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Updated as of August 2026</p>
          </div>

          <div className="h-20 w-20 rounded-full border-6 border-emerald-500 border-t-emerald-600 flex flex-col items-center justify-center bg-white shadow-xs">
            <span className="text-xs font-black text-emerald-800">TOP 8%</span>
            <span className="text-[8px] text-slate-400">Nationwide</span>
          </div>
        </div>

        {/* FICO Key Factors Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Key Score Factors</h4>
          
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">Payment History (35%)</span>
              <p className="text-[10px] text-slate-500">100% on-time payments, 0 missed</p>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Excellent</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">Credit Utilization (30%)</span>
              <p className="text-[10px] text-slate-500">14% of available credit used</p>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Optimal (&lt;30%)</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">Length of Credit History (15%)</span>
              <p className="text-[10px] text-slate-500">6 Years, 4 Months average account age</p>
            </div>
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">Good</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">Hard Inquiries (10%)</span>
              <p className="text-[10px] text-slate-500">1 inquiry in the last 12 months</p>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Low Risk</span>
          </div>
        </div>

      </div>
    </ModalBase>
  );
};

/* 7. MY SPENDING REPORT MODAL */
export const SpendingReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}> = ({ isOpen, onClose, transactions }) => {
  const categories = [
    { name: 'Transfers & Payments', amount: 1420.00, percent: 42, color: 'bg-[#D71E28]' },
    { name: 'Utilities & Bills', amount: 245.80, percent: 18, color: 'bg-amber-500' },
    { name: 'Groceries & Dining', amount: 380.50, percent: 22, color: 'bg-emerald-500' },
    { name: 'Business Operations', amount: 510.00, percent: 18, color: 'bg-indigo-600' },
  ];

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="My Spending Report" icon={<PieChart className="h-5 w-5 text-indigo-600" />} maxWidth="max-w-xl">
      <div className="space-y-4">
        
        {/* Total Spending Banner */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Total Spent This Month</span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">$2,556.30 USD</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 justify-end">
              <TrendingUp className="h-3.5 w-3.5" /> -8.4% vs last month
            </span>
            <span className="text-[10px] text-slate-400">Within monthly budget target</span>
          </div>
        </div>

        {/* Progress Bar Breakdown */}
        <div className="h-4 w-full rounded-full bg-slate-200 flex overflow-hidden">
          {categories.map((c) => (
            <div key={c.name} className={`${c.color} h-full`} style={{ width: `${c.percent}%` }} title={`${c.name}: ${c.percent}%`}></div>
          ))}
        </div>

        {/* Categories List */}
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c.name} className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className={`h-3 w-3 rounded-full ${c.color}`}></div>
                <span className="font-bold text-slate-800">{c.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 font-mono">${c.amount.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 ml-2">({c.percent}%)</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </ModalBase>
  );
};

/* 8. ATM & BRANCH LOCATOR MODAL */
export const AtmLocatorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('San Francisco, CA');

  const branches = [
    {
      name: 'Wells Fargo Financial Center (Main Branch)',
      address: '420 Montgomery St, San Francisco, CA 94104',
      distance: '0.3 miles',
      hours: 'Open until 5:00 PM',
      services: ['24/7 ATM', 'Drive-Up', 'Safe Deposit Box', 'Notary'],
    },
    {
      name: 'Wells Fargo Market & 5th Branch',
      address: '865 Market St, San Francisco, CA 94103',
      distance: '0.7 miles',
      hours: 'Open until 5:00 PM',
      services: ['24/7 ATM', 'Card Instant Issue', 'Foreign Currency'],
    },
    {
      name: 'Wells Fargo 24hr Express ATM',
      address: '525 Market St, San Francisco, CA 94105',
      distance: '0.9 miles',
      hours: 'Open 24 Hours',
      services: ['24/7 Cash Withdrawal', 'Check & Cash Deposit'],
    },
  ];

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="ATM & Branch Locator" icon={<MapPin className="h-5 w-5 text-[#D71E28]" />} maxWidth="max-w-xl">
      <div className="space-y-4">
        
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter Address, City, or ZIP code..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#D71E28] focus:bg-white"
          />
        </div>

        {/* Branch List */}
        <div className="space-y-3">
          {branches.map((b) => (
            <div key={b.name} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 hover:border-red-300 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{b.name}</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">{b.address}</p>
                </div>
                <span className="text-[10px] font-bold text-[#D71E28] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  {b.distance}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                <Clock className="h-3 w-3" />
                <span>{b.hours}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {b.services.map((s) => (
                  <span key={s} className="text-[9.5px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </ModalBase>
  );
};

/* 9. FARGO® VIRTUAL AI ASSISTANT MODAL */
export const FargoAssistantModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  creditCards: CreditCardItem[];
  onOpenCardHub: () => void;
  onOpenStatements: () => void;
  onOpenAtm: () => void;
  onOpenZelle?: () => void;
}> = ({ isOpen, onClose, user, creditCards, onOpenCardHub, onOpenStatements, onOpenAtm, onOpenZelle }) => {
  const [messages, setMessages] = useState<Array<{ role: 'fargo' | 'user'; text: string }>>([
    {
      role: 'fargo',
      text: `Hello ${user.name}! I'm Fargo®, your Wells Fargo virtual assistant. How can I help manage your accounts today?`
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    'What is my account balance?',
    'Send money with Zelle®',
    'What is my routing number?',
    'View monthly statements',
    'Manage debit & credit cards',
    'Find nearest ATM'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg = { role: 'user' as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('balance') || q.includes('how much')) {
        reply = `Your Business Checking account balance is $${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD, and your Way2Save® Savings balance is $5,000.00 USD.`;
      } else if (q.includes('zelle') || q.includes('send money')) {
        reply = `Opening Zelle® where you can send, request, or split money with friends and family instantly with zero fees.`;
        setTimeout(() => {
          onClose();
          onOpenZelle?.();
        }, 1000);
      } else if (q.includes('routing') || q.includes('aba')) {
        reply = `Your Wells Fargo routing number for ACH & Direct Deposit is 121000248. For international wires, the SWIFT/BIC is WFGBUS6S.`;
      } else if (q.includes('statement') || q.includes('tax')) {
        reply = `Opening your monthly e-Statements and Form 1099 tax documents now.`;
        setTimeout(() => {
          onClose();
          onOpenStatements();
        }, 1200);
      } else if (q.includes('card') || q.includes('lock')) {
        reply = `Opening Card Hub where you can lock/unlock your cards, change limits, or view virtual card details.`;
        setTimeout(() => {
          onClose();
          onOpenCardHub();
        }, 1200);
      } else if (q.includes('atm') || q.includes('branch')) {
        reply = `Opening the Wells Fargo ATM & Branch locator to find fee-free ATMs near you.`;
        setTimeout(() => {
          onClose();
          onOpenAtm();
        }, 1200);
      } else {
        reply = `I can help you with balance checks, sending money with Zelle®, locking your cards, finding ATMs, and viewing your statements. What would you like to do?`;
      }

      setMessages((prev) => [...prev, { role: 'fargo', text: reply }]);
    }, 600);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Fargo® Virtual Assistant" icon={<Sparkles className="h-5 w-5 text-[#D71E28]" />} maxWidth="max-w-lg">
      <div className="space-y-3">
        
        {/* Chat History Container */}
        <div className="h-64 overflow-y-auto rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3 text-xs">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 ${
                m.role === 'user'
                  ? 'bg-[#D71E28] text-white'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
              }`}>
                {m.role === 'fargo' && (
                  <span className="text-[9px] font-bold text-[#D71E28] uppercase tracking-wider block mb-1">
                    FARGO® ASSISTANT
                  </span>
                )}
                <p className="leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-200 transition cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Fargo anything..."
            className="flex-1 rounded-xl bg-slate-50 border border-slate-300 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-[#D71E28] focus:bg-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#D71E28] hover:bg-[#b8141d] px-4 py-2 text-xs font-bold text-white transition cursor-pointer shadow-xs"
          >
            Send
          </button>
        </form>

      </div>
    </ModalBase>
  );
};

/* 10. ELECTRICITY BILL MODAL */
export const ElectricityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onPayBill: (amount: number) => void;
}> = ({ isOpen, onClose, onPayBill }) => {
  const [billPaid, setBillPaid] = useState(false);

  const handlePay = () => {
    onPayBill(245.80);
    setBillPaid(true);
    setTimeout(() => {
      setBillPaid(false);
      onClose();
    }, 1800);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Bill Pay / Pacific Power & Light" icon={<Zap className="h-5 w-5 text-amber-500" />}>
      <div className="space-y-4">
        {billPaid ? (
          <div className="py-8 text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Bill Paid Successfully!</h4>
            <p className="text-xs text-slate-500">$245.80 debited from Business Checking.</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Provider</span>
                <span className="font-bold text-slate-900">Pacific Power & Light Co.</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono font-bold text-[#D71E28]">PPL-9812-401</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Billing Period</span>
                <span className="text-slate-800 font-medium">Jul 01 - Jul 31, 2026</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-bold">Amount Due</span>
                <span className="text-base font-bold text-[#D71E28] font-mono">$245.80 USD</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              className="w-full rounded-xl bg-[#D71E28] hover:bg-[#b8141d] py-3 text-xs font-bold text-white transition shadow-xs cursor-pointer"
            >
              Pay $245.80 Bill Now
            </button>
          </>
        )}
      </div>
    </ModalBase>
  );
};

/* 12. REFERRAL MODAL */
export const ReferralModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
}> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const refCode = "SOFIA-WF-50BONUS";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://wellsfargo.com/ref/${refCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Refer & Earn Rewards" icon={<Gift className="h-5 w-5 text-[#D71E28]" />}>
      <div className="space-y-4 text-center">
        <div className="rounded-2xl bg-gradient-to-tr from-red-50 via-amber-50 to-red-50 p-5 border border-red-200">
          <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold text-[#D71E28] mb-2 border border-red-200">
            Earn $50 per Referral
          </span>
          <h4 className="text-base font-extrabold text-slate-900">Invite Colleagues & Friends</h4>
          <p className="text-xs text-slate-600 mt-1">
            Give $50 to a friend and receive $50 credited when they open their new account.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] text-slate-500 font-medium">Your Referral Code</p>
            <p className="text-sm font-mono font-bold text-[#D71E28]">{refCode}</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl bg-[#D71E28] hover:bg-[#b8141d] px-3 py-2 text-xs font-bold text-white transition cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

/* 13. INSURANCE MODAL */
export const InsuranceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Wells Fargo Insurance & Protection" icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}>
      <div className="space-y-3">
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
          <div>
            <h5 className="text-xs font-bold text-slate-900">Global Travel Shield</h5>
            <p className="text-[11px] text-slate-500">Medical, baggage & flight protection up to $500,000</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">$12/mo</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
          <div>
            <h5 className="text-xs font-bold text-slate-900">Cyber & Identity Theft Protection</h5>
            <p className="text-[11px] text-slate-500">24/7 dark web fraud monitoring & zero liability</p>
          </div>
          <span className="text-xs font-bold text-[#D71E28] bg-red-50 px-2 py-1 rounded border border-red-200">Included</span>
        </div>
      </div>
    </ModalBase>
  );
};

/* 14. LOAN MODAL */
export const LoanModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApproveLoan: (amount: number) => void;
}> = ({ isOpen, onClose, onApproveLoan }) => {
  const [amount, setAmount] = useState('25000');
  const [termMonths, setTermMonths] = useState('24');
  const [isProcessing, setIsProcessing] = useState(false);

  const monthlyEst = ((parseFloat(amount) || 0) / (parseInt(termMonths) || 12) * 1.04).toFixed(2);

  const handleApply = () => {
    setIsProcessing(true);
    onApproveLoan(parseFloat(amount) || 25000);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 1800);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Personal & Business Lending" icon={<Coins className="h-5 w-5 text-[#D71E28]" />}>
      {isProcessing ? (
        <div className="py-8 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 border border-amber-300 animate-pulse mx-auto">
            <Clock className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Loan in processing</h4>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">
            Your application for ${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })} USD is currently in review by credit underwriters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-red-50 p-4 border border-red-200">
            <p className="text-xs text-[#D71E28] font-semibold">Pre-Approved Offer</p>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">Credit Facility Line: $25,000.00</h4>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Requested Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-300 py-2.5 px-3 text-xs text-slate-900 font-bold focus:border-[#D71E28] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Est. Monthly Payment</span>
            <span className="font-bold text-[#D71E28] font-mono">${monthlyEst} USD/mo</span>
          </div>

          <button
            onClick={handleApply}
            className="w-full rounded-xl bg-[#D71E28] hover:bg-[#b8141d] py-3 text-xs font-bold text-white transition cursor-pointer shadow-xs"
          >
            Submit Application (${parseFloat(amount || '25000').toLocaleString()})
          </button>
        </div>
      )}
    </ModalBase>
  );
};

/* 15. MORE SERVICES HUB MODAL */
export const MoreServicesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onOpenCardHub?: () => void;
  onOpenStatements?: () => void;
  onOpenDirectDeposit?: () => void;
  onOpenCreditCloseUp?: () => void;
  onOpenSpendingReport?: () => void;
  onOpenAtmLocator?: () => void;
  onOpenFargo?: () => void;
  onOpenElectricity?: () => void;
  onOpenLoan?: () => void;
}> = ({ 
  isOpen, 
  onClose,
  onOpenCardHub,
  onOpenStatements,
  onOpenDirectDeposit,
  onOpenCreditCloseUp,
  onOpenSpendingReport,
  onOpenAtmLocator,
  onOpenFargo,
  onOpenElectricity,
  onOpenLoan
}) => {
  const handleItemClick = (cb?: () => void) => {
    onClose();
    if (cb) cb();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Wells Fargo Services & Tools" icon={<Building2 className="h-5 w-5 text-[#D71E28]" />} maxWidth="max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        <div 
          onClick={() => handleItemClick(onOpenCardHub)}
          className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 hover:border-red-400 hover:bg-red-50/40 cursor-pointer transition flex flex-col items-center text-center"
        >
          <CreditCard className="h-6 w-6 text-[#1F2E64] mb-1.5" />
          <h5 className="text-xs font-bold text-slate-900">Card Hub</h5>
          <p className="text-[10px] text-slate-500">Lock, Limits & Wallet</p>
        </div>

        <div 
          onClick={() => handleItemClick(onOpenStatements)}
          className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 hover:border-red-400 hover:bg-red-50/40 cursor-pointer transition flex flex-col items-center text-center"
        >
          <FileText className="h-6 w-6 text-emerald-600 mb-1.5" />
          <h5 className="text-xs font-bold text-slate-900">Statements & Tax</h5>
          <p className="text-[10px] text-slate-500">e-Statements & 1099</p>
        </div>

        <div 
          onClick={() => handleItemClick(onOpenDirectDeposit)}
          className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 hover:border-red-400 hover:bg-red-50/40 cursor-pointer transition flex flex-col items-center text-center"
        >
          <FileText className="h-6 w-6 text-blue-600 mb-1.5" />
          <h5 className="text-xs font-bold text-slate-900">Direct Deposit Form</h5>
          <p className="text-[10px] text-slate-500">Voided Check & Form</p>
        </div>

        <div 
          onClick={() => handleItemClick(onOpenCreditCloseUp)}
          className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 hover:border-red-400 hover:bg-red-50/40 cursor-pointer transition flex flex-col items-center text-center"
        >
          <TrendingUp className="h-6 w-6 text-emerald-600 mb-1.5" />
          <h5 className="text-xs font-bold text-slate-900">FICO® Score</h5>
          <p className="text-[10px] text-slate-500">Credit Close-Up®</p>
        </div>

        <div 
          onClick={() => handleItemClick(onOpenSpendingReport)}
          className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 hover:border-red-400 hover:bg-red-50/40 cursor-pointer transition flex flex-col items-center text-center"
        >
          <PieChart className="h-6 w-6 text-purple-600 mb-1.5" />
          <h5 className="text-xs font-bold text-slate-900">Spending Report</h5>
          <p className="text-[10px] text-slate-500">Category Insights</p>
        </div>

        <div 
          onClick={() => handleItemClick(onOpenAtmLocator)}
          className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 hover:border-red-400 hover:bg-red-50/40 cursor-pointer transition flex flex-col items-center text-center"
        >
          <MapPin className="h-6 w-6 text-[#D71E28] mb-1.5" />
          <h5 className="text-xs font-bold text-slate-900">ATMs & Branches</h5>
          <p className="text-[10px] text-slate-500">Find Locations</p>
        </div>

        <div 
          onClick={() => handleItemClick(onOpenFargo)}
          className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 hover:border-red-400 hover:bg-red-50/40 cursor-pointer transition flex flex-col items-center text-center"
        >
          <Sparkles className="h-6 w-6 text-[#D71E28] mb-1.5" />
          <h5 className="text-xs font-bold text-slate-900">Ask Fargo®</h5>
          <p className="text-[10px] text-slate-500">Virtual AI Assistant</p>
        </div>

        <div 
          onClick={() => handleItemClick(onOpenElectricity)}
          className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 hover:border-red-400 hover:bg-red-50/40 cursor-pointer transition flex flex-col items-center text-center"
        >
          <Zap className="h-6 w-6 text-amber-500 mb-1.5" />
          <h5 className="text-xs font-bold text-slate-900">Pay Utilities</h5>
          <p className="text-[10px] text-slate-500">Bill Pay Hub</p>
        </div>

      </div>
    </ModalBase>
  );
};
