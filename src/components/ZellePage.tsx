import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Send, 
  ArrowDownLeft, 
  QrCode, 
  Search, 
  Plus, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Camera, 
  Phone, 
  Mail, 
  User, 
  ChevronRight, 
  Info, 
  X, 
  Split,
  Settings,
  History,
  Building2,
  Check,
  Download,
  Printer,
  Trash2,
  Edit2,
  ExternalLink,
  Lock
} from 'lucide-react';
import { PageType, UserProfile, Transaction } from '../types';

interface ZellePageProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setCurrentPage: (page: PageType) => void;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addNotification: (title: string, message: string, type?: 'info' | 'security' | 'service' | 'alert') => void;
}

export interface SavedRecipient {
  id: string;
  firstName: string;
  lastName: string;
  identifierType: 'phone' | 'email';
  identifierValue: string;
  nickname?: string;
  dateAdded: string;
}

export const ZellePage: React.FC<ZellePageProps> = ({
  user,
  setUser,
  setCurrentPage,
  setTransactions,
  addNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'request' | 'activity' | 'qr' | 'settings'>('send');

  // Recipient directory state - empty by default or persistent in localStorage
  const [recipients, setRecipients] = useState<SavedRecipient[]>(() => {
    try {
      const saved = localStorage.getItem('wf_zelle_recipients');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<SavedRecipient | null>(null);
  
  // Direct recipient entry form (when not picking from saved)
  const [manualMode, setManualMode] = useState(false);
  const [manualFirstName, setManualFirstName] = useState('');
  const [manualLastName, setManualLastName] = useState('');
  const [manualIdentifierType, setManualIdentifierType] = useState<'phone' | 'email'>('phone');
  const [manualIdentifierValue, setManualIdentifierValue] = useState('');
  const [saveToContacts, setSaveToContacts] = useState(true);

  // Add Recipient Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecipFirstName, setNewRecipFirstName] = useState('');
  const [newRecipLastName, setNewRecipLastName] = useState('');
  const [newRecipType, setNewRecipType] = useState<'phone' | 'email'>('phone');
  const [newRecipValue, setNewRecipValue] = useState('');
  const [newRecipNickname, setNewRecipNickname] = useState('');

  // Send Money state
  const [sendAmount, setSendAmount] = useState('');
  const [sendMemo, setSendMemo] = useState('');
  const [sendStep, setSendStep] = useState<'recipient' | 'amount' | 'review' | 'success'>('recipient');
  const [isProcessingSend, setIsProcessingSend] = useState(false);
  const [lastSentDetails, setLastSentDetails] = useState<{
    amount: number;
    recipientName: string;
    recipientHandle: string;
    confCode: string;
    date: string;
    memo: string;
    fromAccount: string;
  } | null>(null);

  // Request Money state
  const [requestRecipient, setRequestRecipient] = useState<SavedRecipient | null>(null);
  const [reqManualName, setReqManualName] = useState('');
  const [reqManualValue, setReqManualValue] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [requestMemo, setRequestMemo] = useState('');
  const [requestSplitCount, setRequestSplitCount] = useState(2);
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // QR Code state
  const [qrSubTab, setQrSubTab] = useState<'my_code' | 'scan'>('my_code');
  const [copiedToken, setCopiedToken] = useState(false);

  // Daily sending limit tracking
  const DAILY_LIMIT = 2500.00;
  const [usedToday, setUsedToday] = useState(0);

  const saveRecipientsToStorage = (updated: SavedRecipient[]) => {
    setRecipients(updated);
    try {
      localStorage.setItem('wf_zelle_recipients', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipFirstName.trim() || !newRecipValue.trim()) return;

    const newRecip: SavedRecipient = {
      id: `recip_${Date.now()}`,
      firstName: newRecipFirstName.trim(),
      lastName: newRecipLastName.trim(),
      identifierType: newRecipType,
      identifierValue: newRecipValue.trim(),
      nickname: newRecipNickname.trim() || undefined,
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [newRecip, ...recipients];
    saveRecipientsToStorage(updated);
    setSelectedRecipient(newRecip);
    setManualMode(false);
    setIsAddModalOpen(false);

    // reset modal fields
    setNewRecipFirstName('');
    setNewRecipLastName('');
    setNewRecipValue('');
    setNewRecipNickname('');

    addNotification(
      'Zelle® Recipient Added',
      `${newRecip.firstName} ${newRecip.lastName} was added to your Zelle® recipients list.`,
      'service'
    );
  };

  const handleDeleteRecipient = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recipients.filter(r => r.id !== id);
    saveRecipientsToStorage(updated);
    if (selectedRecipient?.id === id) {
      setSelectedRecipient(null);
    }
  };

  const filteredRecipients = useMemo(() => {
    if (!searchQuery.trim()) return recipients;
    const q = searchQuery.toLowerCase();
    return recipients.filter(r => 
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.identifierValue.toLowerCase().includes(q) ||
      (r.nickname && r.nickname.toLowerCase().includes(q))
    );
  }, [recipients, searchQuery]);

  // Proceed from recipient selection to amount
  const handleProceedToAmount = () => {
    if (manualMode) {
      if (!manualFirstName.trim() || !manualIdentifierValue.trim()) return;
      if (saveToContacts) {
        const newRecip: SavedRecipient = {
          id: `recip_${Date.now()}`,
          firstName: manualFirstName.trim(),
          lastName: manualLastName.trim(),
          identifierType: manualIdentifierType,
          identifierValue: manualIdentifierValue.trim(),
          dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        saveRecipientsToStorage([newRecip, ...recipients]);
        setSelectedRecipient(newRecip);
      }
    } else {
      if (!selectedRecipient) return;
    }
    setSendStep('amount');
  };

  // Proceed to review
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(sendAmount);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > user.balance) return;
    if (amt > (DAILY_LIMIT - usedToday)) return;
    setSendStep('review');
  };

  // Confirm and complete Zelle send
  const handleConfirmSend = () => {
    setIsProcessingSend(true);
    const amt = parseFloat(sendAmount);
    
    let recipName = '';
    let recipHandle = '';
    if (selectedRecipient) {
      recipName = `${selectedRecipient.firstName} ${selectedRecipient.lastName}`.trim();
      recipHandle = selectedRecipient.identifierValue;
    } else {
      recipName = `${manualFirstName} ${manualLastName}`.trim() || 'Recipient';
      recipHandle = manualIdentifierValue;
    }

    const confCode = `ZEL${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timestamp = Date.now();

    setTimeout(() => {
      // 1. Deduct balance
      setUser(prev => ({
        ...prev,
        balance: Math.max(0, prev.balance - amt)
      }));

      // 2. Track limit
      setUsedToday(prev => prev + amt);

      // 3. Add to Transactions
      const newTx: Transaction = {
        id: `zelle-${timestamp}`,
        title: `Zelle® to ${recipName}`,
        subtitle: `${recipHandle} • Everyday Checking (...${user.accountNumber.slice(-4) || '3382'})`,
        amount: amt,
        type: 'debit',
        category: 'transfer',
        date: 'Today, ' + timeStr,
        status: 'Completed',
        iconName: 'Send',
        createdAt: timestamp
      };
      setTransactions(prev => [newTx, ...prev]);

      // 4. Notification
      addNotification(
        'Zelle® Payment Sent',
        `$${amt.toFixed(2)} sent to ${recipName}. Confirmation: ${confCode}.`,
        'service'
      );

      // 5. Store record for receipt
      setLastSentDetails({
        amount: amt,
        recipientName: recipName,
        recipientHandle: recipHandle,
        confCode,
        date: `${dateStr} at ${timeStr}`,
        memo: sendMemo.trim() || 'Payment',
        fromAccount: `Everyday Checking (...${user.accountNumber.slice(-4) || '3382'})`
      });

      setIsProcessingSend(false);
      setSendStep('success');
    }, 1500);
  };

  const handleResetSend = () => {
    setSelectedRecipient(null);
    setManualMode(false);
    setManualFirstName('');
    setManualLastName('');
    setManualIdentifierValue('');
    setSendAmount('');
    setSendMemo('');
    setSendStep('recipient');
    setLastSentDetails(null);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(requestAmount);
    if (isNaN(amt) || amt <= 0) return;

    let targetName = '';
    if (requestRecipient) {
      targetName = `${requestRecipient.firstName} ${requestRecipient.lastName}`.trim();
    } else {
      targetName = reqManualName.trim() || 'Recipient';
    }

    setRequestSuccess(true);
    addNotification(
      'Zelle® Request Sent',
      `You requested $${amt.toFixed(2)} from ${targetName}.`,
      'info'
    );

    setTimeout(() => {
      setRequestSuccess(false);
      setRequestAmount('');
      setRequestMemo('');
      setRequestRecipient(null);
      setReqManualName('');
      setReqManualValue('');
    }, 3000);
  };

  const handleCopyEnrollment = () => {
    const val = user.email || 'sofia.martinez@business.com';
    navigator.clipboard?.writeText(val);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 font-sans text-slate-900 pb-16">
      
      {/* 1. TOP UTILITY BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#D71E28] transition cursor-pointer py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Accounts</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium hidden sm:inline">Enrolled Account:</span>
          <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            Checking (...{user.accountNumber.slice(-4) || '3382'})
          </span>
        </div>
      </div>

      {/* 2. AUTHENTIC WELLS FARGO ZELLE BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* Real Zelle Logo Icon */}
            <div className="h-10 w-10 rounded-xl bg-[#7414CA] text-white flex items-center justify-center font-black text-xl tracking-tighter shrink-0 shadow-2xs">
              <span className="font-sans">Z</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Send Money with Zelle<sup className="text-[10px] font-normal">®</sup>
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Send and receive money with friends, family, and trusted businesses in minutes.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-0 border-slate-100">
            <span className="text-slate-500 block">Available Balance</span>
            <span className="text-base font-bold font-mono text-slate-900">
              ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Real Zelle Navigation Tabs */}
        <div className="flex items-center border-t border-slate-100 bg-slate-50/70 px-2 pt-1 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveTab('send'); setSendStep('recipient'); }}
            className={`px-4 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'send'
                ? 'border-[#7414CA] text-[#7414CA] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>

          <button
            onClick={() => setActiveTab('request')}
            className={`px-4 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'request'
                ? 'border-[#7414CA] text-[#7414CA] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="h-3.5 w-3.5" />
            <span>Request & Split</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`px-4 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'qr'
                ? 'border-[#7414CA] text-[#7414CA] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'activity'
                ? 'border-[#7414CA] text-[#7414CA] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Activity</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#7414CA] text-[#7414CA] font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Zelle® Settings</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SEND MONEY FLOW */}
      {/* ========================================================================= */}
      {activeTab === 'send' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
          
          {/* STEP 1: RECIPIENT SELECTION */}
          {sendStep === 'recipient' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Select Recipient</h2>
                  <p className="text-xs text-slate-500">Choose a saved recipient or enter contact details</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setManualMode(!manualMode); setSelectedRecipient(null); }}
                    className="text-xs font-semibold text-[#7414CA] hover:underline cursor-pointer"
                  >
                    {manualMode ? 'View Saved List' : 'Enter New Recipient'}
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#7414CA] bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Add to Contacts</span>
                  </button>
                </div>
              </div>

              {/* Manual Direct Entry Form */}
              {manualMode ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recipient Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John"
                        value={manualFirstName}
                        onChange={(e) => setManualFirstName(e.target.value)}
                        className="w-full rounded-lg bg-white border border-slate-300 py-2 px-3 text-xs text-slate-900 focus:border-[#7414CA] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Doe"
                        value={manualLastName}
                        onChange={(e) => setManualLastName(e.target.value)}
                        className="w-full rounded-lg bg-white border border-slate-300 py-2 px-3 text-xs text-slate-900 focus:border-[#7414CA] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="manualType"
                          checked={manualIdentifierType === 'phone'}
                          onChange={() => setManualIdentifierType('phone')}
                          className="accent-[#7414CA]"
                        />
                        <span>U.S. Mobile Phone</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="manualType"
                          checked={manualIdentifierType === 'email'}
                          onChange={() => setManualIdentifierType('email')}
                          className="accent-[#7414CA]"
                        />
                        <span>Email Address</span>
                      </label>
                    </div>

                    <input
                      type={manualIdentifierType === 'phone' ? 'tel' : 'email'}
                      required
                      placeholder={manualIdentifierType === 'phone' ? '(555) 000-0000' : 'name@example.com'}
                      value={manualIdentifierValue}
                      onChange={(e) => setManualIdentifierValue(e.target.value)}
                      className="w-full rounded-lg bg-white border border-slate-300 py-2 px-3 text-xs text-slate-900 font-mono focus:border-[#7414CA] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="saveContact"
                      checked={saveToContacts}
                      onChange={(e) => setSaveToContacts(e.target.checked)}
                      className="rounded border-slate-300 accent-[#7414CA] cursor-pointer"
                    />
                    <label htmlFor="saveContact" className="text-xs text-slate-600 cursor-pointer">
                      Save to my Zelle® recipients list
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToAmount}
                    disabled={!manualFirstName.trim() || !manualIdentifierValue.trim()}
                    className="w-full mt-2 rounded-xl bg-[#7414CA] hover:bg-[#5E0FA6] disabled:bg-slate-200 disabled:text-slate-400 py-2.5 text-xs font-bold text-white transition cursor-pointer"
                  >
                    Continue to Amount
                  </button>
                </div>
              ) : (
                /* Saved Recipients Directory */
                <div className="space-y-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search saved recipients by name, phone, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-[#7414CA] focus:bg-white focus:outline-none"
                    />
                  </div>

                  {recipients.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 space-y-3">
                      <div className="h-10 w-10 rounded-full bg-purple-50 text-[#7414CA] flex items-center justify-center mx-auto">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-800">No Saved Recipients Yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                          Enter a recipient's U.S. mobile phone or email to send your first Zelle® transfer.
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setManualMode(true)}
                          className="text-xs font-bold bg-[#7414CA] hover:bg-[#5E0FA6] text-white px-3.5 py-2 rounded-xl transition cursor-pointer"
                        >
                          Enter Recipient
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddModalOpen(true)}
                          className="text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-xl transition cursor-pointer"
                        >
                          Add to Contacts
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Recipient List */
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                      {filteredRecipients.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">
                          No recipients match "{searchQuery}"
                        </div>
                      ) : (
                        filteredRecipients.map((r) => {
                          const isSelected = selectedRecipient?.id === r.id;
                          return (
                            <div
                              key={r.id}
                              onClick={() => setSelectedRecipient(r)}
                              className={`p-3 flex items-center justify-between cursor-pointer transition ${
                                isSelected ? 'bg-purple-50/80 border-l-4 border-l-[#7414CA]' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                                  {r.firstName[0]}{r.lastName ? r.lastName[0] : ''}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="text-xs font-bold text-slate-900">
                                      {r.firstName} {r.lastName}
                                    </h4>
                                    {r.nickname && (
                                      <span className="text-[10px] text-slate-500 font-normal">
                                        ({r.nickname})
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                                    {r.identifierValue}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  title="Remove recipient"
                                  onClick={(e) => handleDeleteRecipient(r.id, e)}
                                  className="text-slate-400 hover:text-red-600 p-1 rounded transition cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-[#7414CA] bg-[#7414CA] text-white' : 'border-slate-300'
                                }`}>
                                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {selectedRecipient && (
                    <button
                      type="button"
                      onClick={handleProceedToAmount}
                      className="w-full mt-3 rounded-xl bg-[#7414CA] hover:bg-[#5E0FA6] py-2.5 text-xs font-bold text-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Continue with {selectedRecipient.firstName} {selectedRecipient.lastName}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: AMOUNT & MEMO */}
          {sendStep === 'amount' && (
            <form onSubmit={handleProceedToReview} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Enter Transfer Details</h2>
                  <p className="text-xs text-slate-500">
                    To: <strong className="text-slate-900">
                      {selectedRecipient ? `${selectedRecipient.firstName} ${selectedRecipient.lastName}` : `${manualFirstName} ${manualLastName}`}
                    </strong> ({selectedRecipient ? selectedRecipient.identifierValue : manualIdentifierValue})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSendStep('recipient')}
                  className="text-xs font-semibold text-[#7414CA] hover:underline cursor-pointer"
                >
                  Change Recipient
                </button>
              </div>

              {/* Funding Account Selector */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">From Account</span>
                  <strong className="text-slate-900">Everyday Checking (...{user.accountNumber.slice(-4) || '3382'})</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Available</span>
                  <strong className="font-mono text-slate-900">${user.balance.toFixed(2)}</strong>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Amount
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Daily limit remaining: ${(DAILY_LIMIT - usedToday).toFixed(2)}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-3 text-xl font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={Math.min(user.balance, DAILY_LIMIT - usedToday)}
                    required
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 py-3 pl-9 pr-4 text-2xl font-mono font-bold text-slate-900 focus:border-[#7414CA] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Memo Input (Clean text, no emojis) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  What is this for? (Optional)
                </label>
                <input
                  type="text"
                  maxLength={32}
                  placeholder="Memo (max 32 characters)"
                  value={sendMemo}
                  onChange={(e) => setSendMemo(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 border border-slate-300 py-2 px-3 text-xs text-slate-900 focus:border-[#7414CA] focus:bg-white focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 text-right block mt-0.5">
                  {sendMemo.length}/32
                </span>
              </div>

              {/* Delivery Speed Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Delivery Speed:</span>
                <span className="font-semibold text-slate-900">Typically in minutes (No fee)</span>
              </div>

              {/* Security Warning Notice */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Notice:</strong> Only send money to people you know and trust. Payments sent via Zelle® cannot be cancelled once authorized.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSendStep('recipient')}
                  className="w-1/3 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!sendAmount || parseFloat(sendAmount) <= 0 || parseFloat(sendAmount) > user.balance}
                  className="w-2/3 rounded-xl bg-[#7414CA] hover:bg-[#5E0FA6] disabled:bg-slate-200 disabled:text-slate-400 py-2.5 text-xs font-bold text-white transition cursor-pointer shadow-2xs"
                >
                  Review Payment
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {sendStep === 'review' && (
            <div className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Review & Authorize Transfer</h2>
                <p className="text-xs text-slate-500">Please confirm your payment details below</p>
              </div>

              {/* Payment Summary Box */}
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-center">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Transfer Amount</span>
                <span className="text-3xl font-black font-mono text-[#7414CA] block mt-1">
                  ${parseFloat(sendAmount).toFixed(2)} USD
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 mt-1 inline-block">
                  Transfer Fee: $0.00 (Free)
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl text-xs overflow-hidden">
                <div className="p-3 flex justify-between bg-slate-50/50">
                  <span className="text-slate-500">Recipient Name</span>
                  <strong className="text-slate-900">
                    {selectedRecipient ? `${selectedRecipient.firstName} ${selectedRecipient.lastName}` : `${manualFirstName} ${manualLastName}`}
                  </strong>
                </div>

                <div className="p-3 flex justify-between">
                  <span className="text-slate-500">Recipient Contact</span>
                  <strong className="font-mono text-slate-900">
                    {selectedRecipient ? selectedRecipient.identifierValue : manualIdentifierValue}
                  </strong>
                </div>

                <div className="p-3 flex justify-between bg-slate-50/50">
                  <span className="text-slate-500">From Account</span>
                  <span className="text-slate-900 font-medium">
                    Everyday Checking (...{user.accountNumber.slice(-4) || '3382'})
                  </span>
                </div>

                <div className="p-3 flex justify-between">
                  <span className="text-slate-500">Delivery</span>
                  <span className="text-emerald-700 font-semibold">Typically in minutes</span>
                </div>

                <div className="p-3 flex justify-between bg-slate-50/50">
                  <span className="text-slate-500">Memo</span>
                  <span className="text-slate-800 italic">{sendMemo.trim() || 'Payment'}</span>
                </div>
              </div>

              {/* Wells Fargo Legal Disclaimer */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                By clicking <strong>Send Now</strong>, you authorize Wells Fargo to debit your Everyday Checking account for the amount shown and transfer the funds to the recipient.
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSendStep('amount')}
                  disabled={isProcessingSend}
                  className="sm:w-1/3 rounded-xl bg-slate-100 hover:bg-slate-200 py-3 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSend}
                  disabled={isProcessingSend}
                  className="sm:w-2/3 rounded-xl bg-[#7414CA] hover:bg-[#5E0FA6] disabled:bg-purple-300 py-3 text-xs font-bold text-white transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                >
                  {isProcessingSend ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Authorizing Transfer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send ${parseFloat(sendAmount).toFixed(2)} Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {sendStep === 'success' && lastSentDetails && (
            <div className="space-y-4 text-center py-2">
              <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Transfer Completed
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-2">
                  Payment Sent to {lastSentDetails.recipientName}
                </h2>
                <p className="text-2xl font-black font-mono text-[#7414CA] mt-1">
                  ${lastSentDetails.amount.toFixed(2)} USD
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Delivered to {lastSentDetails.recipientHandle}
                </p>
              </div>

              {/* Official Receipt Block */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Confirmation Number</span>
                  <strong className="font-mono text-slate-900">{lastSentDetails.confCode}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Date & Time</span>
                  <span className="text-slate-800">{lastSentDetails.date}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">From Account</span>
                  <span className="text-slate-800">{lastSentDetails.fromAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Memo</span>
                  <span className="text-slate-800">{lastSentDetails.memo}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleResetSend}
                  className="rounded-xl bg-[#7414CA] hover:bg-[#5E0FA6] py-2.5 px-4 text-xs font-bold text-white transition cursor-pointer"
                >
                  Send Another Payment
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('dashboard')}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 px-4 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Return to Accounts
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REQUEST & SPLIT */}
      {/* ========================================================================= */}
      {activeTab === 'request' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Request Money or Split an Expense</h2>
              <p className="text-xs text-slate-500">Request payments from another Zelle® user</p>
            </div>

            <button
              type="button"
              onClick={() => setIsSplitMode(!isSplitMode)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                isSplitMode ? 'bg-purple-50 text-[#7414CA] border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Split className="h-3.5 w-3.5" />
              <span>{isSplitMode ? 'Split Mode Active' : 'Split an Expense'}</span>
            </button>
          </div>

          <form onSubmit={handleSendRequest} className="space-y-4">
            {/* Request Recipient Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Request From
              </label>

              {recipients.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {recipients.map((r) => {
                      const isSelected = requestRecipient?.id === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => { setRequestRecipient(r); setReqManualName(''); setReqManualValue(''); }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition cursor-pointer shrink-0 ${
                            isSelected ? 'bg-purple-50 border-[#7414CA] text-[#7414CA] font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{r.firstName} {r.lastName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Manual input if no saved recipient selected */}
              {!requestRecipient && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name"
                    value={reqManualName}
                    onChange={(e) => setReqManualName(e.target.value)}
                    className="rounded-lg bg-slate-50 border border-slate-300 py-2 px-3 text-xs text-slate-900 focus:border-[#7414CA] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="U.S. Mobile Phone or Email"
                    value={reqManualValue}
                    onChange={(e) => setReqManualValue(e.target.value)}
                    className="rounded-lg bg-slate-50 border border-slate-300 py-2 px-3 text-xs text-slate-900 focus:border-[#7414CA] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Total Request Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {isSplitMode ? 'Total Bill Amount' : 'Amount to Request'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-lg font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 py-2.5 pl-8 pr-4 text-xl font-mono font-bold text-slate-900 focus:border-[#7414CA] focus:outline-none"
                />
              </div>
            </div>

            {/* Split Calculator */}
            {isSplitMode && (
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Split equally among:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRequestSplitCount(prev => Math.max(2, prev - 1))}
                      className="h-6 w-6 rounded bg-white border border-slate-300 font-bold text-slate-700 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-[#7414CA] min-w-4 text-center">{requestSplitCount} people</span>
                    <button
                      type="button"
                      onClick={() => setRequestSplitCount(prev => Math.min(20, prev + 1))}
                      className="h-6 w-6 rounded bg-white border border-slate-300 font-bold text-slate-700 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {parseFloat(requestAmount) > 0 && (
                  <div className="pt-2 border-t border-purple-200 flex justify-between items-center">
                    <span className="text-slate-600">Amount per person:</span>
                    <strong className="text-sm font-mono text-[#7414CA]">
                      ${(parseFloat(requestAmount) / requestSplitCount).toFixed(2)} USD
                    </strong>
                  </div>
                )}
              </div>
            )}

            {/* Request Memo */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Reason / Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Dinner, utilities, groceries"
                value={requestMemo}
                onChange={(e) => setRequestMemo(e.target.value)}
                className="w-full rounded-lg bg-slate-50 border border-slate-300 py-2 px-3 text-xs text-slate-900 focus:border-[#7414CA] focus:outline-none"
              />
            </div>

            {requestSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zelle® payment request has been sent.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!requestAmount || parseFloat(requestAmount) <= 0}
              className="w-full rounded-xl bg-[#7414CA] hover:bg-[#5E0FA6] disabled:bg-slate-200 disabled:text-slate-400 py-3 text-xs font-bold text-white transition cursor-pointer shadow-2xs"
            >
              Send Payment Request
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: QR CODE */}
      {/* ========================================================================= */}
      {activeTab === 'qr' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4 text-center">
          
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold mx-auto">
            <button
              onClick={() => setQrSubTab('my_code')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                qrSubTab === 'my_code' ? 'bg-[#7414CA] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Zelle® QR Code
            </button>
            <button
              onClick={() => setQrSubTab('scan')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                qrSubTab === 'scan' ? 'bg-[#7414CA] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scan to Pay
            </button>
          </div>

          {qrSubTab === 'my_code' ? (
            <div className="space-y-4 pt-2">
              <div className="max-w-xs mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <div className="h-8 w-8 rounded-lg bg-[#7414CA] text-white font-black text-sm flex items-center justify-center mx-auto">
                  Z
                </div>

                {/* Clean Real QR vector */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 w-44 h-44 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    {/* Corners */}
                    <rect x="6" y="6" width="28" height="28" rx="2" fill="#7414CA" />
                    <rect x="10" y="10" width="20" height="20" rx="1" fill="white" />
                    <rect x="14" y="14" width="12" height="12" rx="1" fill="#7414CA" />

                    <rect x="66" y="6" width="28" height="28" rx="2" fill="#7414CA" />
                    <rect x="70" y="10" width="20" height="20" rx="1" fill="white" />
                    <rect x="74" y="14" width="12" height="12" rx="1" fill="#7414CA" />

                    <rect x="6" y="66" width="28" height="28" rx="2" fill="#7414CA" />
                    <rect x="10" y="70" width="20" height="20" rx="1" fill="white" />
                    <rect x="14" y="74" width="12" height="12" rx="1" fill="#7414CA" />

                    {/* Data grid */}
                    <rect x="42" y="10" width="6" height="6" />
                    <rect x="52" y="10" width="6" height="6" />
                    <rect x="42" y="24" width="6" height="6" />
                    <rect x="52" y="20" width="6" height="6" />
                    <rect x="10" y="42" width="6" height="6" />
                    <rect x="20" y="42" width="6" height="6" />
                    <rect x="42" y="42" width="16" height="16" rx="2" fill="#7414CA" />
                    <rect x="66" y="42" width="6" height="6" />
                    <rect x="80" y="42" width="8" height="6" />
                    <rect x="42" y="66" width="6" height="6" />
                    <rect x="52" y="74" width="6" height="6" />
                    <rect x="66" y="66" width="8" height="6" />
                    <rect x="80" y="76" width="8" height="8" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900">{user.name}</h3>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">{user.email || 'sofia.martinez@business.com'}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Other Zelle® users can scan this QR code with their mobile banking app to send money directly to your account.
              </p>

              <button
                type="button"
                onClick={handleCopyEnrollment}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedToken ? 'Copied to Clipboard' : 'Copy Enrolled Contact Info'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="max-w-xs mx-auto aspect-square rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <Camera className="h-10 w-10 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-200">Camera Viewfinder</p>
                <div className="absolute inset-8 border-2 border-[#7414CA] rounded-xl opacity-70"></div>
              </div>
              <p className="text-xs text-slate-500">
                Align the recipient's Zelle® QR code in the camera window to initiate payment.
              </p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ZELLE ACTIVITY */}
      {/* ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Zelle® Activity & History</h2>
              <p className="text-xs text-slate-500">Past transactions sent or received via Zelle®</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
            <div className="p-3 bg-slate-50 font-semibold text-slate-700 grid grid-cols-12 gap-2">
              <span className="col-span-6">Description</span>
              <span className="col-span-3">Status</span>
              <span className="col-span-3 text-right">Amount</span>
            </div>

            {lastSentDetails && (
              <div className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-slate-50">
                <div className="col-span-6">
                  <strong className="text-slate-900 block">{lastSentDetails.recipientName}</strong>
                  <span className="text-[11px] text-slate-500">{lastSentDetails.date}</span>
                </div>
                <div className="col-span-3">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Completed
                  </span>
                </div>
                <div className="col-span-3 text-right font-mono font-bold text-slate-900">
                  -${lastSentDetails.amount.toFixed(2)}
                </div>
              </div>
            )}

            <div className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-slate-50">
              <div className="col-span-6">
                <strong className="text-slate-900 block">Zelle® Enrollment Verification</strong>
                <span className="text-[11px] text-slate-500">Enrolled checking account</span>
              </div>
              <div className="col-span-3">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <div className="col-span-3 text-right font-mono font-bold text-slate-500">
                $0.00
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ZELLE SETTINGS & ENROLLMENT */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4 text-xs">
          <div className="pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Zelle® Profile & Preferences</h2>
            <p className="text-xs text-slate-500">Manage enrolled contact tokens and deposit accounts</p>
          </div>

          {/* Enrolled Identifiers */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Enrolled Contact Methods
            </h3>
            
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#7414CA]" />
                <div>
                  <strong className="text-slate-900 block">{user.email || 'sofia.martinez@business.com'}</strong>
                  <span className="text-[10px] text-slate-500">Primary Email Identifier</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Enrolled
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#7414CA]" />
                <div>
                  <strong className="text-slate-900 block">{user.phone || '(415) 890-2341'}</strong>
                  <span className="text-[10px] text-slate-500">Primary U.S. Mobile</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Enrolled
              </span>
            </div>
          </div>

          {/* Deposit Account */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Deposit Account
            </h3>
            <p className="text-slate-600 text-[11px]">
              Incoming Zelle® transfers are automatically deposited into:
            </p>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">Everyday Checking</strong>
                <span className="text-[10px] font-mono text-slate-500">Account Ending ...{user.accountNumber.slice(-4) || '3382'}</span>
              </div>
              <span className="text-xs font-semibold text-[#7414CA]">Default</span>
            </div>
          </div>

          {/* Limits Info */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-[11px] text-slate-600">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Sending Limits
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span>Daily Sending Limit:</span>
              <strong className="font-mono text-slate-900">${DAILY_LIMIT.toFixed(2)} USD</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span>Remaining Today:</span>
              <strong className="font-mono text-emerald-700">${(DAILY_LIMIT - usedToday).toFixed(2)} USD</strong>
            </div>
            <div className="flex justify-between py-1">
              <span>Monthly Sending Limit:</span>
              <strong className="font-mono text-slate-900">$20,000.00 USD</strong>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD RECIPIENT */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Zelle® Recipient</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecipient} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={newRecipFirstName}
                    onChange={(e) => setNewRecipFirstName(e.target.value)}
                    className="w-full rounded-lg bg-slate-50 border border-slate-300 py-2 px-2.5 text-slate-900 focus:border-[#7414CA] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newRecipLastName}
                    onChange={(e) => setNewRecipLastName(e.target.value)}
                    className="w-full rounded-lg bg-slate-50 border border-slate-300 py-2 px-2.5 text-slate-900 focus:border-[#7414CA] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nickname (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Landlord, Roommate"
                  value={newRecipNickname}
                  onChange={(e) => setNewRecipNickname(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 border border-slate-300 py-2 px-2.5 text-slate-900 focus:border-[#7414CA] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-slate-700">Contact Method *</label>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-700 mb-1">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="newRecipTypeRadio"
                      checked={newRecipType === 'phone'}
                      onChange={() => setNewRecipType('phone')}
                      className="accent-[#7414CA]"
                    />
                    <span>U.S. Mobile Phone</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="newRecipTypeRadio"
                      checked={newRecipType === 'email'}
                      onChange={() => setNewRecipType('email')}
                      className="accent-[#7414CA]"
                    />
                    <span>Email Address</span>
                  </label>
                </div>

                <input
                  type={newRecipType === 'phone' ? 'tel' : 'email'}
                  required
                  placeholder={newRecipType === 'phone' ? '(555) 000-0000' : 'user@example.com'}
                  value={newRecipValue}
                  onChange={(e) => setNewRecipValue(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 border border-slate-300 py-2 px-2.5 text-slate-900 font-mono focus:border-[#7414CA] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 font-semibold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newRecipFirstName.trim() || !newRecipValue.trim()}
                  className="w-1/2 rounded-xl bg-[#7414CA] hover:bg-[#5E0FA6] disabled:bg-slate-200 disabled:text-slate-400 py-2.5 font-bold text-white transition cursor-pointer"
                >
                  Save Recipient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
