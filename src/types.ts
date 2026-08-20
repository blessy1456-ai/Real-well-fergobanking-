export type PageType = 'login' | 'dashboard' | 'transfer' | 'zelle' | 'receipt' | 'profile' | 'notifications';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  avatarUrl: string;
  address: string;
  memberSince: string;
}

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'credit' | 'debit';
  category: 'transfer' | 'utility' | 'card' | 'income' | 'shopping' | 'deposit';
  date: string;
  status: 'Completed' | 'Pending' | 'Verification Required' | 'Loan in processing' | 'Refund' | string;
  iconName: string;
  receiptData?: WireReceipt;
  createdAt?: number;
}

export interface WireReceipt {
  id: string;
  recipientName: string;
  recipientCountry: string;
  recipientAccountLast4: string;
  fromAccountName: string;
  fromAccountLast4: string;
  amount: number;
  fees: number;
  totalAmount: number;
  sendOn: string;
  deliverBy: string;
  memo: string;
  status: 'Pending' | 'Completed' | 'Pending Verification' | 'Refund';
  confirmationNumber: string;
  noticeDetails?: {
    openingFee: number;
    upgradingTax: number;
    totalFee: number;
  };
  createdAt?: number;
}

export interface CreditCardItem {
  id: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardType: 'Visa' | 'Mastercard' | 'Amex';
  balance: number;
  limit: number;
  gradient: string;
  isVirtual: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'security' | 'service' | 'alert';
}

export interface TransferFormData {
  recipientName: string;
  bankName: string;
  accountNumber: string;
  amount: string;
  note?: string;
}
