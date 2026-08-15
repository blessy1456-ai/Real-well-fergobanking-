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
  Clock
} from 'lucide-react';
import { UserProfile, CreditCardItem } from '../types';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ModalBase: React.FC<ModalBaseProps> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-700">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-[11px] text-red-700 font-semibold uppercase tracking-wider">Well Fergo Official Service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
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

/* RECEIVED MODAL */
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
    <ModalBase isOpen={isOpen} onClose={onClose} title="Receive Funds / Deposit" icon={<QrCode className="h-5 w-5" />}>
      <div className="space-y-5">
        
        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-6 border border-slate-200">
          <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=wellfergo:account:${user.accountNumber}`} 
              alt="Account QR Code"
              className="h-32 w-32 object-contain"
            />
          </div>
          <p className="mt-3 text-xs text-slate-500 font-medium">Scan to receive instant Wells Fargo transfer</p>
        </div>

        {/* Account Details */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Account Name</span>
            <span className="font-bold text-slate-900">{user.name}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-red-700">{user.accountNumber}</span>
              <button 
                onClick={() => copyToClipboard(user.accountNumber)}
                className="text-slate-400 hover:text-slate-700"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Routing Number</span>
            <span className="font-mono font-medium text-slate-800">121000358 (Well Fergo Main)</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">SWIFT / BIC</span>
            <span className="font-mono font-medium text-slate-800">WFGBUS6S</span>
          </div>
        </div>

        {/* Bank Deposit Notice */}
        <div className="rounded-2xl bg-amber-50 p-4 border border-amber-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Notice: Kindly go to bank</span>
          </div>
          <p className="text-amber-800 text-xs leading-relaxed font-medium">
            To deposit cash, submit checks, or complete received transfers into your account, kindly visit a Well Fergo bank branch counter.
          </p>
          <div className="flex gap-2 pt-1">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">$</span>
              <input 
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-xl py-2 pl-7 pr-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-red-600"
                placeholder="500"
              />
            </div>
            <button
              onClick={handleDeposit}
              className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 text-xs font-bold text-white transition shadow-sm"
            >
              Deposit Funds
            </button>
          </div>
        </div>

      </div>
    </ModalBase>
  );
};

/* ADD CREDIT CARD MODAL */
export const AddCardModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: CreditCardItem) => void;
}> = ({ isOpen, onClose, onAddCard }) => {
  const [cardName, setCardName] = useState('Well Fergo Red Platinum');
  const [cardType, setCardType] = useState<'Visa' | 'Mastercard'>('Visa');
  const [limit, setLimit] = useState('15000');
  const [isVirtual, setIsVirtual] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: CreditCardItem = {
      id: `card-${Date.now()}`,
      cardName,
      cardNumber: `${cardType === 'Visa' ? '4912' : '5381'} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      expiry: '08/30',
      cvv: `${Math.floor(100 + Math.random() * 900)}`,
      cardType,
      balance: 0,
      limit: parseFloat(limit) || 10000,
      gradient: cardType === 'Visa' 
        ? 'from-red-700 via-red-800 to-red-950'
        : 'from-amber-600 via-amber-700 to-amber-900',
      isVirtual,
    };
    onAddCard(newCard);
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Add Credit Card" icon={<CreditCard className="h-5 w-5" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Card Live Preview */}
        <div className="rounded-2xl bg-gradient-to-tr from-red-700 via-red-800 to-red-950 p-5 text-white shadow-lg border border-red-500/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-red-200 font-bold">Card Name</p>
              <p className="text-sm font-bold">{cardName || 'New Card'}</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/30 text-amber-300">{cardType}</span>
          </div>
          <div className="my-4 font-mono text-base tracking-widest text-amber-100">
            •••• •••• •••• 8821
          </div>
          <div className="flex justify-between items-end text-xs">
            <div>
              <p className="text-[9px] text-red-200">CARD HOLDER</p>
              <p className="font-bold">SOFIA LINCOIN</p>
            </div>
            <div>
              <p className="text-[9px] text-red-200">EXPIRES</p>
              <p className="font-bold">08/30</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Card Title</label>
          <input
            type="text"
            required
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full rounded-xl bg-slate-50 border border-slate-300 py-2.5 px-3 text-xs text-slate-900 font-medium focus:border-red-600 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Network</label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value as any)}
              className="w-full rounded-xl bg-slate-50 border border-slate-300 py-2.5 px-3 text-xs text-slate-900 font-medium focus:border-red-600 focus:bg-white focus:outline-none"
            >
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Credit Limit ($)</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-300 py-2.5 px-3 text-xs text-slate-900 font-medium focus:border-red-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="virtual"
            checked={isVirtual}
            onChange={(e) => setIsVirtual(e.target.checked)}
            className="rounded bg-slate-100 border-slate-300 text-red-600 focus:ring-red-500"
          />
          <label htmlFor="virtual" className="text-xs font-medium text-slate-700">
            Issue as Instant Virtual Card
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-3 text-xs font-bold text-white shadow-md shadow-red-900/20 hover:from-red-700 hover:to-red-800 transition mt-2"
        >
          Issue Card Now
        </button>
      </form>
    </ModalBase>
  );
};

