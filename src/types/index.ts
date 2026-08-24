export type UserRole = 'owner' | 'subscriber' | 'calculator';

export type LineType = 'golden' | 'regular' | 'night'; // ذهبي 24 ساعة | عادي نهاري ومسائي | ليلي فقط

export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'overdue';

export type PaymentMethod = 'zain_cash' | 'fib' | 'qi_card' | 'cash';

export interface Subscriber {
  id: string;
  name: string;
  phone: string;
  address: {
    district: string; // e.g. المنصور
    mahalla: string; // محلة 609
    zuqaq: string; // زقاق 12
    dar: string; // دار 34
  };
  amperes: number; // e.g. 5, 8, 10, 15
  lineType: LineType;
  boxNumber: string; // رقم بوكس الجوزات (e.g. B-04)
  breakerNumber: string; // رقم الجوزة (e.g. 12)
  joinDate: string;
  balanceDue: number; // المبلغ المتبقي الحالي بالدينار
  totalDebt: number; // ديون سابقة متراكمة
  status: 'active' | 'suspended' | 'disconnected'; // مفعل | مفصول مؤقتاً | مقطوع بسبب ديون
  avatar?: string;
  notes?: string;
}

export interface MonthlyBill {
  id: string;
  subscriberId: string;
  monthYear: string; // e.g. "2026-08" or "آب 2026"
  amperes: number;
  pricePerAmpere: number; // IQD
  baseAmount: number;
  previousDebt: number;
  discount: number;
  totalDue: number;
  paidAmount: number;
  status: PaymentStatus;
  dueDate: string;
  issuedDate: string;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string; // e.g. "KTK-2026-0891"
  billId: string;
  subscriberId: string;
  subscriberName: string;
  amperes: number;
  amountPaid: number;
  remainingDebt: number;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  paidAt: string;
  collectorName: string;
  monthYear: string;
  qrPayload: string;
}

export type TicketType = 'breaker_tripped' | 'low_voltage' | 'broken_cable' | 'change_ampere' | 'billing_inquiry' | 'other';

export interface SupportTicket {
  id: string;
  subscriberId: string;
  subscriberName: string;
  subscriberPhone: string;
  boxNumber: string;
  type: TicketType;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface OutageAlert {
  id: string;
  title: string;
  message: string;
  type: 'grid_online' | 'generator_started' | 'breakdown' | 'maintenance' | 'pricing' | 'payment_reminder';
  timestamp: string;
  author: string;
  isUrgent?: boolean;
}

export interface ExpenseRecord {
  id: string;
  category: 'diesel' | 'oil_filters' | 'repairs' | 'operator_wage' | 'platform_fee' | 'other';
  title: string;
  amount: number; // IQD
  date: string;
  litersOfDiesel?: number;
  pricePerLiter?: number;
  notes?: string;
}

export type GeneratorState = 'running' | 'national_grid' | 'maintenance' | 'stopped';

export interface GeneratorInfo {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  neighborhood: string;
  city: string;
  capacityKva: number; // e.g. 500 kVA
  dieselLevelPercent: number; // 0-100
  currentVoltage: number; // e.g. 228 V
  currentFrequency: number; // e.g. 50.1 Hz
  state: GeneratorState;
  currentMonthAmpPrice: number; // IQD (e.g. 12,000)
  officialGovRate: number; // IQD (e.g. 10,000)
  bankAccounts: {
    zainCashNumber: string;
    fibIban: string;
    qiCardNumber: string;
  };
}
