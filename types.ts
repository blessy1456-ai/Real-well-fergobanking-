export type PageType = 'login' | 'dashboard' | 'transfer' | 'profile' | 'notifications';

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
  category: 'transfer' | 'utility' | 'card' | 'income' | 'shopping';
  date: string;
  status: 'Completed' | 'Pending' | 'Verification Required' | 'Loan in processing' | string;
  iconName: string;
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
