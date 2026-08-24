import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriberList } from './SubscriberList';
import { BillingManager } from './BillingManager';
import { FinancialLedger } from './FinancialLedger';
import { TicketManager } from './TicketManager';
import { SubscriberModal } from './SubscriberModal';
import { QuickPaymentModal } from './QuickPaymentModal';
import { ThermalReceiptModal } from './ThermalReceiptModal';
import { OutageBroadcastModal } from './OutageBroadcastModal';
import { Subscriber, PaymentReceipt, GeneratorState } from '../../types';
import {
  Users,
  Receipt,
  Wallet,
  Wrench,
  Megaphone,
  Zap,
  Activity,
  Fuel,
  Gauge,
  Sparkles,
  Building,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const {
    generator,
    updateGeneratorState,
    updateGeneratorInfo,
    subscribers,
    bills,
    receipts,
    tickets,
    language,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'subscribers' | 'billing' | 'finance' | 'tickets'>('subscribers');

  // Modals state
  const [isSubscriberModalOpen, setIsSubscriberModalOpen] = useState(false);
  const [subscriberToEdit, setSubscriberToEdit] = useState<Subscriber | null>(null);

  const [isQuickPaymentOpen, setIsQuickPaymentOpen] = useState(false);
  const [selectedSubscriberForPayment, setSelectedSubscriberForPayment] = useState<Subscriber | null>(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptToShow, setReceiptToShow] = useState<PaymentReceipt | null>(null);

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Metrics
  const totalAmperes = subscribers.reduce((acc, s) => acc + s.amperes, 0);
  const activeLinesCount = subscribers.filter((s) => s.status === 'active').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;

  const totalCollectedMonth = receipts.reduce((acc, r) => acc + r.amountPaid, 0);
  const totalDebts = subscribers.reduce((acc, s) => acc + s.balanceDue, 0);

  const handleOpenAddSubscriber = () => {
    setSubscriberToEdit(null);
    setIsSubscriberModalOpen(true);
  };

  const handleOpenEditSubscriber = (sub: Subscriber) => {
    setSubscriberToEdit(sub);
    setIsSubscriberModalOpen(true);
  };

  const handleOpenQuickPayment = (sub: Subscriber) => {
    setSelectedSubscriberForPayment(sub);
    setIsQuickPaymentOpen(true);
  };

  const handleReceiptGenerated = (receipt: PaymentReceipt) => {
    setReceiptToShow(receipt);
    setIsReceiptModalOpen(true);
  };

  const stateControls: {
    id: GeneratorState;
    label: string;
    icon: React.ReactNode;
    color: string;
    activeStyle: string;
  }[] = [
    {
      id: 'running',
      label: 'تشغيل المولدة ⚡',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-emerald-400',
      activeStyle: 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30',
    },
    {
      id: 'national_grid',
      label: 'الكهرباء الوطنية 🏛️',
      icon: <Building className="w-4 h-4" />,
      color: 'text-sky-400',
      activeStyle: 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30',
    },
    {
      id: 'maintenance',
      label: 'صيانة دورية 🛠️',
      icon: <Wrench className="w-4 h-4" />,
      color: 'text-amber-400',
      activeStyle: 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30',
    },
    {
      id: 'stopped',
      label: 'إيقاف كامل ⚠️',
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'text-rose-400',
      activeStyle: 'bg-rose-500 text-white shadow-md shadow-rose-500/30',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Generator Station Status & Power Controller */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#080c18] border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Station Overview */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">
                محطة التغذية: {generator.neighborhood}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white flex items-center gap-2 tracking-tight">
              <span>{generator.name}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              المشرف: <span className="text-slate-200 font-medium">{generator.ownerName}</span> ({generator.phone}) • قدرة التوليد:{' '}
              <span className="font-mono-num text-amber-400 font-semibold">{generator.capacityKva} kVA</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs sm:text-sm font-bold hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <Megaphone className="w-4 h-4 text-red-400" />
              <span>إرسال تعميم / تنبيه للحي</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">إجمالي المشتركين</p>
            <h3 className="text-2xl sm:text-3xl font-light text-white flex items-baseline gap-1.5 font-mono-num">
              {subscribers.length} <span className="text-emerald-400 text-xs font-bold font-sans">({activeLinesCount} شغال)</span>
            </h3>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">التحصيل الشهري</p>
            <h3 className="text-2xl sm:text-3xl font-light text-white flex items-baseline gap-1.5 font-mono-num">
              {totalCollectedMonth.toLocaleString()} <span className="text-slate-400 text-xs font-normal">د.ع</span>
            </h3>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">الأمبيرات المحجوزة</p>
            <h3 className="text-2xl sm:text-3xl font-light text-white flex items-baseline gap-1.5 font-mono-num">
              {totalAmperes} <span className="text-amber-500 text-xs font-bold font-sans">أمبير</span>
            </h3>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">الديون المستحقة</p>
            <h3 className="text-2xl sm:text-3xl font-light text-red-400 flex items-baseline gap-1.5 font-mono-num">
              {totalDebts.toLocaleString()} <span className="text-slate-400 text-xs font-normal">د.ع</span>
            </h3>
          </div>
        </div>

        {/* Live Gauges & Power Grid Mode Switcher */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Power Source Selector */}
          <div className="md:col-span-6 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
              التحكم بمصدر الطاقة الحالي وتنبيه المشتركين فورياً:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {stateControls.map((ctrl) => {
                const isSelected = generator.state === ctrl.id;
                return (
                  <button
                    key={ctrl.id}
                    onClick={() => updateGeneratorState(ctrl.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? ctrl.activeStyle
                        : 'bg-[#040710] text-slate-400 border border-slate-800 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {ctrl.icon}
                    <span>{ctrl.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Telemetry: Voltage, Frequency, Fuel */}
          <div className="md:col-span-6 grid grid-cols-3 gap-3">
            {/* Voltage */}
            <div className="p-3.5 bg-[#040710] rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block flex items-center justify-center gap-1">
                <Activity className="w-3 h-3 text-amber-400" />
                الفولتية
              </span>
              <span className="text-lg font-light font-mono-num text-white mt-0.5 block">
                {generator.currentVoltage > 0 ? `${generator.currentVoltage} V` : '0 V'}
              </span>
              <span className="text-[9px] text-emerald-400 font-medium">مستقرة ±2%</span>
            </div>

            {/* Frequency */}
            <div className="p-3.5 bg-[#040710] rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block flex items-center justify-center gap-1">
                <Gauge className="w-3 h-3 text-sky-400" />
                التردد
              </span>
              <span className="text-lg font-light font-mono-num text-sky-400 mt-0.5 block">
                {generator.state === 'running' ? `${generator.currentFrequency} Hz` : '50.0 Hz'}
              </span>
              <span className="text-[9px] text-slate-500">محرك ديزل</span>
            </div>

            {/* Diesel Tank */}
            <div className="p-3.5 bg-[#040710] rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block flex items-center justify-center gap-1">
                <Fuel className="w-3 h-3 text-amber-400" />
                خزان الكاز
              </span>
              <div className="mt-1 mb-1">
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${generator.dieselLevelPercent}%` }}></div>
                </div>
                <span className="text-sm font-light font-mono-num text-amber-400 block leading-none">
                  {generator.dieselLevelPercent}%
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-mono-num">~1,480 لتر</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#080c18] border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            activeTab === 'subscribers'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_4px_12px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>سجل المشتركين ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            activeTab === 'billing'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_4px_12px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>الفواتير والتحصيل</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            activeTab === 'finance'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_4px_12px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>المالية ومصاريف الكاز</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap relative ${
            activeTab === 'tickets'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_4px_12px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>الشكاوى وبلاغات الجوزات</span>
          {openTicketsCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {openTicketsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'subscribers' && (
        <SubscriberList
          onOpenAddModal={handleOpenAddSubscriber}
          onOpenEditModal={handleOpenEditSubscriber}
          onOpenQuickPayment={handleOpenQuickPayment}
        />
      )}

      {activeTab === 'billing' && (
        <BillingManager
          onOpenThermalReceipt={(receipt) => {
            setReceiptToShow(receipt);
            setIsReceiptModalOpen(true);
          }}
          onOpenQuickPayment={handleOpenQuickPayment}
        />
      )}

      {activeTab === 'finance' && <FinancialLedger />}

      {activeTab === 'tickets' && <TicketManager />}

      {/* Modals */}
      <SubscriberModal
        isOpen={isSubscriberModalOpen}
        onClose={() => setIsSubscriberModalOpen(false)}
        subscriberToEdit={subscriberToEdit}
      />

      <QuickPaymentModal
        isOpen={isQuickPaymentOpen}
        onClose={() => setIsQuickPaymentOpen(false)}
        subscriber={selectedSubscriberForPayment}
        onReceiptGenerated={handleReceiptGenerated}
      />

      <ThermalReceiptModal
        receipt={receiptToShow}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      <OutageBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
      />
    </div>
  );
};
