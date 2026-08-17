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
      openingFee: 100,
      upgradingTax: 99,
      totalFee: 199,
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
            className="flex items-center gap-1 text-xs font-bold text-[#D71E28] bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition shadow-xs cursor-pointer"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Bank Notice</span>
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
                currentReceipt.status === 'Completed' 
                  ? 'text-emerald-700' 
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

        {/* 4. PROMINENT OFFICIAL BANK SECURITY NOTICE IN RECEIPT */}
        <div className="p-5 mx-5 my-5 rounded-xl bg-red-50 border-2 border-[#D71E28] space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#D71E28] uppercase tracking-wider text-[11px]">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Official Bank Security Notice</span>
          </div>
          <p className="text-slate-800 font-medium leading-relaxed">
            Kindly go to our nearest bank and make the payment for the account. The account-opening fee is $100, and the account-upgrading tax is $99, making the total payment required $199 before completing this transfer.
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-red-200">
            <span>Status: <strong className="text-amber-800 font-bold">Pending In-Person Verification</strong></span>
            <span>Fee Total: <strong className="text-[#D71E28] font-bold font-mono">$199.00</strong></span>
          </div>
        </div>

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
              <div className="flex items-center gap-2.5 text-[#D71E28]">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-sm font-bold text-slate-900">
                  Official Bank Security Notice
                </h3>
              </div>
              <button 
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-red-50 p-4 border border-red-200 space-y-2 text-xs text-slate-800">
              <p className="font-bold leading-relaxed text-red-950">
                Kindly go to our nearest bank and make the payment for the account. The account-opening fee is $100, and the account-upgrading tax is $99, making the total payment required $199 before completing this transfer.
              </p>
            </div>

            {/* Breakdown */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Account-Opening Fee:</span>
                <span className="font-bold font-mono text-slate-900">$100.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Account-Upgrading Tax:</span>
                <span className="font-bold font-mono text-slate-900">$99.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-[#D71E28]">
                <span>Total Required Fee:</span>
                <span className="font-mono text-sm">$199.00</span>
              </div>
            </div>

            <button
              onClick={() => setShowNoticeModal(false)}
              className="w-full py-2.5 rounded-lg bg-[#D71E28] hover:bg-[#b8141d] text-white text-xs font-bold transition cursor-pointer"
            >
              Close Notice
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
