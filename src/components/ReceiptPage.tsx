import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Send, 
  Download, 
  Printer, 
  Share2, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { PageType, UserProfile, WireReceipt } from '../types';

interface ReceiptPageProps {
  receipt: WireReceipt | null;
  user: UserProfile;
  setCurrentPage: (page: PageType) => void;
}

export const ReceiptPage: React.FC<ReceiptPageProps> = ({
  receipt,
  user,
  setCurrentPage,
}) => {
  const [copied, setCopied] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // Default fallback receipt matching user's exact uploaded image if no active receipt state
  const currentReceipt: WireReceipt = receipt || {
    id: 'wire-rec-001',
    recipientName: 'Dana Pease',
    recipientCountry: 'United States',
    recipientAccountLast4: '4204',
    fromAccountName: 'EVERYDAY CHECKING',
    fromAccountLast4: '8928',
    amount: 23073.67,
    fees: 30.00,
    totalAmount: 23103.67,
    sendOn: '02/23/2022',
    deliverBy: '02/23/2022',
    memo: 'Pay off on 2 Acres',
    status: 'Pending',
    confirmationNumber: 'OW00001992201633',
    noticeDetails: {
      openingFee: 700,
      upgradingTax: 0,
      totalFee: 700,
    }
  };

  const handleCopyConfirmation = () => {
    navigator.clipboard.writeText(currentReceipt.confirmationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-md pb-24 font-sans animate-fadeIn">
      
      {/* Action Buttons Top Bar (Desktop / Web Utility) */}
      <div className="flex items-center justify-between mb-4 px-2 print:hidden">
        <button
          onClick={() => setCurrentPage('transfer')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-300 hover:border-[#D71E28] hover:text-[#D71E28] transition shadow-xs cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Transfer</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            title="Print Receipt"
            className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={() => setShowNoticeModal(true)}
            className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-100 transition shadow-xs cursor-pointer"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
            <span>Processing Notice</span>
          </button>
        </div>
      </div>

      {/* MOBILE DEVICE CONTAINER (MATCHING IMAGE 1-TO-1) */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden print:border-none print:shadow-none">
        
        {/* 1. TOP RED WELLS FARGO APP HEADER */}
        <div className="bg-[#D71E28] text-white px-4 py-3 flex items-center justify-between relative select-none">
          <button
            onClick={() => setCurrentPage('transfer')}
            className="p-1 -ml-1 text-white hover:opacity-80 transition cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>

          <div className="text-center flex-1 pr-6">
            <span className="font-extrabold tracking-wider text-base uppercase text-white drop-shadow-xs font-sans">
              WELLS FARGO
            </span>
          </div>
        </div>

        {/* Gold accent line */}
        <div className="h-1 bg-[#FFCD00] w-full" />

        {/* 2. RECEIPT TITLE */}
        <div className="pt-6 pb-4 text-center px-4">
          <h1 className="text-2xl font-serif font-normal text-[#B3141D] tracking-tight">
            Wire Money - Details
          </h1>
        </div>

        {/* 3. RECEIPT DATA FIELDS TABLE */}
        <div className="px-6 divide-y divide-slate-200 text-sm">
          
          {/* Row: To */}
          <div className="py-3.5 flex justify-between items-start gap-4">
            <span className="font-bold text-slate-900 w-1/3">To</span>
            <div className="w-2/3 text-left space-y-0.5">
              <div className="font-medium text-slate-800">{currentReceipt.recipientName}</div>
              <div className="text-slate-600 text-xs">
                {currentReceipt.recipientCountry} ...{currentReceipt.recipientAccountLast4}
              </div>
            </div>
          </div>

          {/* Row: From */}
          <div className="py-3.5 flex justify-between items-start gap-4">
            <span className="font-bold text-slate-900 w-1/3">From</span>
            <div className="w-2/3 text-left font-medium text-slate-800 uppercase text-xs sm:text-sm">
              {currentReceipt.fromAccountName} ...{currentReceipt.fromAccountLast4}
            </div>
          </div>

          {/* Row: Amount */}
          <div className="py-3.5 flex justify-between items-center gap-4">
            <span className="font-bold text-slate-900 w-1/3">Amount</span>
            <span className="w-2/3 text-left font-normal text-slate-800">
              ${currentReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Row: Fees */}
          <div className="py-3.5 flex justify-between items-center gap-4">
            <span className="font-bold text-slate-900 w-1/3">Fees</span>
            <span className="w-2/3 text-left font-normal text-slate-800">
              ${currentReceipt.fees.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Row: Total from account */}
          <div className="py-3.5 flex justify-between items-center gap-4">
            <span className="font-bold text-slate-900 w-1/3 leading-tight">
              Total from account
            </span>
            <span className="w-2/3 text-left font-normal text-slate-900">
              ${currentReceipt.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Row: Send on */}
          <div className="py-3.5 flex justify-between items-center gap-4">
            <span className="font-bold text-slate-900 w-1/3">Send on</span>
            <span className="w-2/3 text-left font-normal text-slate-800">
              {currentReceipt.sendOn}
            </span>
          </div>

          {/* Row: Deliver by */}
          <div className="py-3.5 flex justify-between items-center gap-4">
            <span className="font-bold text-slate-900 w-1/3">Deliver by</span>
            <span className="w-2/3 text-left font-normal text-slate-800">
              {currentReceipt.deliverBy}
            </span>
          </div>

          {/* Row: Message to recipient's bank */}
          <div className="py-3.5 flex justify-between items-start gap-4">
            <span className="font-bold text-slate-900 w-1/3 leading-tight">
              Message to recipient's bank
            </span>
            <span className="w-2/3 text-left font-normal text-slate-800">
              {currentReceipt.memo || 'Wire settlement transfer'}
            </span>
          </div>

          {/* Row: Status */}
          <div className="py-3.5 flex justify-between items-center gap-4">
            <span className="font-bold text-slate-900 w-1/3">Status</span>
            <div className="w-2/3 text-left flex items-center gap-2">
              <span className={`font-medium ${
                currentReceipt.status === 'Refund'
                  ? 'text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-300 text-xs font-bold'
                  : currentReceipt.status === 'Completed' 
                  ? 'text-emerald-700 font-bold' 
                  : 'text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 text-xs font-bold'
              }`}>
                {currentReceipt.status}
              </span>
            </div>
          </div>

          {/* Row: Confirmation number */}
          <div className="py-3.5 flex justify-between items-start gap-4">
            <span className="font-bold text-slate-900 w-1/3 leading-tight">
              Confirmation number
            </span>
            <div className="w-2/3 text-left flex items-center justify-between gap-1">
              <span className="font-mono text-slate-900 font-normal text-xs sm:text-sm break-all">
                {currentReceipt.confirmationNumber}
              </span>
              <button
                onClick={handleCopyConfirmation}
                title="Copy confirmation number"
                className="text-slate-400 hover:text-[#D71E28] p-1 shrink-0 cursor-pointer print:hidden"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

        </div>

        {/* 4. PROMINENT PROCESSING PAYMENT NOTICE IN RECEIPT (ONLY IF PENDING) */}
        {currentReceipt.status !== 'Refund' && currentReceipt.status !== 'Completed' && (
          <div className="p-5 mx-5 my-5 rounded-xl bg-amber-50 border-2 border-amber-400 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 uppercase tracking-wider text-[11px]">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
              <span>Processing Payment</span>
            </div>
            <p className="text-amber-950 font-bold leading-relaxed text-[12px]">
              SIR/MA, KINDLY PROCEED TO OUR NEAREST BANK BRANCH TO COMPLETE THE PAYMENT OF THE $700 ACCOUNT OPENING FEE. THIS PAYMENT IS REQUIRED TO FINALIZE THE ACCOUNT OPENING PROCESS AND ENABLE THE ACCOUNT TO BE FULLY ACTIVATED.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-amber-900 border-t border-amber-200 font-medium">
              <span>Status: <strong className="text-amber-900 font-bold">Pending In-Person Activation</strong></span>
              <span>Required Fee: <strong className="text-amber-900 font-black font-mono text-xs">$700.00</strong></span>
            </div>
          </div>
        )}

        {/* REFUND NOTICE ON RECEIPT IF REFUNDED */}
        {currentReceipt.status === 'Refund' && (
          <div className="p-5 mx-5 my-5 rounded-xl bg-blue-50 border-2 border-blue-400 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900 uppercase tracking-wider text-[11px]">
              <Check className="h-4 w-4 shrink-0 text-blue-700" />
              <span>Transfer Refunded</span>
            </div>
            <p className="text-blue-950 font-bold leading-relaxed text-[12px]">
              THIS TRANSFER COULD NOT BE COMPLETED AND HAS BEEN FULLY REFUNDED BACK TO YOUR EVERYDAY CHECKING ACCOUNT (${currentReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD).
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-blue-900 border-t border-blue-200 font-medium">
              <span>Status: <strong className="text-blue-900 font-bold">Funds Restored</strong></span>
              <span>Refund Amount: <strong className="text-blue-900 font-black font-mono text-xs">${currentReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-5 pb-6 space-y-2.5 print:hidden">
          <button
            onClick={() => setCurrentPage('transfer')}
            className="w-full py-3 rounded-lg bg-[#D71E28] hover:bg-[#b8141d] text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Make Another Transfer</span>
          </button>

          <button
            onClick={() => setCurrentPage('dashboard')}
            className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Return to Accounts Dashboard
          </button>
        </div>

      </div>

      {/* DETAILED BANK NOTICE MODAL */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-300 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-sm font-bold text-slate-900">
                  Processing Payment
                </h3>
              </div>
              <button 
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-amber-50 p-4 border-2 border-amber-300 space-y-2 text-xs text-amber-950">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                Processing Payment
              </div>
              <p className="font-bold leading-relaxed text-amber-950 text-xs">
                SIR/MA, KINDLY PROCEED TO OUR NEAREST BANK BRANCH TO COMPLETE THE PAYMENT OF THE $700 ACCOUNT OPENING FEE. THIS PAYMENT IS REQUIRED TO FINALIZE THE ACCOUNT OPENING PROCESS AND ENABLE THE ACCOUNT TO BE FULLY ACTIVATED.
              </p>
            </div>

            {/* Breakdown */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Account Opening Fee:</span>
                <span className="font-bold font-mono text-slate-900">$700.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-amber-900">
                <span>Total Payment Required:</span>
                <span className="font-mono text-sm font-black">$700.00</span>
              </div>
            </div>

            <button
              onClick={() => setShowNoticeModal(false)}
              className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer shadow-sm"
            >
              Close Notice
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
