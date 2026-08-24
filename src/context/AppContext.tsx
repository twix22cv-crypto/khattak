import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GeneratorInfo,
  Subscriber,
  MonthlyBill,
  PaymentReceipt,
  SupportTicket,
  OutageAlert,
  ExpenseRecord,
  UserRole,
  PaymentMethod,
  GeneratorState,
  TicketType,
} from '../types';
import {
  initialGeneratorInfo,
  initialSubscribers,
  initialBills,
  initialReceipts,
  initialTickets,
  initialAlerts,
  initialExpenses,
} from '../data/initialData';

export type Language = 'ar' | 'en';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  
  // Active subscriber ID when in subscriber role
  currentSubscriberId: string;
  setCurrentSubscriberId: (id: string) => void;
  currentSubscriber: Subscriber | undefined;
  
  // Generator State & Details
  generator: GeneratorInfo;
  updateGeneratorState: (state: GeneratorState) => void;
  updateGeneratorInfo: (info: Partial<GeneratorInfo>) => void;
  
  // Subscribers
  subscribers: Subscriber[];
  addSubscriber: (sub: Omit<Subscriber, 'id' | 'joinDate' | 'balanceDue' | 'totalDebt'>) => void;
  updateSubscriber: (id: string, sub: Partial<Subscriber>) => void;
  deleteSubscriber: (id: string) => void;
  
  // Bills
  bills: MonthlyBill[];
  generateMonthlyBills: (monthYear: string, ampPrice: number) => void;
  getSubscriberBills: (subscriberId: string) => MonthlyBill[];
  
  // Receipts & Payments
  receipts: PaymentReceipt[];
  processPayment: (
    billId: string,
    amount: number,
    method: PaymentMethod,
    refCode?: string
  ) => Promise<PaymentReceipt>;
  
  // Tickets / Issues
  tickets: SupportTicket[];
  createTicket: (
    subscriberId: string,
    type: TicketType,
    title: string,
    description: string
  ) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  
  // Outage & Broadcast Alerts
  alerts: OutageAlert[];
  sendAlert: (title: string, message: string, type: OutageAlert['type'], isUrgent?: boolean) => void;
  
  // Expenses
  expenses: ExpenseRecord[];
  addExpense: (expense: Omit<ExpenseRecord, 'id' | 'date'>) => void;
  deleteExpense: (id: string) => void;
  
  // Active Toasts
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: ToastNotification['type']) => void;
  
  // Reset
  resetToDefaultData: () => void;
}

const STORAGE_KEYS = {
  ROLE: 'khattak_role',
  LANG: 'khattak_lang',
  GEN: 'khattak_gen',
  SUBS: 'khattak_subs',
  BILLS: 'khattak_bills',
  RECEIPTS: 'khattak_receipts',
  TICKETS: 'khattak_tickets',
  ALERTS: 'khattak_alerts',
  EXPENSES: 'khattak_expenses',
  CURRENT_SUB: 'khattak_current_sub',
};

