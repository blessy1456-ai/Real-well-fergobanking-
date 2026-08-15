import React, { useState, useEffect } from 'react';
import { 
  Send, 
  ArrowLeft, 
  Building2, 
  AlertTriangle, 
  UserCheck, 
  DollarSign, 
  Landmark, 
  CreditCard, 
  FileText,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  Clock
} from 'lucide-react';
import { PageType, UserProfile, Transaction } from '../types';

interface TransferPageProps {
  user: UserProfile;
  setCurrentPage: (page: PageType) => void;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addNotification: (title: string, message: string, type?: 'info' | 'security' | 'service' | 'alert') => void;
}

export const TransferPage: React.FC<TransferPageProps> = ({
  user,
  setCurrentPage,
  setTransactions,
  addNotification,
}) => {
  const [transferName, setTransferName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);

  // Total loading duration (40 seconds)
  const TOTAL_LOADING_SECONDS = 40;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isProcessing) {
      timer = setTimeout(() => {
        setIsProcessing(false);
        setShowVerificationNotice(true);
      }, TOTAL_LOADING_SECONDS * 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isProcessing]);

  const handleSendTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
  };

  const handleConfirmNoticeAndReturn = () => {
    setShowVerificationNotice(false);

    // Record declined transaction in ledger (NO money deducted)
    const numAmt = parseFloat(amount) || 0;
    if (numAmt > 0) {
      const newTx: Transaction = {
        id: `wf-tx-${Date.now()}`,
        title: `Transfer to ${transferName}`,
        subtitle: `${bankName || 'External Bank'} • Declined (Branch Verification Required)`,
        amount: numAmt,
        type: 'debit',
        category: 'transfer',
        date: 'Just now',
        status: 'Declined - In-Person Verification Required',
        iconName: 'XCircle',
      };
      setTransactions((prev) => [newTx, ...prev]);
      addNotification(
        'Transfer Declined - Branch Verification Required',
        `Transfer of $${numAmt.toLocaleString()} USD to ${transferName} was declined. No funds were debited. Please visit your local bank branch for verification.`,
        'alert'
      );
    }

    // Return to dashboard
    setCurrentPage('dashboard');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16 font-sans animate-fadeIn">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-300 hover:border-[#D71E28] hover:text-[#D71E28] transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Accounts</span>
        </button>

        <span className="text-xs text-slate-700 bg-white px-3.5 py-2 rounded-lg border border-slate-300 shadow-xs font-medium">
          From: <strong className="text-[#D71E28]">Everyday Checking (...3382)</strong> • <strong className="font-mono text-slate-900">${user.balance.toLocaleString()} USD</strong>
        </span>
      </div>

      {/* Main Transfer Form Card */}
      <div className="rounded-xl border border-slate-300 bg-white shadow-sm overflow-hidden">
        
        {/* Card Header with Wells Fargo Red Accent */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-[#D71E28]">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Transfer & Pay Funds
              </h1>
              <p className="text-xs text-slate-500">
                Well Fergo Wire & Interbank Transfer Service
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#D71E28] bg-red-50 px-2.5 py-1 rounded border border-red-200">
            FDIC Insured Wire
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* Form Inputs */}
          <form onSubmit={handleSendTransferSubmit} className="space-y-4">
            
            {/* From Account Display */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                From Account
              </label>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-300 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900">Everyday Checking (...3382)</div>
                  <div className="text-slate-500 text-[11px]">Sofia Lincoin • Primary Wire Account</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-700 font-mono text-sm">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className="text-[10px] text-slate-400">Available balance</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Transfer Name (Recipient) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Recipient Name / Beneficiary
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={transferName}
                    onChange={(e) => setTransferName(e.target.value)}
                    placeholder="Beneficiary full legal name"
                    className="w-full rounded-lg bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 border border-slate-300 focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] focus:outline-none"
                  />
                </div>
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Recipient Bank Name
                </label>
                <div className="relative">
                  <Landmark className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Chase, Bank of America, Citibank"
                    className="w-full rounded-lg bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 border border-slate-300 focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] focus:outline-none"
                  />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Account Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Recipient Account Number / IBAN
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 4821-9920-1102"
                    className="w-full rounded-lg bg-white py-2.5 pl-10 pr-3 text-sm font-mono text-slate-900 border border-slate-300 focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] focus:outline-none"
                  />
                </div>
              </div>

              {/* Amount (USD) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Transfer Amount ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-lg bg-white py-2.5 pl-10 pr-3 text-sm font-mono font-bold text-slate-900 border border-slate-300 focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Memo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Memo / Purpose
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="e.g. Invoice payment, personal, bill"
                  className="w-full rounded-lg bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 border border-slate-300 focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#D71E28] hover:bg-[#b8141d] py-3 px-4 text-sm font-bold text-white shadow-md transition cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Submit Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage('dashboard')}
                className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 py-3 px-6 text-sm font-bold text-slate-700 border border-slate-300 hover:bg-slate-200 transition cursor-pointer"
              >
                <span>Cancel</span>
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* 1. LOADING OVERLAY ON SUBMIT */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl border border-slate-300 bg-white p-8 shadow-2xl text-center space-y-5">
            
            {/* Spinning Loader */}
            <div className="relative flex items-center justify-center mx-auto">
              <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-[#D71E28] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Send className="h-6 w-6 text-[#D71E28]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                Processing Transfer Request
              </h3>
              <p className="text-xs text-slate-500">
                Verifying beneficiary account with wire network...
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 py-2.5 px-4 rounded-lg border border-slate-200">
              <Loader2 className="h-4 w-4 animate-spin text-[#D71E28]" />
              <span>Loading, please wait...</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Please do not refresh or close your browser while verification is underway.
            </p>
          </div>
        </div>
      )}

      {/* 2. OFFICIAL BANK SECURITY NOTICE MODAL (PAYMENT DECLINED - FUNDS NOT SENT) */}
      {showVerificationNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-slate-300 bg-white p-6 sm:p-7 shadow-2xl space-y-5">
            
            {/* Header with Declined Badge */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-[#D71E28] shrink-0">
                  <AlertTriangle className="h-6 w-6 text-[#D71E28]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Official Bank Security Notice
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Well Fergo Wire & Interbank Compliance Protocol
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 bg-red-100 text-[#D71E28] text-[10px] font-black px-2.5 py-1 rounded-md border border-red-300 uppercase tracking-wide">
                <XCircle className="h-3.5 w-3.5" />
                Declined
              </span>
            </div>

            {/* MANDATORY PROMINENT RED NOTE */}
            <div className="rounded-xl bg-red-50 p-4 border-2 border-[#D71E28] text-red-950 shadow-xs flex items-start gap-3.5">
              <AlertTriangle className="h-6 w-6 text-[#D71E28] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-black text-[#D71E28] uppercase tracking-wider">
                  Official Bank Security Notice
                </div>
                <p className="text-sm font-bold leading-relaxed text-red-950">
                  Please kindly visit the bank for some verification before completing this transfer.
                </p>
              </div>
            </div>

            {/* Explicit Notice that NO funds were debited */}
            <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 flex items-center gap-3 text-amber-900 text-xs">
              <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold">Payment Status: Declined. </span>
                <span>No funds have been debited from your account. Your current balance remains fully protected and unchanged.</span>
              </div>
            </div>

            {/* Attempted Transfer Summary */}
            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span>Beneficiary:</span>
                <span className="font-bold text-slate-900">{transferName}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination Bank:</span>
                <span className="font-bold text-slate-900">{bankName || 'External Bank'}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Number:</span>
                <span className="font-mono text-slate-900">{accountNumber}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span>Attempted Amount:</span>
                <span className="font-mono font-bold text-slate-900">
                  ${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1 text-[#D71E28] font-bold">
                <span>Amount Debited:</span>
                <span className="font-mono">$0.00 USD (Declined)</span>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <button
                onClick={handleConfirmNoticeAndReturn}
                className="w-full rounded-xl bg-[#D71E28] hover:bg-[#b8141d] py-3.5 text-xs font-bold text-white transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Acknowledge & Return to Dashboard</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