/* ELECTRICITY BILL MODAL */
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
    <ModalBase isOpen={isOpen} onClose={onClose} title="Electrici / Electricity Bill" icon={<Zap className="h-5 w-5 text-amber-500" />}>
      <div className="space-y-4">
        {billPaid ? (
          <div className="py-8 text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Bill Paid Successfully!</h4>
            <p className="text-xs text-slate-500">$245.80 debited from Sofia Lincoin balance.</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Provider</span>
                <span className="font-bold text-slate-900">Pacific Power & Light</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono font-bold text-red-700">PPL-9812-401</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Billing Period</span>
                <span className="text-slate-800 font-medium">Jul 01 - Jul 31, 2026</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-bold">Amount Due</span>
                <span className="text-base font-bold text-red-700">$245.80 USD</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 text-xs font-bold text-white transition shadow-md shadow-red-900/20"
            >
              Pay $245.80 Electricity Bill Now
            </button>
          </>
        )}
      </div>
    </ModalBase>
  );
};

/* REFERRAL MODAL */
export const ReferralModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
}> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const refCode = "SOFIA-FERGO-50USD";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://wellfergo.com/ref/${refCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Refer & Earn Rewards" icon={<Gift className="h-5 w-5 text-red-600" />}>
      <div className="space-y-4 text-center">
        <div className="rounded-2xl bg-gradient-to-tr from-red-50 via-amber-50 to-red-50 p-5 border border-red-200">
          <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold text-red-800 mb-2 border border-red-200">
            Earn $50 per Referral
          </span>
          <h4 className="text-base font-extrabold text-slate-900">Invite Friends to Well Fergo</h4>
          <p className="text-xs text-slate-600 mt-1">
            Give $50 to a friend and get $50 in account balance when they open their new account.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 flex items-center justify-between">
          <div className="text-left">
            <p className="text-[10px] text-slate-500 font-medium">Your Referral Code</p>
            <p className="text-sm font-mono font-bold text-red-700">{refCode}</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-3 py-2 text-xs font-bold text-white transition shadow-sm"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

/* INSURANCE MODAL */
export const InsuranceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Well Fergo Insurance" icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}>
      <div className="space-y-3">
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
          <div>
            <h5 className="text-xs font-bold text-slate-900">Global Travel Shield</h5>
            <p className="text-[11px] text-slate-500">Medical & flight protection up to $500,000</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">$12/mo</span>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
          <div>
            <h5 className="text-xs font-bold text-slate-900">Cyber & Theft Protection</h5>
            <p className="text-[11px] text-slate-500">24/7 account fraud coverage</p>
          </div>
          <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded border border-red-200">Included</span>
        </div>
      </div>
    </ModalBase>
  );
};

/* LOAN MODAL */
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
    <ModalBase isOpen={isOpen} onClose={onClose} title="Personal Loan Service" icon={<Coins className="h-5 w-5 text-red-600" />}>
      {isProcessing ? (
        <div className="py-8 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 border border-amber-300 animate-pulse mx-auto">
            <Clock className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Loan in processing</h4>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">
            Your application for ${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })} USD is currently in processing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-amber-50 p-4 border border-amber-300 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">Loan Status: In Processing</p>
              <p className="text-[11px] text-amber-800 mt-0.5 font-medium">Submitted loan applications are reviewed by credit officers. Approved funds will be marked as in processing.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-red-50 p-4 border border-red-200">
            <p className="text-xs text-red-700 font-semibold">Sofia Lincoin Pre-Approved Offer</p>
            <h4 className="text-lg font-bold text-slate-900">Credit Facility: $25,000</h4>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Requested Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-300 py-2.5 px-3 text-xs text-slate-900 font-bold focus:border-red-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Est. Monthly Payment</span>
            <span className="font-bold text-red-700">${monthlyEst} USD/mo</span>
          </div>

          <button
            onClick={handleApply}
            className="w-full rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-3 text-xs font-bold text-white transition hover:from-red-700 hover:to-red-800 active:scale-[0.99] shadow-md shadow-red-900/20"
          >
            Apply for Loan (${parseFloat(amount || '25000').toLocaleString()})
          </button>
        </div>
      )}
    </ModalBase>
  );
};

/* MORE SERVICES MODAL */
export const MoreServicesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="More Official Services" icon={<Building2 className="h-5 w-5 text-red-600" />}>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 hover:border-red-400/60 hover:bg-red-50/40 cursor-pointer transition">
          <Smartphone className="h-5 w-5 text-red-600 mb-2" />
          <h5 className="text-xs font-bold text-slate-900">Mobile Top-up</h5>
          <p className="text-[10px] text-slate-500">Recharge mobile data</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 hover:border-cyan-400/60 hover:bg-cyan-50/40 cursor-pointer transition">
          <Droplets className="h-5 w-5 text-cyan-600 mb-2" />
          <h5 className="text-xs font-bold text-slate-900">Water Bill</h5>
          <p className="text-[10px] text-slate-500">Municipal water pay</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 hover:border-emerald-400/60 hover:bg-emerald-50/40 cursor-pointer transition">
          <DollarSign className="h-5 w-5 text-emerald-600 mb-2" />
          <h5 className="text-xs font-bold text-slate-900">FX Exchange</h5>
          <p className="text-[10px] text-slate-500">Convert USD, EUR, GBP</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 hover:border-amber-400/60 hover:bg-amber-50/40 cursor-pointer transition">
          <Building2 className="h-5 w-5 text-amber-600 mb-2" />
          <h5 className="text-xs font-bold text-slate-900">Branch Locator</h5>
          <p className="text-[10px] text-slate-500">Find nearest ATM or branch</p>
        </div>
      </div>
    </ModalBase>
  );
};