const translations: Record<Language, Record<string, string>> = {
  ar: {
    appName: 'خطك',
    appTagline: 'نظام إدارة اشتراكات المولدات الأهلية',
    ownerRole: 'صاحب المولدة',
    subscriberRole: 'المشترك (المواطن)',
    calculatorRole: 'حاسبة الأرباح والكاز',
    generatorStatus: 'حالة المولدة',
    running: 'المولدة شغالة ⚡',
    national_grid: 'الكهرباء الوطنية 🏛️',
    maintenance: 'صيانة دورية 🛠️',
    stopped: 'متوقفة ⚠️',
    amperes: 'أمبير',
    amperesCount: 'عدد الأمبيرات',
    iqd: 'د.ع',
    subscribers: 'المشتركين',
    financials: 'المالية والأرباح',
    billing: 'الفواتير والتسعيرة',
    alerts: 'تنبيهات الانقطاع والصيانة',
    tickets: 'الشكاوى والأعطال',
    totalSubscribers: 'إجمالي المشتركين',
    activeLines: 'خطوط فعالة',
    totalAmperes: 'مجموع الأمبيرات',
    collectedThisMonth: 'المحصل هذا الشهر',
    pendingDebts: 'الديون المتبقية',
    payViaZainCash: 'دفع عبر زين كاش',
    payViaFib: 'دفع عبر FIB',
    payViaQi: 'دفع عبر كي كارد',
    cashCollector: 'طلب جابي كاش',
    breakerTripped: 'الجوزة فصلت!',
    lowVoltage: 'ضعف الفولتية',
    changeAmpere: 'تغيير الأمبيرات',
    reportIssue: 'إبلاغ عن عطل',
    printReceipt: 'طباعة وصل حراري',
    goldenLine: 'خط ذهبي (24 ساعة)',
    regularLine: 'خط عادي',
    nightLine: 'خط ليلي',
    paid: 'مسدد بالكامل',
    unpaid: 'غير مسدد',
    partial: 'مسدد جزئياً',
    overdue: 'متأخر ومتراكم',
    switchUser: 'تبديل الحساب',
    voltage: 'الفولتية',
    frequency: 'التردد',
    dieselLevel: 'مستوى خزان الكاز',
  },
  en: {
    appName: 'Khattak',
    appTagline: 'Generator Subscription Platform',
    ownerRole: 'Generator Owner',
    subscriberRole: 'Subscriber (Resident)',
    calculatorRole: 'Profit & Fuel Calculator',
    generatorStatus: 'Power Source',
    running: 'Generator Running ⚡',
    national_grid: 'National Grid 🏛️',
    maintenance: 'Under Maintenance 🛠️',
    stopped: 'Stopped / Off ⚠️',
    amperes: 'Amperes',
    amperesCount: 'Ampere Count',
    iqd: 'IQD',
    subscribers: 'Subscribers',
    financials: 'Financials & Revenue',
    billing: 'Billing & Invoicing',
    alerts: 'Outages & Broadcasts',
    tickets: 'Support & Tickets',
    totalSubscribers: 'Total Subscribers',
    activeLines: 'Active Lines',
    totalAmperes: 'Total Amperes',
    collectedThisMonth: 'Collected This Month',
    pendingDebts: 'Outstanding Debts',
    payViaZainCash: 'Pay with Zain Cash',
    payViaFib: 'Pay with FIB',
    payViaQi: 'Pay with Qi Card',
    cashCollector: 'Request Cash Collector',
    breakerTripped: 'Breaker Tripped!',
    lowVoltage: 'Low Voltage',
    changeAmpere: 'Change Amperes',
    reportIssue: 'Report Issue',
    printReceipt: 'Print Thermal Receipt',
    goldenLine: 'Golden (24h continuous)',
    regularLine: 'Standard Line',
    nightLine: 'Night Only',
    paid: 'Paid in Full',
    unpaid: 'Unpaid',
    partial: 'Partially Paid',
    overdue: 'Overdue / Debt',
    switchUser: 'Switch User',
    voltage: 'Voltage',
    frequency: 'Frequency',
    dieselLevel: 'Diesel Tank Level',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'owner';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'ar';
  });

  const [generator, setGenerator] = useState<GeneratorInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GEN);
    return saved ? JSON.parse(saved) : initialGeneratorInfo;
  });

  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBS);
    return saved ? JSON.parse(saved) : initialSubscribers;
  });

  const [bills, setBills] = useState<MonthlyBill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [receipts, setReceipts] = useState<PaymentReceipt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    return saved ? JSON.parse(saved) : initialReceipts;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [alerts, setAlerts] = useState<OutageAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [currentSubscriberId, setCurrentSubscriberId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_SUB) || 'sub-1';
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEN, JSON.stringify(generator));
  }, [generator]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBS, JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));
  }, [receipts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SUB, currentSubscriberId);
  }, [currentSubscriberId]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const showToast = (title: string, message: string, type: ToastNotification['type'] = 'info') => {
    const newToast: ToastNotification = {
      id: 'toast-' + Date.now() + Math.random(),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    // Auto dismiss
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const currentSubscriber = subscribers.find((s) => s.id === currentSubscriberId) || subscribers[0];

  const updateGeneratorState = (newState: GeneratorState) => {
    setGenerator((prev) => ({
      ...prev,
      state: newState,
      currentVoltage:
        newState === 'running' ? 226 : newState === 'national_grid' ? 232 : 0,
    }));

    const stateLabels: Record<GeneratorState, string> = {
      running: 'تم تشغيل المولدة بنجاح ⚡ الفولتية 226V',
      national_grid: 'تم التحويل إلى الكهرباء الوطنية 🏛️ المولدة في وضع الاستعداد',
      maintenance: 'المولدة في وضع الصيانة الدورية 🛠️',
      stopped: 'تم إيقاف تشغيل المولدة ⚠️',
    };

    sendAlert(
      newState === 'running' ? 'تشغيل المولدة' : 'تحديث مصدر الطاقة',
      stateLabels[newState],
      newState === 'running' ? 'generator_started' : 'grid_online',
      newState === 'stopped'
    );

    showToast('تحديث حالة الطاقة', stateLabels[newState], newState === 'stopped' ? 'alert' : 'info');
  };

  const updateGeneratorInfo = (info: Partial<GeneratorInfo>) => {
    setGenerator((prev) => ({ ...prev, ...info }));
    showToast('تحديث البيانات', 'تم حفظ إعدادات المولدة بنجاح', 'success');
  };

  const addSubscriber = (newSubData: Omit<Subscriber, 'id' | 'joinDate' | 'balanceDue' | 'totalDebt'>) => {
    const id = 'sub-' + (subscribers.length + 1);
    const newSub: Subscriber = {
      ...newSubData,
      id,
      joinDate: new Date().toISOString().split('T')[0],
      balanceDue: 0,
      totalDebt: 0,
    };
    setSubscribers((prev) => [newSub, ...prev]);
    showToast('تمت إضافة مشترك', `تم تسجيل المشترك ${newSub.name} بنجاح`, 'success');
  };

  const updateSubscriber = (id: string, updatedFields: Partial<Subscriber>) => {
    setSubscribers((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updatedFields } : sub))
    );
    showToast('تحديث المشترك', 'تم تعديل بيانات المشترك بنجاح', 'success');
  };

  const deleteSubscriber = (id: string) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    showToast('حذف مشترك', 'تم حذف المشترك من قاعدة البيانات', 'warning');
  };

  const generateMonthlyBills = (monthYear: string, ampPrice: number) => {
    const newBills: MonthlyBill[] = subscribers.map((sub) => {
      const lineMultiplier = sub.lineType === 'night' ? 0.7 : 1;
      const effectiveRate = Math.round(ampPrice * lineMultiplier);
      const baseAmount = sub.amperes * effectiveRate;
      const totalDue = baseAmount + sub.totalDebt;
      return {
        id: `bill-${monthYear}-${sub.id}`,
        subscriberId: sub.id,
        monthYear,
        amperes: sub.amperes,
        pricePerAmpere: effectiveRate,
        baseAmount,
        previousDebt: sub.totalDebt,
        discount: 0,
        totalDue,
        paidAmount: 0,
        status: 'unpaid',
        dueDate: '2026-08-30',
        issuedDate: new Date().toISOString().split('T')[0],
      };
    });

    setBills((prev) => {
      // Remove any existing for this month and replace
      const filtered = prev.filter((b) => b.monthYear !== monthYear);
      return [...newBills, ...filtered];
    });

    // Update subscribers balanceDue
    setSubscribers((prev) =>
      prev.map((sub) => {
        const lineMultiplier = sub.lineType === 'night' ? 0.7 : 1;
        const effectiveRate = Math.round(ampPrice * lineMultiplier);
        const billTotal = sub.amperes * effectiveRate + sub.totalDebt;
        return {
          ...sub,
          balanceDue: billTotal,
        };
      })
    );

    sendAlert(
      `صدور فواتير شهر ${monthYear} 📋`,
      `تم إصدار فواتير الاشتراك بسعر ${ampPrice.toLocaleString()} د.ع للأمبير. يرجى المبادرة بالتسديد عبر التطبيق.`,
      'pricing'
    );

    showToast('إصدار الفواتير', `تم إصدار ${subscribers.length} فاتورة لشهر ${monthYear}`, 'success');
  };

  const getSubscriberBills = (subscriberId: string) => {
    return bills.filter((b) => b.subscriberId === subscriberId);
  };

  const processPayment = async (
    billId: string,
    amount: number,
    method: PaymentMethod,
    refCode?: string
  ): Promise<PaymentReceipt> => {
    const bill = bills.find((b) => b.id === billId);
    if (!bill) throw new Error('Bill not found');

    const sub = subscribers.find((s) => s.id === bill.subscriberId);
    const subName = sub ? sub.name : 'مشترك خطك';

    const newPaidTotal = bill.paidAmount + amount;
    const isFullyPaid = newPaidTotal >= bill.totalDue;
    const remainingForBill = Math.max(0, bill.totalDue - newPaidTotal);

    // Update bill
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              paidAmount: newPaidTotal,
              status: isFullyPaid ? 'paid' : 'partial',
            }
          : b
      )
    );

    // Update subscriber
    if (sub) {
      setSubscribers((prev) =>
        prev.map((s) => {
          if (s.id === sub.id) {
            const newBalance = Math.max(0, s.balanceDue - amount);
            const newDebt = isFullyPaid ? 0 : Math.max(0, s.totalDebt - (amount - bill.baseAmount));
            return {
              ...s,
              balanceDue: newBalance,
              totalDebt: newDebt,
              status: 'active', // Reactivate if was suspended
            };
          }
          return s;
        })
      );
    }

    const receiptNum = `KTK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const collectorLabels: Record<PaymentMethod, string> = {
      zain_cash: 'بوابة زين كاش الإلكترونية (ZainCash)',
      fib: 'المصرف العراقي الأول (FIB Gate)',
      qi_card: 'بوابة كي كارد / ماستركارد',
      cash: 'الجابي النقدي المعتمد',
    };

    const newReceipt: PaymentReceipt = {
      id: 'rec-' + Date.now(),
      receiptNumber: receiptNum,
      billId,
      subscriberId: bill.subscriberId,
      subscriberName: subName,
      amperes: bill.amperes,
      amountPaid: amount,
      remainingDebt: remainingForBill,
      paymentMethod: method,
      transactionRef: refCode || `TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paidAt: formattedDate,
      collectorName: collectorLabels[method],
      monthYear: bill.monthYear,
      qrPayload: `KHATTAK|RECEIPT:${receiptNum}|SUB:${subName}|AMT:${amount}|DATE:${formattedDate}|METHOD:${method}`,
    };

    setReceipts((prev) => [newReceipt, ...prev]);

    showToast(
      'تم التسديد بنجاح 🧾',
      `تم استلام مبلغ ${amount.toLocaleString()} د.ع للمشترك ${subName}`,
      'success'
    );

    return newReceipt;
  };

  const createTicket = (
    subscriberId: string,
    type: TicketType,
    title: string,
    description: string
  ) => {
    const sub = subscribers.find((s) => s.id === subscriberId);
    const newTicket: SupportTicket = {
      id: 'tkt-' + (tickets.length + 101),
      subscriberId,
      subscriberName: sub ? sub.name : 'مشترك',
      subscriberPhone: sub ? sub.phone : '',
      boxNumber: sub ? sub.boxNumber : 'بوكس رئيسي',
      type,
      title,
      description,
      status: 'open',
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      priority: type === 'breaker_tripped' ? 'high' : 'medium',
    };

    setTickets((prev) => [newTicket, ...prev]);

    showToast(
      'تم إرسال البلاغ لصاحب المولدة 📡',
      `تم استلام طلب: ${title}. سيتم التعامل معه فوراً.`,
      'info'
    );
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((tkt) =>
        tkt.id === ticketId
          ? {
              ...tkt,
              status,
              resolvedAt:
                status === 'resolved'
                  ? new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                  : undefined,
            }
          : tkt
      )
    );

    showToast('تحديث الشكوى', 'تم تغيير حالة الشكوى بنجاح', 'success');
  };

  const sendAlert = (
    title: string,
    message: string,
    type: OutageAlert['type'],
    isUrgent: boolean = false
  ) => {
    const newAlert: OutageAlert = {
      id: 'alt-' + Date.now(),
      title,
      message,
      type,
      timestamp: 'الآن',
      author: generator.ownerName,
      isUrgent,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const addExpense = (expenseData: Omit<ExpenseRecord, 'id' | 'date'>) => {
    const newExpense: ExpenseRecord = {
      ...expenseData,
      id: 'exp-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast('تسجيل مصروف', `تم إضافة مصروف بقيمة ${newExpense.amount.toLocaleString()} د.ع`, 'info');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('حذف مصروف', 'تم حذف قيد المصروف', 'warning');
  };

  const resetToDefaultData = () => {
    setGenerator(initialGeneratorInfo);
    setSubscribers(initialSubscribers);
    setBills(initialBills);
    setReceipts(initialReceipts);
    setTickets(initialTickets);
    setAlerts(initialAlerts);
    setExpenses(initialExpenses);
    setCurrentSubscriberId('sub-1');
    localStorage.clear();
    showToast('استعادة البيانات', 'تمت استعادة البيانات الافتراضية بنجاح', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        currentSubscriberId,
        setCurrentSubscriberId,
        currentSubscriber,
        generator,
        updateGeneratorState,
        updateGeneratorInfo,
        subscribers,
        addSubscriber,
        updateSubscriber,
        deleteSubscriber,
        bills,
        generateMonthlyBills,
        getSubscriberBills,
        receipts,
        processPayment,
        tickets,
        createTicket,
        updateTicketStatus,
        alerts,
        sendAlert,
        expenses,
        addExpense,
        deleteExpense,
        toasts,
        dismissToast,
        showToast,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
